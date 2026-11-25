// VICE CITY: STREET LIFE - Camera Manager
// Handles different camera modes and smooth following

import * as THREE from 'three';

export class CameraManager {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        
        // Camera modes
        this.modes = {
            chase: {
                distance: 8,
                height: 2,
                offset: 0,
                fov: 75,
                smoothing: 0.1
            },
            closeChase: {
                distance: 4,
                height: 1,
                offset: 0,
                fov: 70,
                smoothing: 0.15
            },
            hood: {
                distance: 2,
                height: 0.5,
                offset: 0,
                fov: 65,
                smoothing: 0.2
            },
            interior: {
                distance: 0,
                height: 0,
                offset: 0,
                fov: 60,
                smoothing: 0.3
            },
            cinematic: {
                distance: 15,
                height: 5,
                offset: 0,
                fov: 80,
                smoothing: 0.05
            }
        };
        
        // Current mode
        this.currentMode = 'chase';
        this.target = null;
        
        // Camera state
        this.state = {
            position: new THREE.Vector3(),
            targetPosition: new THREE.Vector3(),
            lookAt: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            rotation: new THREE.Euler(),
            fov: 75
        };
        
        // Camera shake
        this.shake = {
            intensity: 0,
            duration: 0,
            time: 0
        };
        
        // Camera collision
        this.collision = {
            enabled: true,
            distance: 2,
            raycastResults: []
        };
        
        // Smoothing
        this.smoothing = 0.1;
    }
    
    setTarget(target) {
        this.target = target;
    }
    
    setMode(mode) {
        if (this.modes[mode]) {
            this.currentMode = mode;
            const modeConfig = this.modes[mode];
            this.smoothing = modeConfig.smoothing;
            this.camera.fov = modeConfig.fov;
            this.camera.updateProjectionMatrix();
        }
    }
    
    getMode() {
        return this.currentMode;
    }
    
    cycleMode() {
        const modeNames = Object.keys(this.modes);
        const currentIndex = modeNames.indexOf(this.currentMode);
        const nextIndex = (currentIndex + 1) % modeNames.length;
        this.setMode(modeNames[nextIndex]);
    }
    
    reset() {
        this.state.position.set(0, 0, 0);
        this.state.targetPosition.set(0, 0, 0);
        this.state.lookAt.set(0, 0, 0);
        this.state.velocity.set(0, 0, 0);
        this.state.rotation.set(0, 0, 0);
        this.shake.intensity = 0;
        this.shake.duration = 0;
        this.shake.time = 0;
    }
    
    update(deltaTime, vehicle) {
        if (!this.target || !vehicle) return;
        
        const modeConfig = this.modes[this.currentMode];
        
        // Calculate ideal camera position based on mode
        const idealPosition = this.calculateIdealPosition(modeConfig, vehicle);
        
        // Apply smoothing
        this.state.position.lerp(idealPosition, this.smoothing * 60 * deltaTime);
        
        // Calculate look at position
        const lookAtPosition = this.calculateLookAtPosition(modeConfig, vehicle);
        
        // Apply camera shake
        this.applyShake(deltaTime);
        
        // Apply collision avoidance
        if (this.collision.enabled) {
            this.avoidCollision(vehicle);
        }
        
        // Update camera
        this.camera.position.copy(this.state.position);
        this.camera.lookAt(lookAtPosition);
        
        // Update state
        this.state.targetPosition.copy(idealPosition);
        this.state.lookAt.copy(lookAtPosition);
    }
    
    calculateIdealPosition(modeConfig, vehicle) {
        const targetPosition = vehicle.mesh.position.clone();
        const targetRotation = vehicle.mesh.rotation.clone();
        
        // Calculate offset based on vehicle direction
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyEuler(targetRotation);
        forward.negate(); // Camera looks at vehicle, so we need opposite direction
        
        const right = new THREE.Vector3(1, 0, 0);
        right.applyEuler(targetRotation);
        
        // Apply mode-specific positioning
        let position = targetPosition.clone();
        
        if (modeConfig.distance > 0) {
            // Chase cameras
            position.add(forward.multiplyScalar(modeConfig.distance));
            position.y += modeConfig.height;
            
            // Add side offset for better view
            position.add(right.multiplyScalar(modeConfig.offset));
        } else {
            // Interior camera
            position.copy(targetPosition);
            position.y += modeConfig.height;
            position.add(forward.multiplyScalar(modeConfig.offset));
        }
        
        return position;
    }
    
    calculateLookAtPosition(modeConfig, vehicle) {
        const targetPosition = vehicle.mesh.position.clone();
        const targetRotation = vehicle.mesh.rotation.clone();
        
        if (this.currentMode === 'interior') {
            // Look slightly forward from inside the car
            const forward = new THREE.Vector3(0, 0, 1);
            forward.applyEuler(targetRotation);
            return targetPosition.clone().add(forward.multiplyScalar(5));
        } else if (this.currentMode === 'hood') {
            // Look forward from hood
            const forward = new THREE.Vector3(0, 0, 1);
            forward.applyEuler(targetRotation);
            return targetPosition.clone().add(forward.multiplyScalar(10));
        } else {
            // Look at vehicle
            return targetPosition.clone();
        }
    }
    
    applyShake(deltaTime) {
        if (this.shake.intensity > 0) {
            this.shake.time += deltaTime;
            
            if (this.shake.time >= this.shake.duration) {
                this.shake.intensity = 0;
                this.shake.duration = 0;
                this.shake.time = 0;
            } else {
                // Calculate shake offset
                const progress = this.shake.time / this.shake.duration;
                const intensity = this.shake.intensity * (1 - progress);
                
                const shakeX = (Math.random() - 0.5) * intensity * 0.1;
                const shakeY = (Math.random() - 0.5) * intensity * 0.1;
                
                this.camera.position.x += shakeX;
                this.camera.position.y += shakeY;
            }
        }
    }
    
    addShake(intensity, duration) {
        this.shake.intensity = Math.max(this.shake.intensity, intensity);
        this.shake.duration = Math.max(this.shake.duration, duration);
        this.shake.time = 0;
    }
    
    avoidCollision(vehicle) {
        // Simple raycast to avoid obstacles between camera and vehicle
        const modeConfig = this.modes[this.currentMode];
        if (modeConfig.distance <= 0) return; // Skip for interior camera
        
        const cameraDirection = this.camera.position.clone().sub(vehicle.mesh.position).normalize();
        const raycastDistance = modeConfig.distance;
        
        // Create ray
        const raycaster = new THREE.Raycaster(
            vehicle.mesh.position,
            cameraDirection,
            0,
            raycastDistance
        );
        
        // Check for intersections with world objects
        // Note: This requires collidable objects to have userData.collidable = true
        const intersects = raycaster.intersectObjects(this.scene.children.filter(obj => 
            obj.userData && obj.userData.collidable
        ));
        
        if (intersects.length > 0) {
            // Find closest intersection
            const closest = intersects[0];
            
            // Move camera to intersection point + small offset
            const newDistance = closest.distance - this.collision.distance;
            const newPosition = vehicle.mesh.position.clone().add(
                cameraDirection.multiplyScalar(newDistance)
            );
            
            // Smoothly move camera to new position
            this.state.position.lerp(newPosition, this.smoothing * 2);
        }
    }
    
    // Get camera info for UI
    getInfo() {
        return {
            mode: this.currentMode,
            position: this.camera.position.clone(),
            fov: this.camera.fov
        };
    }
}
