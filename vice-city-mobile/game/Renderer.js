// VICE CITY: STREET LIFE - Renderer Class
// Handles Three.js scene, camera, and rendering

import * as THREE from 'three';

export class Renderer {
    constructor(settings) {
        this.settings = settings;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;
        this.light = null;
        this.ambientLight = null;
        this.skybox = null;
        
        // Performance stats
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
    }
    
    async init() {
        console.log('Renderer: Initializing...');
        
        // Get canvas from DOM
        this.canvas = document.querySelector('canvas') || this.createCanvas();
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111122);
        this.scene.fog = new THREE.Fog(0x111122, 100, 500);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: this.settings.graphics.antiAliasing,
            alpha: false
        });
        
        // Configure renderer
        this.updateRendererSettings();
        
        // Setup resize handler
        window.addEventListener('resize', () => this.onResize());
        
        // Create lights
        this.createLights();
        
        // Create skybox
        await this.createSkybox();
        
        console.log('Renderer: Initialized');
    }
    
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'game-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        document.body.appendChild(canvas);
        return canvas;
    }
    
    createLights() {
        // Directional light (sun)
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(100, 100, 50);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        this.light.shadow.camera.near = 0.5;
        this.light.shadow.camera.far = 500;
        this.light.shadow.camera.left = -200;
        this.light.shadow.camera.right = 200;
        this.light.shadow.camera.top = 200;
        this.light.shadow.camera.bottom = -200;
        this.scene.add(this.light);
        
        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(this.ambientLight);
        
        // Hemisphere light for sky/ground color
        const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3);
        this.scene.add(hemiLight);
    }
    
    async createSkybox() {
        // Simple gradient skybox for now
        // Will be enhanced with proper textures later
        const skyGeometry = new THREE.SphereGeometry(500, 60, 40);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0x001133) },
                offset: { value: 20 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        this.skybox = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(this.skybox);
    }
    
    updateRendererSettings() {
        if (!this.renderer) return;
        
        const gfx = this.settings.graphics;
        
        // Size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Shadows
        this.renderer.shadowMap.enabled = gfx.shadows !== 'none';
        this.renderer.shadowMap.type = gfx.shadows === 'high' 
            ? THREE.PCFSoftShadowMap 
            : THREE.BasicShadowMap;
        
        // Tone mapping
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Color space
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    
    onResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    render() {
        if (!this.renderer) return;
        
        // Update FPS counter
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        window.removeEventListener('resize', this.onResize);
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        console.log('Renderer: Destroyed');
    }
}
