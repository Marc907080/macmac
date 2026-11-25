// VICE CITY: STREET LIFE - Vehicle Class
// Handles vehicle physics, rendering, and controls

import * as THREE from 'three';

export class Vehicle {
    constructor(scene, settings) {
        this.scene = scene;
        this.settings = settings;
        
        // Vehicle mesh
        this.mesh = null;
        this.chassis = null;
        this.wheels = [];
        this.wheelMeshes = [];
        
        // Vehicle state
        this.state = {
            position: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0, 'YXZ'),
            angularVelocity: new THREE.Vector3(0, 0, 0),
            steering: 0,
            throttle: 0,
            brake: 0,
            handbrake: false,
            nitro: false,
            gear: 0, // -1 = reverse, 0 = neutral, 1+ = forward gears
            rpm: 0,
            speed: 0,
            isGrounded: true,
            collision: false
        };
        
        // Vehicle physics properties
        this.physics = {
            mass: 1500, // kg
            acceleration: 8, // m/s²
            maxSpeed: 60, // m/s (~216 km/h)
            reverseSpeed: 15, // m/s
            brakingForce: 15,
            handbrakeForce: 25,
            steeringSpeed: 2.5, // radians/s
            maxSteeringAngle: Math.PI / 4, // ~45 degrees
            traction: 0.95,
            drag: 0.02,
            rollingResistance: 0.01,
            gravity: 9.81,
            wheelBase: 2.5, // distance between front and rear axles
            trackWidth: 1.8, // distance between left and right wheels
            wheelRadius: 0.3,
            wheelWidth: 0.2,
            suspensionTravel: 0.2,
            suspensionStiffness: 100,
            suspensionDamping: 20
        };
        
        // Vehicle specs
        this.specs = {
            name: 'Street Racer',
            class: 'Sports',
            topSpeed: 220, // km/h
            acceleration: 0,
            handling: 0.8,
            braking: 0.9,
            grip: 0.9
        };
        
        // Materials
        this.materials = {
            body: null,
            window: null,
            wheel: null,
            rim: null,
            interior: null
        };
        
        // Headlights
        this.headlights = [];
        this.brakelights = [];
        
        // Colors
        this.colors = {
            body: 0xff0000,
            window: 0x00aaff,
            wheel: 0x111111,
            rim: 0xcccccc,
            interior: 0x333333
        };
        
