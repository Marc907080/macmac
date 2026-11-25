// VICE CITY: STREET LIFE - Core Game Class
// Handles game state, initialization, and main loop

import { Renderer } from './Renderer.js';
import { InputManager } from './InputManager.js';
import { World } from './World.js';
import { Vehicle } from './Vehicle.js';
import { CameraManager } from './CameraManager.js';
import { UIManager } from './UIManager.js';
import { Settings } from './Settings.js';
import { SaveSystem } from './SaveSystem.js';

export class Game {
    constructor() {
        // Game state
        this.state = {
            current: 'loading', // loading, menu, playing, paused, racing, garage
            previous: null,
            initialized: false,
            assetsLoaded: false
        };
        
        // Game components
        this.renderer = null;
        this.input = null;
        this.world = null;
        this.vehicle = null;
        this.cameraManager = null;
        this.ui = null;
        this.settings = new Settings();
        this.saveSystem = new SaveSystem();
        
        // Game time
        this.clock = new THREE.Clock();
        this.deltaTime = 0;
        this.elapsedTime = 0;
        
        // Animation frame
        this.animationFrameId = null;
        
        // Touch control state
        this.touchControls = {
            steeringLeft: false,
            steeringRight: false,
            accelerate: false,
            brake: false
        };
        
        // Race state
        this.raceState = {
            active: false,
            countdown: 0,
            started: false,
            position: 1,
            timer: 0
        };
    }
    
    async init() {
        console.log('Game: Initializing...');
        
        // Initialize settings
        await this.settings.load();
        
        // Initialize renderer
        this.renderer = new Renderer(this.settings);
        await this.renderer.init();
        
        // Initialize input manager
        this.input = new InputManager(this);
        this.input.init();
        
        // Initialize camera manager
        this.cameraManager = new CameraManager(this.renderer.camera, this.renderer.scene);
        
        // Initialize world
        this.world = new World(this.renderer.scene, this.settings);
        
        // Initialize UI
        this.ui = new UIManager(this);
        this.ui.init();
        
        // Initialize save system
        await this.saveSystem.init();
        
        this.state.initialized = true;
        console.log('Game: Initialized successfully');
    }
    
    async loadAssets() {
        console.log('Game: Loading assets...');
        
        // Load world assets
        await this.world.loadAssets();
        
        // Create initial world
        await this.world.create();
        
        // Create vehicle
        this.vehicle = new Vehicle(this.renderer.scene, this.settings);
        await this.vehicle.init();
        
        // Position vehicle in world
        this.vehicle.setPosition(0, 0.5, 0);
        
        // Setup camera to follow vehicle
        this.cameraManager.setTarget(this.vehicle.mesh);
        this.cameraManager.setMode('chase');
        
        this.state.assetsLoaded = true;
        console.log('Game: Assets loaded');
    }
    
    start() {
        console.log('Game: Starting...');
        
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Show main menu
        this.showMainMenu();
        
        // Start game loop
        this.gameLoop();
    }
    
    gameLoop() {
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
        
        this.deltaTime = this.clock.getDelta();
        this.elapsedTime += this.deltaTime;
        
        // Update based on state
        switch (this.state.current) {
            case 'playing':
            case 'racing':
                this.updateGame();
                break;
            case 'paused':
                // Still render but don't update game logic
                break;
        }
        
        // Always render
        this.render();
    }
    
    updateGame() {
        // Update input
        this.input.update(this.deltaTime);
        
        // Update vehicle
        if (this.vehicle) {
            this.vehicle.update(this.deltaTime, this.input, this.touchControls);
        }
        
        // Update camera
        if (this.cameraManager) {
            this.cameraManager.update(this.deltaTime, this.vehicle);
        }
        
        // Update world
        if (this.world) {
            this.world.update(this.deltaTime);
        }
        
        // Update UI
        if (this.ui) {
            this.ui.update(this.deltaTime, this.vehicle, this.raceState);
        }
        
        // Update race state
        if (this.raceState.active && this.raceState.started) {
            this.raceState.timer += this.deltaTime;
        }
    }
    
    render() {
        if (this.renderer) {
            this.renderer.render();
        }
    }
    
    // State management
    showLoadingScreen() {
        document.getElementById('loading-screen').classList.remove('hidden');
        this.state.current = 'loading';
    }
    
    hideLoadingScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
    }
    
    showMainMenu() {
        document.getElementById('main-menu').classList.add('active');
        document.getElementById('hud').classList.remove('active');
        document.getElementById('touch-controls').classList.remove('active');
        this.state.current = 'menu';
    }
    
    hideMainMenu() {
        document.getElementById('main-menu').classList.remove('active');
    }
    
    startFreeRoam() {
        console.log('Starting Free Roam...');
        
        this.hideMainMenu();
        document.getElementById('hud').classList.add('active');
        document.getElementById('touch-controls').classList.add('active');
        
        // Reset vehicle
        if (this.vehicle) {
            this.vehicle.reset();
            this.vehicle.setPosition(0, 0.5, 0);
        }
        
        // Reset camera
        if (this.cameraManager) {
            this.cameraManager.reset();
            this.cameraManager.setTarget(this.vehicle.mesh);
        }
        
        this.state.current = 'playing';
        
        // Show notification
        this.ui.showNotification('Free Roam Mode - Drive anywhere!');
    }
    
    startRace() {
        console.log('Starting Race...');
        
        this.hideMainMenu();
        document.getElementById('hud').classList.add('active');
        document.getElementById('touch-controls').classList.add('active');
        document.getElementById('race-hud').classList.add('active');
        
        // Reset race state
        this.raceState = {
            active: true,
            countdown: 3,
            started: false,
            position: 1,
            timer: 0
        };
        
        // Reset vehicle
        if (this.vehicle) {
            this.vehicle.reset();
            this.vehicle.setPosition(0, 0.5, -50);
        }
        
        // Reset camera
        if (this.cameraManager) {
            this.cameraManager.reset();
            this.cameraManager.setTarget(this.vehicle.mesh);
        }
        
        this.state.current = 'racing';
        
        // Start countdown
        this.ui.showNotification('Race starting in 3...');
    }
    
    pauseGame() {
        if (this.state.current === 'playing' || this.state.current === 'racing') {
            this.state.previous = this.state.current;
            this.state.current = 'paused';
            document.getElementById('pause-menu').classList.add('active');
            document.getElementById('hud').classList.remove('active');
            document.getElementById('touch-controls').classList.remove('active');
        }
    }
    
    resumeGame() {
        if (this.state.current === 'paused') {
            this.state.current = this.state.previous;
            document.getElementById('pause-menu').classList.remove('active');
            document.getElementById('hud').classList.add('active');
            document.getElementById('touch-controls').classList.add('active');
        }
    }
    
    quitToMenu() {
        this.state.current = 'menu';
        document.getElementById('pause-menu').classList.remove('active');
        document.getElementById('race-hud').classList.remove('active');
        this.showMainMenu();
    }
    
    showSettings() {
        document.getElementById('settings-menu').classList.add('active');
    }
    
    hideSettings() {
        document.getElementById('settings-menu').classList.remove('active');
    }
    
    // Touch control handlers
    setTouchControl(key, value) {
        this.touchControls[key] = value;
    }
    
    // Cleanup
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        if (this.renderer) {
            this.renderer.destroy();
        }
        
        if (this.input) {
            this.input.destroy();
        }
        
        console.log('Game: Destroyed');
    }
}
