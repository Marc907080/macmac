// VICE CITY: STREET LIFE - Input Manager
// Handles keyboard, mouse, and touch input

export class InputManager {
    constructor(game) {
        this.game = game;
        
        // Keyboard state
        this.keys = {};
        
        // Mouse state
        this.mouse = {
            x: 0,
            y: 0,
            down: false,
            deltaX: 0,
            deltaY: 0
        };
        
        // Touch state
        this.touches = {};
        this.touchStart = {};
        
        // Gamepad state
        this.gamepad = null;
        
        // Input callbacks
        this.callbacks = {
            onKeyDown: null,
            onKeyUp: null,
            onTouchStart: null,
            onTouchEnd: null
        };
        
        // Touch control elements
        this.touchElements = {
            steeringLeft: null,
            steeringRight: null,
            accelerate: null,
            brake: null
        };
    }
    
    init() {
        console.log('InputManager: Initializing...');
        
        // Setup keyboard listeners
        this.setupKeyboard();
        
        // Setup mouse listeners
        this.setupMouse();
        
        // Setup touch listeners
        this.setupTouch();
        
        // Setup touch control UI
        this.setupTouchControls();
        
        // Setup gamepad listeners
        this.setupGamepad();
        
        console.log('InputManager: Initialized');
    }
    
    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Handle special keys
            if (e.code === 'Escape') {
                if (this.game.state.current === 'playing' || this.game.state.current === 'racing') {
                    this.game.pauseGame();
                } else if (this.game.state.current === 'paused') {
                    this.game.resumeGame();
                } else if (this.game.state.current === 'menu') {
                    // Do nothing or show settings
                }
            }
            