        // Time since last update
        this.lastUpdate = 0;
    }
    
    async init() {
        console.log('Vehicle: Initializing...');
        
        // Create materials
        this.createMaterials();
        
        // Create vehicle mesh
        await this.createMesh();
        
        // Add to scene
        this.scene.add(this.mesh);
        
        // Create lights
        this.createLights();
        
        console.log('Vehicle: Initialized');
    }
    
    createMaterials() {
        this.materials.body = new THREE.MeshStandardMaterial({
            color: this.colors.body,
            roughness: 0.3,
            metalness: 0.5
        });
        
        this.materials.window = new THREE.MeshStandardMaterial({
            color: this.colors.window,
            transparent: true,
            opacity: 0.5,
            roughness: 0.1,
            metalness: 0.1
        });
        
        this.materials.wheel = new THREE.MeshStandardMaterial({
            color: this.colors.wheel,
            roughness: 0.8,
            metalness: 0.1
        });
        
        this.materials.rim = new THREE.MeshStandardMaterial({
            color: this.colors.rim,
            roughness: 0.4,
            metalness: 0.7
        });
        
        this.materials.interior = new THREE.MeshStandardMaterial({
            color: this.colors.interior,
            roughness: 0.7,
            metalness: 0.2
        });
    }
    
    async createMesh() {
        this.mesh = new THREE.Group();
        
        // Create chassis
        this.chassis = this.createChassis();
        this.mesh.add(this.chassis);
        
        // Create wheels
        this.wheels = [
            { position: new THREE.Vector3(-1.2, -0.3, 0.8), rotation: 0, steerable: true },
            { position: new THREE.Vector3(1.2, -0.3, 0.8), rotation: 0, steerable: true },
            { position: new THREE.Vector3(-1.2, -0.3, -0.8), rotation: 0, steerable: false },
            { position: new THREE.Vector3(1.2, -0.3, -0.8), rotation: 0, steerable: false }
        ];
        
        for (let i = 0; i < this.wheels.length; i++) {
            const wheelMesh = this.createWheel();
            wheelMesh.position.copy(this.wheels[i].position);
            this.mesh.add(wheelMesh);
            this.wheelMeshes.push(wheelMesh);
        }
        
        // Create interior (simplified)
        const interior = this.createInterior();
        this.mesh.add(interior);
        
        // Set initial position
        this.mesh.position.copy(this.state.position);
        this.mesh.rotation.copy(this.state.rotation);
        
        // Enable shadows
        this.mesh.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }
    
    createChassis() {
        const group = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(2.5, 1.2, 4.5);
        const body = new THREE.Mesh(bodyGeometry, this.materials.body);
        body.position.y = 0.6;
        group.add(body);
        
        // Front bumper
        const frontBumperGeometry = new THREE.BoxGeometry(2.2, 0.3, 0.3);
        const frontBumper = new THREE.Mesh(frontBumperGeometry, this.materials.body);
        frontBumper.position.set(0, 0.2, 2.4);
        group.add(frontBumper);
        
        // Rear bumper
        const rearBumperGeometry = new THREE.BoxGeometry(2.2, 0.3, 0.3);
        const rearBumper = new THREE.Mesh(rearBumperGeometry, this.materials.body);
        rearBumper.position.set(0, 0.2, -2.4);
        group.add(rearBumper);
        
        // Hood
        const hoodGeometry = new THREE.BoxGeometry(1.5, 0.2, 1.5);
        const hood = new THREE.Mesh(hoodGeometry, this.materials.body);
        hood.position.set(0, 1.1, 1.5);
        hood.rotation.x = -0.1;
        group.add(hood);
        
        // Trunk
        const trunkGeometry = new THREE.BoxGeometry(2, 0.3, 0.8);
        const trunk = new THREE.Mesh(trunkGeometry, this.materials.body);
        trunk.position.set(0, 0.8, -2.2);
        group.add(trunk);
        
        // Roof
        const roofGeometry = new THREE.BoxGeometry(1.8, 0.2, 2.5);
        const roof = new THREE.Mesh(roofGeometry, this.materials.body);
        roof.position.set(0, 1.4, 0);
        group.add(roof);
        
        // Windows
        const windowGeometry = new THREE.BoxGeometry(0.1, 0.8, 1);
        const windowMaterial = this.materials.window;
        
        // Front windshield
        const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        frontWindow.position.set(0, 1, 1.8);
        frontWindow.rotation.x = -0.3;
        group.add(frontWindow);
        
        // Rear window
        const rearWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        rearWindow.position.set(0, 1, -1.8);
        rearWindow.rotation.x = 0.3;
        group.add(rearWindow);
        
        // Side windows
        const sideWindowGeometry = new THREE.BoxGeometry(0.1, 0.6, 1.5);
        const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        leftWindow.position.set(-1, 1, 0);
        group.add(leftWindow);
        
        const rightWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        rightWindow.position.set(1, 1, 0);
        group.add(rightWindow);
        
        // Spoiler
        const spoilerGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.2);
        const spoiler = new THREE.Mesh(spoilerGeometry, this.materials.body);
        spoiler.position.set(0, 1.2, -2.3);
        spoiler.rotation.x = 0.2;
        group.add(spoiler);
        
        return group;
    }
    
    createWheel() {
        const group = new THREE.Group();
        
        // Tire
        const tireGeometry = new THREE.CylinderGeometry(
            this.physics.wheelRadius,
            this.physics.wheelRadius,
            this.physics.wheelWidth,
            16
        );
        tireGeometry.rotateX(Math.PI / 2);
        const tire = new THREE.Mesh(tireGeometry, this.materials.wheel);
        group.add(tire);
        
        // Rim
        const rimGeometry = new THREE.CylinderGeometry(
            this.physics.wheelRadius * 0.8,
            this.physics.wheelRadius * 0.8,
            this.physics.wheelWidth * 1.1,
            16
        );
        rimGeometry.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeometry, this.materials.rim);
        group.add(rim);
        
        return group;
    }
    
    createInterior() {
        const group = new THREE.Group();
        
        // Dashboard
        const dashboardGeometry = new THREE.BoxGeometry(1.4, 0.1, 0.3);
        const dashboard = new THREE.Mesh(dashboardGeometry, this.materials.interior);
        dashboard.position.set(0, 0.5, 1.2);
        group.add(dashboard);
        
        // Seats
        const seatGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.5);
        const seatMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const leftSeat = new THREE.Mesh(seatGeometry, seatMaterial);
        leftSeat.position.set(-0.5, 0.4, 0.5);
        group.add(leftSeat);
        
        const rightSeat = new THREE.Mesh(seatGeometry, seatMaterial);
        rightSeat.position.set(0.5, 0.4, 0.5);
        group.add(rightSeat);
        
        // Steering wheel
        const steeringWheelGeometry = new THREE.TorusGeometry(0.2, 0.05, 16, 32);
        const steeringWheel = new THREE.Mesh(steeringWheelGeometry, this.materials.interior);
        steeringWheel.position.set(-0.3, 0.7, 1.3);
        steeringWheel.rotation.x = Math.PI / 2;
        group.add(steeringWheel);
        
        return group;
    }
    
    createLights() {
        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const headlightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00
        });
        
        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(-0.5, 0.3, 2.4);
        this.mesh.add(leftHeadlight);
        this.headlights.push(leftHeadlight);
        
        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(0.5, 0.3, 2.4);
        this.mesh.add(rightHeadlight);
        this.headlights.push(rightHeadlight);
        
        // Add point lights for headlights
        const leftHeadlightLight = new THREE.SpotLight(0xffffaa, 0.5, 50, Math.PI / 6, 0.5);
        leftHeadlightLight.position.set(-0.5, 0.5, 2.5);
        leftHeadlightLight.target.position.set(-1, 0, 0);
        leftHeadlightLight.castShadow = true;
        this.mesh.add(leftHeadlightLight);
        this.mesh.add(leftHeadlightLight.target);
        this.headlights.push(leftHeadlightLight);
        
        const rightHeadlightLight = new THREE.SpotLight(0xffffaa, 0.5, 50, Math.PI / 6, 0.5);
        rightHeadlightLight.position.set(0.5, 0.5, 2.5);
        rightHeadlightLight.target.position.set(1, 0, 0);
        rightHeadlightLight.castShadow = true;
        this.mesh.add(rightHeadlightLight);
        this.mesh.add(rightHeadlightLight.target);
        this.headlights.push(rightHeadlightLight);
        
        // Brake lights
        const brakeLightGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const brakeLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            emissive: 0xff0000
        });
        
        const leftBrakeLight = new THREE.Mesh(brakeLightGeometry, brakeLightMaterial);
        leftBrakeLight.position.set(-0.5, 0.3, -2.4);
        leftBrakeLight.visible = false;
        this.mesh.add(leftBrakeLight);
        this.brakelights.push(leftBrakeLight);
        
        const rightBrakeLight = new THREE.Mesh(brakeLightGeometry, brakeLightMaterial);
        rightBrakeLight.position.set(0.5, 0.3, -2.4);
        rightBrakeLight.visible = false;
        this.mesh.add(rightBrakeLight);
        this.brakelights.push(rightBrakeLight);
        
        // Reverse lights
        const reverseLightGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const reverseLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            emissive: 0xffffff
        });
        
        const leftReverseLight = new THREE.Mesh(reverseLightGeometry, reverseLightMaterial);
        leftReverseLight.position.set(-0.5, 0.2, -2.4);
        leftReverseLight.visible = false;
        this.mesh.add(leftReverseLight);
        
        const rightReverseLight = new THREE.Mesh(reverseLightGeometry, reverseLightMaterial);
        rightReverseLight.position.set(0.5, 0.2, -2.4);
        rightReverseLight.visible = false;
        this.mesh.add(rightReverseLight);
    }
    
    update(deltaTime, input, touchControls) {
        // Get input
        const steeringInput = input.getSteeringInput();
        const throttleInput = input.getThrottleInput();
        const brakeInput = input.getBrakeInput();
        const handbrakeInput = input.getHandbrakeInput();
        const nitroInput = input.getNitroInput();
        
        // Also check touch controls
        if (touchControls) {
            if (touchControls.steeringLeft) steeringInput -= 1;
            if (touchControls.steeringRight) steeringInput += 1;
            if (touchControls.accelerate) throttleInput = 1;
            if (touchControls.brake) brakeInput = 1;
        }
        
        // Update state
        this.state.steering = steeringInput;
        this.state.throttle = throttleInput;
        this.state.brake = brakeInput;
        this.state.handbrake = handbrakeInput;
        this.state.nitro = nitroInput;
        
        // Update physics
        this.updatePhysics(deltaTime);
        
        // Update visuals
        this.updateVisuals(deltaTime);
        
        // Update lights
        this.updateLights();
    }
    
    updatePhysics(deltaTime) {
        // Apply steering
        const targetSteeringAngle = this.state.steering * this.physics.maxSteeringAngle;
        this.state.angularVelocity.y = (targetSteeringAngle - this.state.rotation.y) * this.physics.steeringSpeed;
        
        // Apply throttle
        if (this.state.throttle > 0) {
            // Accelerate forward
            const acceleration = this.physics.acceleration * this.state.throttle;
            const forward = this.getForwardVector();
            this.state.velocity.add(forward.multiplyScalar(acceleration * deltaTime));
            
            // Gear shifting
            const speedKmh = this.state.speed * 3.6;
            if (speedKmh > 20 && this.state.gear < 5) {
                this.state.gear = Math.min(5, this.state.gear + 1);
            }
        } else if (this.state.brake > 0) {
            // Brake
            const brakingForce = this.physics.brakingForce * this.state.brake * (this.state.handbrake ? 2 : 1);
            this.state.velocity.multiplyScalar(Math.max(0, 1 - brakingForce * deltaTime));
            
            // Shift to lower gear or reverse
            if (this.state.velocity.length() < 1 && this.state.gear > 0) {
                this.state.gear = Math.max(0, this.state.gear - 1);
            }
        }
        
        // Apply handbrake (drifting)
        if (this.state.handbrake) {
            // Increase rotation when handbraking
            this.state.angularVelocity.y *= 1.5;
        }
        
        // Apply nitro
        if (this.state.nitro && this.state.speed > 10) {
            const nitroBoost = 2.0;
            const forward = this.getForwardVector();
            this.state.velocity.add(forward.multiplyScalar(nitroBoost * deltaTime));
        }
        
        // Apply drag
        const drag = this.physics.drag * this.state.velocity.length();
        this.state.velocity.multiplyScalar(Math.max(0, 1 - drag * deltaTime));
        
        // Apply rolling resistance
        const rollingResistance = this.physics.rollingResistance * this.state.velocity.length();
        this.state.velocity.multiplyScalar(Math.max(0, 1 - rollingResistance * deltaTime));
        
        // Apply gravity (for jumps/bumps)
        if (!this.state.isGrounded) {
            this.state.velocity.y -= this.physics.gravity * deltaTime;
        }
        
        // Update position
        this.state.position.add(this.state.velocity.clone().multiplyScalar(deltaTime));
        
        // Update rotation
        this.state.rotation.y += this.state.angularVelocity.y * deltaTime;
        
        // Clamp rotation to prevent flipping
        this.state.rotation.x = 0;
        this.state.rotation.z = 0;
        
        // Update speed and RPM
        this.state.speed = this.state.velocity.length();
        this.state.rpm = this.state.speed * 100 * (this.state.gear + 1);
        
        // Gear 0 = Neutral, Gear -1 = Reverse
        if (this.state.gear === 0 && this.state.throttle > 0) {
            this.state.gear = 1;
        }
        
        // Reverse
        if (this.state.gear === -1) {
            // Apply reverse acceleration
            const reverseAcceleration = this.physics.acceleration * 0.5 * this.state.throttle;
            const forward = this.getForwardVector();
            this.state.velocity.add(forward.multiplyScalar(-reverseAcceleration * deltaTime));
        }
        
        // Limit maximum speed
        const maxSpeed = this.physics.maxSpeed * (this.state.nitro ? 1.5 : 1);
        if (this.state.speed > maxSpeed) {
            this.state.velocity.multiplyScalar(maxSpeed / this.state.speed);
            this.state.speed = maxSpeed;
        }
        
        // Collision detection (simplified)
        this.checkCollisions();
        
        // Keep vehicle grounded
        if (this.state.position.y < 0.3) {
            this.state.position.y = 0.3;
            this.state.velocity.y = 0;
            this.state.isGrounded = true;
        } else {
            this.state.isGrounded = false;
        }
        
        // Update mesh position and rotation
        this.mesh.position.copy(this.state.position);
        this.mesh.rotation.copy(this.state.rotation);
    }
    
    updateVisuals(deltaTime) {
        // Rotate wheels based on speed
        const wheelRotationSpeed = this.state.speed * 10;
        const wheelRotation = this.wheelMeshes[0].rotation.x + wheelRotationSpeed * deltaTime;
        
        for (let i = 0; i < this.wheelMeshes.length; i++) {
            this.wheelMeshes[i].rotation.x = wheelRotation;
            
            // Steer front wheels
            if (this.wheels[i].steerable) {
                this.wheelMeshes[i].rotation.y = this.state.steering * this.physics.maxSteeringAngle * 0.5;
            }
        }
        
        // Suspension simulation
        const suspensionOffset = Math.sin(this.state.position.x * 0.1 + this.state.position.z * 0.1) * 0.02;
        for (let i = 0; i < this.wheelMeshes.length; i++) {
            this.wheelMeshes[i].position.y = this.wheels[i].position.y + suspensionOffset;
        }
    }
    
    updateLights() {
        // Update brake lights based on braking
        const shouldBrakeLight = this.state.brake > 0 || (this.state.throttle === 0 && this.state.speed > 1);
        
        for (const light of this.brakelights) {
            if (light instanceof THREE.Mesh) {
                light.visible = shouldBrakeLight;
            }
        }
        
        // Update headlights based on time of day (placeholder)
        // For now, always on when moving
        const shouldHeadlight = this.state.speed > 1 || this.state.throttle > 0;
        
        for (let i = 0; i < this.headlights.length; i++) {
            const light = this.headlights[i];
            if (light instanceof THREE.SpotLight) {
                light.intensity = shouldHeadlight ? 0.5 : 0;
            } else if (light instanceof THREE.Mesh) {
                light.material.emissiveIntensity = shouldHeadlight ? 0.5 : 0;
            }
        }
    }
    
    checkCollisions() {
        // Simple collision detection with world boundaries
        const boundary = 450;
        
        if (this.state.position.x < -boundary) {
            this.state.position.x = -boundary;
            this.state.velocity.x *= -0.5;
            this.state.collision = true;
        } else if (this.state.position.x > boundary) {
            this.state.position.x = boundary;
            this.state.velocity.x *= -0.5;
            this.state.collision = true;
        }
        
        if (this.state.position.z < -boundary) {
            this.state.position.z = -boundary;
            this.state.velocity.z *= -0.5;
            this.state.collision = true;
        } else if (this.state.position.z > boundary) {
            this.state.position.z = boundary;
            this.state.velocity.z *= -0.5;
            this.state.collision = true;
        }
        
        // Check for building collisions (simplified)
        // This will be enhanced in later phases
    }
    
    getForwardVector() {
        const euler = new THREE.Euler(0, this.state.rotation.y, 0, 'YXZ');
        const direction = new THREE.Vector3(0, 0, 1);
        direction.applyEuler(euler);
        return direction.normalize();
    }
    
    getRightVector() {
        const euler = new THREE.Euler(0, this.state.rotation.y, 0, 'YXZ');
        const direction = new THREE.Vector3(1, 0, 0);
        direction.applyEuler(euler);
        return direction.normalize();
    }
    
    // Public methods
    setPosition(x, y, z) {
        this.state.position.set(x, y, z);
        if (this.mesh) {
            this.mesh.position.set(x, y, z);
        }
    }
    
    setRotation(y) {
        this.state.rotation.y = y;
        if (this.mesh) {
            this.mesh.rotation.y = y;
        }
    }
    
    reset() {
        this.state.position.set(0, 0.5, 0);
        this.state.velocity.set(0, 0, 0);
        this.state.rotation.set(0, 0, 0);
        this.state.angularVelocity.set(0, 0, 0);
        this.state.steering = 0;
        this.state.throttle = 0;
        this.state.brake = 0;
        this.state.handbrake = false;
        this.state.nitro = false;
        this.state.gear = 0;
        this.state.rpm = 0;
        this.state.speed = 0;
        this.state.isGrounded = true;
        this.state.collision = false;
        
        if (this.mesh) {
            this.mesh.position.set(0, 0.5, 0);
            this.mesh.rotation.set(0, 0, 0);
        }
        
        // Reset wheel rotations
        for (let i = 0; i < this.wheelMeshes.length; i++) {
            this.wheelMeshes[i].rotation.x = 0;
            this.wheelMeshes[i].rotation.y = 0;
        }
    }
    
    // Customization methods (for garage)
    setColor(color) {
        this.colors.body = color;
        this.materials.body.color.setHex(color);
    }
    
    setWindowTint(tint) {
        this.colors.window = tint;
        this.materials.window.color.setHex(tint);
    }
    
    setRimColor(color) {
        this.colors.rim = color;
        this.materials.rim.color.setHex(color);
    }
    
    // Get vehicle info
    getInfo() {
        return {
            name: this.specs.name,
            class: this.specs.class,
            speed: Math.round(this.state.speed * 3.6), // Convert to km/h
            rpm: Math.round(this.state.rpm),
            gear: this.state.gear === -1 ? 'R' : this.state.gear === 0 ? 'N' : this.state.gear,
            position: this.state.position.clone()
        };
    }
}
