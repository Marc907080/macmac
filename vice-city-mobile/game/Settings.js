// VICE CITY: STREET LIFE - Settings Manager
// Handles game settings and configuration

export class Settings {
    constructor() {
        // Default settings
        this.defaults = {
            graphics: {
                quality: 'medium',
                resolution: 'adaptive',
                shadows: 'medium',
                textureQuality: 'medium',
                viewDistance: 'medium',
                antiAliasing: true,
                bloom: true,
                motionBlur: false,
                ambientEffects: true
            },
            controls: {
                steeringSensitivity: 0.5,
                buttonSize: 'medium',
                controlLayout: 'default',
                steeringMode: 'touch',
                tiltSteering: false,
                vibration: true
            },
            camera: {
                mode: 'chase',
                fov: 75,
                distance: 8,
                height: 2,
                collision: true
            },
            audio: {
                masterVolume: 0.8,
                musicVolume: 0.7,
                effectsVolume: 0.8,
                engineVolume: 0.9,
                ambientVolume: 0.5
            },
            gameplay: {
                difficulty: 'normal',
                trafficDensity: 'medium',
                pedestrianDensity: 'low',
                weather: 'sunny',
                timeOfDay: 'day',
                autoSave: true,
                language: 'en'
            },
            performance: {
                targetFps: 30,
                maxFps: 60,
                vsync: true,
                batterySaver: true
            }
        };
        
        // Current settings
        this.current = this.cloneSettings(this.defaults);
        
        // Settings key for localStorage
        this.storageKey = 'viceCitySettings';
    }
    
    cloneSettings(settings) {
        return JSON.parse(JSON.stringify(settings));
    }
    
    async load() {
        console.log('Settings: Loading...');
        
        // Try to load from localStorage
        try {
            const savedSettings = localStorage.getItem(this.storageKey);
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                // Merge with defaults to ensure all settings exist
                this.current = this.mergeSettings(this.defaults, parsedSettings);
                console.log('Settings: Loaded from localStorage');
            }
        } catch (error) {
            console.warn('Settings: Failed to load from localStorage:', error);
        }
        
        // Apply settings to game
        this.apply();
    }
    
    mergeSettings(defaults, custom) {
        const merged = this.cloneSettings(defaults);
        
        for (const category in custom) {
            if (merged[category]) {
                for (const key in custom[category]) {
                    if (merged[category][key] !== undefined) {
                        merged[category][key] = custom[category][key];
                    }
                }
            }
        }
        
        return merged;
    }
    
    async save() {
        console.log('Settings: Saving...');
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.current));
            console.log('Settings: Saved to localStorage');
        } catch (error) {
            console.warn('Settings: Failed to save to localStorage:', error);
        }
    }
    
    apply() {
        console.log('Settings: Applying...');
        
        // Apply graphics settings
        this.applyGraphicsSettings();
        
        // Apply audio settings
        this.applyAudioSettings();
        
        // Apply control settings
        this.applyControlSettings();
    }
    
    applyGraphicsSettings() {
        const gfx = this.current.graphics;
        
        // Update quality presets based on quality setting
        switch (gfx.quality) {
            case 'low':
                gfx.shadows = 'low';
                gfx.textureQuality = 'low';
                gfx.viewDistance = 'low';
                gfx.antiAliasing = false;
                gfx.bloom = false;
                break;
            case 'medium':
                gfx.shadows = 'medium';
                gfx.textureQuality = 'medium';
                gfx.viewDistance = 'medium';
                gfx.antiAliasing = true;
                gfx.bloom = true;
                break;
            case 'high':
                gfx.shadows = 'high';
                gfx.textureQuality = 'high';
                gfx.viewDistance = 'high';
                gfx.antiAliasing = true;
                gfx.bloom = true;
                break;
            case 'ultra':
                gfx.shadows = 'high';
                gfx.textureQuality = 'high';
                gfx.viewDistance = 'ultra';
                gfx.antiAliasing = true;
                gfx.bloom = true;
                gfx.motionBlur = true;
                break;
        }
    }
    
    applyAudioSettings() {
        // Audio settings will be applied by the audio manager
    }
    
    applyControlSettings() {
        // Control settings will be applied by the input manager
    }
    
    // Getters and setters
    getGraphics() {
        return this.current.graphics;
    }
    
    getControls() {
        return this.current.controls;
    }
    
    getCamera() {
        return this.current.camera;
    }
    
    getAudio() {
        return this.current.audio;
    }
    
    getGameplay() {
        return this.current.gameplay;
    }
    
    getPerformance() {
        return this.current.performance;
    }
    
    setGraphics(settings) {
        this.current.graphics = { ...this.current.graphics, ...settings };
        this.applyGraphicsSettings();
        this.save();
    }
    
    setControls(settings) {
        this.current.controls = { ...this.current.controls, ...settings };
        this.applyControlSettings();
        this.save();
    }
    
    setCamera(settings) {
        this.current.camera = { ...this.current.camera, ...settings };
        this.save();
    }
    
    setAudio(settings) {
        this.current.audio = { ...this.current.audio, ...settings };
        this.applyAudioSettings();
        this.save();
    }
    
    setGameplay(settings) {
        this.current.gameplay = { ...this.current.gameplay, ...settings };
        this.save();
    }
    
    setPerformance(settings) {
        this.current.performance = { ...this.current.performance, ...settings };
        this.save();
    }
    
    // Reset to defaults
    reset() {
        this.current = this.cloneSettings(this.defaults);
        this.apply();
        this.save();
    }
    
    // Get setting by path
    get(path) {
        const parts = path.split('.');
        let value = this.current;
        
        for (const part of parts) {
            if (value[part] !== undefined) {
                value = value[part];
            } else {
                return undefined;
            }
        }
        
        return value;
    }
    
    // Set setting by path
    set(path, value) {
        const parts = path.split('.');
        let current = this.current;
        
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (current[part] === undefined) {
                current[part] = {};
            }
            current = current[part];
        }
        
        current[parts[parts.length - 1]] = value;
        this.save();
    }
}