            if (this.callbacks.onKeyDown) {
                this.callbacks.onKeyDown(e);
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            
            if (this.callbacks.onKeyUp) {
                this.callbacks.onKeyUp(e);
            }
        });
    }
    
    setupMouse() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.deltaX = e.movementX || 0;
            this.mouse.deltaY = e.movementY || 0;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
        });
        
        window.addEventListener('mouseup', (e) => {
            this.mouse.down = false;
        });
    }
    
    setupTouch() {
        window.addEventListener('touchstart', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                this.touches[touch.identifier] = touch;
                this.touchStart[touch.identifier] = { x: touch.clientX, y: touch.clientY };
            }
            
            if (this.callbacks.onTouchStart) {
                this.callbacks.onTouchStart(e);
            }
            
            e.preventDefault();
        });
        
        window.addEventListener('touchend', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                delete this.touches[touch.identifier];
                delete this.touchStart[touch.identifier];
            }
            
            if (this.callbacks.onTouchEnd) {
                this.callbacks.onTouchEnd(e);
            }
            
            e.preventDefault();
        });
        
        window.addEventListener('touchmove', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (this.touches[touch.identifier]) {
                    this.touches[touch.identifier] = touch;
                }
            }
            
            e.preventDefault();
        });
    }
    
    setupTouchControls() {
        // Get touch control elements
        this.touchElements.steeringLeft = document.getElementById('steering-left');
        this.touchElements.steeringRight = document.getElementById('steering-right');
        this.touchElements.accelerate = document.getElementById('accelerate-btn');
        this.touchElements.brake = document.getElementById('brake-btn');
        
        // Add touch event listeners to control buttons
        if (this.touchElements.steeringLeft) {
            this.touchElements.steeringLeft.addEventListener('touchstart', () => {
                this.game.setTouchControl('steeringLeft', true);
                this.touchElements.steeringLeft.classList.add('active');
            });
            this.touchElements.steeringLeft.addEventListener('touchend', () => {
                this.game.setTouchControl('steeringLeft', false);
                this.touchElements.steeringLeft.classList.remove('active');
            });
        }
        
        if (this.touchElements.steeringRight) {
            this.touchElements.steeringRight.addEventListener('touchstart', () => {
                this.game.setTouchControl('steeringRight', true);
                this.touchElements.steeringRight.classList.add('active');
            });
            this.touchElements.steeringRight.addEventListener('touchend', () => {
                this.game.setTouchControl('steeringRight', false);
                this.touchElements.steeringRight.classList.remove('active');
            });
        }
        
        if (this.touchElements.accelerate) {
            this.touchElements.accelerate.addEventListener('touchstart', () => {
                this.game.setTouchControl('accelerate', true);
                this.touchElements.accelerate.classList.add('active');
            });
            this.touchElements.accelerate.addEventListener('touchend', () => {
                this.game.setTouchControl('accelerate', false);
                this.touchElements.accelerate.classList.remove('active');
            });
        }
        
        if (this.touchElements.brake) {
            this.touchElements.brake.addEventListener('touchstart', () => {
                this.game.setTouchControl('brake', true);
                this.touchElements.brake.classList.add('active');
            });
            this.touchElements.brake.addEventListener('touchend', () => {
                this.game.setTouchControl('brake', false);
                this.touchElements.brake.classList.remove('active');
            });
        }
    }
    
    setupGamepad() {
        window.addEventListener('gamepadconnected', (e) => {
            console.log('Gamepad connected:', e.gamepad.id);
            this.gamepad = e.gamepad;
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Gamepad disconnected:', e.gamepad.id);
            this.gamepad = null;
        });
    }
    
    update(deltaTime) {
        // Update gamepad state
        if (this.gamepad) {
            this.gamepad = navigator.getGamepads()[this.gamepad.index];
        }
    }
    
    // Check if a key is pressed
    isKeyPressed(keyCode) {
        return this.keys[keyCode] || false;
    }
    
    // Get steering input (-1 to 1)
    getSteeringInput() {
        let steering = 0;
        
        // Keyboard
        if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA')) {
            steering -= 1;
        }
        if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD')) {
            steering += 1;
        }
        
        // Touch controls
        if (this.game.touchControls.steeringLeft) {
            steering -= 1;
        }
        if (this.game.touchControls.steeringRight) {
            steering += 1;
        }
        
        return Math.max(-1, Math.min(1, steering));
    }
    
    // Get throttle input (0 to 1)
    getThrottleInput() {
        let throttle = 0;
        
        // Keyboard
        if (this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW')) {
            throttle = 1;
        }
        
        // Touch controls
        if (this.game.touchControls.accelerate) {
            throttle = 1;
        }
        
        return throttle;
    }
    
    // Get brake input (0 to 1)
    getBrakeInput() {
        let brake = 0;
        
        // Keyboard
        if (this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS')) {
            brake = 1;
        }
        
        // Touch controls
        if (this.game.touchControls.brake) {
            brake = 1;
        }
        
        return brake;
    }
    
    // Get handbrake input
    getHandbrakeInput() {
        return this.isKeyPressed('Space') || this.isKeyPressed('KeyX') || false;
    }
    
    // Get nitro input
    getNitroInput() {
        return this.isKeyPressed('ShiftLeft') || this.isKeyPressed('ShiftRight') || false;
    }
    
    // Get camera change input
    getCameraChangeInput() {
        return this.isKeyPressed('KeyC') || false;
    }
    
    // Get enter/exit vehicle input
    getVehicleEnterInput() {
        return this.isKeyPressed('KeyE') || this.isKeyPressed('Enter') || false;
    }
    
    // Get pause input
    getPauseInput() {
        return this.isKeyPressed('Escape') || false;
    }
    
    // Register callbacks
    onKeyDown(callback) {
        this.callbacks.onKeyDown = callback;
    }
    
    onKeyUp(callback) {
        this.callbacks.onKeyUp = callback;
    }
    
    onTouchStart(callback) {
        this.callbacks.onTouchStart = callback;
    }
    
    onTouchEnd(callback) {
        this.callbacks.onTouchEnd = callback;
    }
    
    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('touchend', this.handleTouchEnd);
        window.removeEventListener('touchmove', this.handleTouchMove);
        
        console.log('InputManager: Destroyed');
    }
}
