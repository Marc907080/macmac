// VICE CITY: STREET LIFE - UI Manager
// Handles all UI elements and HUD

export class UIManager {
    constructor(game) {
        this.game = game;
        
        // UI elements
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            loadingBar: document.getElementById('loading-bar'),
            loadingText: document.getElementById('loading-text'),
            mainMenu: document.getElementById('main-menu'),
            hud: document.getElementById('hud'),
            speedometer: document.getElementById('speedometer'),
            gearDisplay: document.getElementById('gear-display'),
            rpmMeter: document.getElementById('rpm-meter'),
            raceHud: document.getElementById('race-hud'),
            raceCountdown: document.getElementById('race-countdown'),
            racePosition: document.getElementById('race-position'),
            raceTimer: document.getElementById('race-timer'),
            pauseMenu: document.getElementById('pause-menu'),
            settingsMenu: document.getElementById('settings-menu'),
            notification: document.getElementById('notification'),
            touchControls: document.getElementById('touch-controls')
        };
        
        // Menu buttons
        this.buttons = {
            continue: document.getElementById('continue-btn'),
            newGame: document.getElementById('new-game-btn'),
            freeRoam: document.getElementById('free-roam-btn'),
            race: document.getElementById('race-btn'),
            garage: document.getElementById('garage-btn'),
            character: document.getElementById('character-btn'),
            map: document.getElementById('map-btn'),
            settings: document.getElementById('settings-btn'),
            resume: document.getElementById('resume-btn'),
            restart: document.getElementById('restart-btn'),
            pauseSettings: document.getElementById('pause-settings-btn'),
            quit: document.getElementById('quit-btn'),
            settingsBack: document.getElementById('settings-back-btn')
        };
        
        // Notification timeout
        this.notificationTimeout = null;
    }
    
    init() {
        console.log('UIManager: Initializing...');
        
        // Setup button event listeners
        this.setupEventListeners();
        
        // Update loading progress
        this.updateLoadingProgress(0, 'Initializing...');
        
        console.log('UIManager: Initialized');
    }
    
    setupEventListeners() {
        // Main menu buttons
        this.buttons.continue?.addEventListener('click', () => {
            this.onContinue();
        });
        
        this.buttons.newGame?.addEventListener('click', () => {
            this.onNewGame();
        });
        
        this.buttons.freeRoam?.addEventListener('click', () => {
            this.onFreeRoam();
        });
        
        this.buttons.race?.addEventListener('click', () => {
            this.onRace();
        });
        
        this.buttons.garage?.addEventListener('click', () => {
            this.onGarage();
        });
        
        this.buttons.character?.addEventListener('click', () => {
            this.onCharacter();
        });
        
        this.buttons.map?.addEventListener('click', () => {
            this.onMap();
        });
        
        this.buttons.settings?.addEventListener('click', () => {
            this.onSettings();
        });
        
        // Pause menu buttons
        this.buttons.resume?.addEventListener('click', () => {
            this.onResume();
        });
        
        this.buttons.restart?.addEventListener('click', () => {
            this.onRestart();
        });
        
        this.buttons.pauseSettings?.addEventListener('click', () => {
            this.onPauseSettings();
        });
        
        this.buttons.quit?.addEventListener('click', () => {
            this.onQuit();
        });
        
        // Settings menu buttons
        this.buttons.settingsBack?.addEventListener('click', () => {
            this.onSettingsBack();
        });
        
        // Touch control buttons (already handled in InputManager)
    }
    
    update(deltaTime, vehicle, raceState) {
        // Update HUD
        if (vehicle && this.elements.hud.classList.contains('active')) {
            this.updateHUD(vehicle, raceState);
        }
        
        // Update race HUD
        if (raceState && this.elements.raceHud.classList.contains('active')) {
            this.updateRaceHUD(raceState);
        }
    }
    
    updateHUD(vehicle, raceState) {
        const vehicleInfo = vehicle.getInfo();
        
        // Update speedometer
        const speedKmh = Math.round(vehicleInfo.speed);
        this.elements.speedometer.textContent = `${speedKmh} KM/H`;
        
        // Update gear display
        let gearText = vehicleInfo.gear;
        if (vehicleInfo.gear === -1) gearText = 'R';
        else if (vehicleInfo.gear === 0) gearText = 'N';
        this.elements.gearDisplay.textContent = gearText;
        
        // Update RPM meter
        const rpm = Math.round(vehicleInfo.rpm);
        this.elements.rpmMeter.textContent = `${rpm} RPM`;
        
        // Update colors based on speed
        if (speedKmh > 100) {
            this.elements.speedometer.style.color = '#ff0000';
        } else if (speedKmh > 50) {
            this.elements.speedometer.style.color = '#ffaa00';
        } else {
            this.elements.speedometer.style.color = '#00ffff';
        }
    }
    
    updateRaceHUD(raceState) {
        if (raceState.countdown > 0) {
            this.elements.raceCountdown.textContent = Math.ceil(raceState.countdown);
            this.elements.raceCountdown.style.display = 'block';
        } else {
            this.elements.raceCountdown.style.display = 'none';
        }
        
        this.elements.racePosition.textContent = `Position: ${raceState.position}/6`;
        
        // Format timer
        const totalSeconds = Math.floor(raceState.timer);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((raceState.timer % 1) * 100);
        
        this.elements.raceTimer.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    
    // Loading screen
    updateLoadingProgress(progress, text) {
        try {
            if (this.elements.loadingBar) {
                this.elements.loadingBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
            }
            if (this.elements.loadingText) {
                this.elements.loadingText.textContent = text || 'Loading...';
            }
        } catch (error) {
            console.warn('UIManager: Failed to update loading progress:', error);
        }
    }
    
    // Notifications
    showNotification(message, duration = 3000) {
        if (this.elements.notification) {
            this.elements.notification.textContent = message;
            this.elements.notification.style.display = 'block';
            
            // Clear existing timeout
            if (this.notificationTimeout) {
                clearTimeout(this.notificationTimeout);
            }
            
            // Set new timeout
            this.notificationTimeout = setTimeout(() => {
                this.hideNotification();
            }, duration);
        }
    }
    
    hideNotification() {
        if (this.elements.notification) {
            this.elements.notification.style.display = 'none';
        }
    }
    
    // Event handlers
    onContinue() {
        console.log('Continue game');
        // In a later phase, this will load saved game
        this.game.startFreeRoam();
    }
    
    onNewGame() {
        console.log('New game');
        // Reset game state and start
        this.game.startFreeRoam();
    }
    
    onFreeRoam() {
        console.log('Free Roam');
        this.game.startFreeRoam();
    }
    
    onRace() {
        console.log('Race mode');
        this.game.startRace();
    }
    
    onGarage() {
        console.log('Garage');
        this.showNotification('Garage coming in Phase 4!');
    }
    
    onCharacter() {
        console.log('Character selection');
        this.showNotification('Character system coming in Phase 5!');
    }
    
    onMap() {
        console.log('Map');
        this.showNotification('Map system coming in Phase 6!');
    }
    
    onSettings() {
        console.log('Settings');
        this.game.showSettings();
    }
    
    onResume() {
        console.log('Resume game');
        this.game.resumeGame();
    }
    
    onRestart() {
        console.log('Restart');
        this.game.vehicle.reset();
        this.game.resumeGame();
    }
    
    onPauseSettings() {
        console.log('Pause Settings');
        this.game.showSettings();
    }
    
    onQuit() {
        console.log('Quit to menu');
        this.game.quitToMenu();
    }
    
    onSettingsBack() {
        console.log('Settings back');
        this.game.hideSettings();
    }
}
