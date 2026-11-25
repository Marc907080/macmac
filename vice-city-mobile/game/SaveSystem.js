// VICE CITY: STREET LIFE - Save System
// Handles game progress saving and loading

export class SaveSystem {
    constructor() {
        // Save data structure
        this.saveData = {
            version: '1.0',
            timestamp: Date.now(),
            player: {
                name: 'Player',
                character: 'default',
                outfit: {},
                stats: {
                    totalDistance: 0,
                    totalTime: 0,
                    racesWon: 0,
                    bestSpeed: 0
                }
            },
            vehicles: [],
            currentVehicle: null,
            garage: {
                unlockedVehicles: ['street_racer'],
                customizations: {}
            },
            progress: {
                missions: [],
                races: [],
                activities: [],
                districtsDiscovered: []
            },
            currency: {
                cash: 1000,
                gold: 0
            },
            settings: {},
            lastSave: null
        };
        
        // Storage key
        this.storageKey = 'viceCitySaveData';
        
        // Auto-save interval
        this.autoSaveInterval = null;
        this.autoSaveDelay = 30000; // 30 seconds
        
        // Save validation
        this.lastSaveHash = null;
    }
    
    async init() {
        console.log('SaveSystem: Initializing...');
        
        // Try to load existing save
        await this.load();
        
        // Setup auto-save
        this.startAutoSave();
        
        console.log('SaveSystem: Initialized');
    }
    
    startAutoSave() {
        // Clear existing interval
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        // Start new interval
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, this.autoSaveDelay);
    }
    
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
    
    async load() {
        console.log('SaveSystem: Loading save data...');
        
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                // Validate save data
                if (this.validateSaveData(parsedData)) {
                    this.saveData = parsedData;
                    this.saveData.lastSave = new Date(parsedData.timestamp).toISOString();
                    console.log('SaveSystem: Loaded save data');
                    return true;
                } else {
                    console.warn('SaveSystem: Invalid save data, using defaults');
                    await this.createNewSave();
                    return false;
                }
            } else {
                console.log('SaveSystem: No save data found, creating new save');
                await this.createNewSave();
                return false;
            }
        } catch (error) {
            console.error('SaveSystem: Failed to load save data:', error);
            await this.createNewSave();
            return false;
        }
    }
    
    async createNewSave() {
        console.log('SaveSystem: Creating new save...');
        
        // Initialize with default data
        this.saveData = {
            version: '1.0',
            timestamp: Date.now(),
            player: {
                name: 'Player',
                character: 'default',
                outfit: {},
                stats: {
                    totalDistance: 0,
                    totalTime: 0,
                    racesWon: 0,
                    bestSpeed: 0
                }
            },
            vehicles: [
                {
                    id: 'street_racer',
                    name: 'Street Racer',
                    class: 'Sports',
                    unlocked: true,
                    owned: true,
                    customization: {
                        color: 0xff0000,
                        rimColor: 0xcccccc,
                        windowTint: 0x00aaff,
                        spoiler: 'default',
                        rims: 'default'
                    },
                    upgrades: {
                        engine: 0,
                        turbo: 0,
                        transmission: 0,
                        tires: 0,
                        brakes: 0,
                        suspension: 0
                    }
                }
            ],
            currentVehicle: 'street_racer',
            garage: {
                unlockedVehicles: ['street_racer'],
                customizations: {}
            },
            progress: {
                missions: [],
                races: [],
                activities: [],
                districtsDiscovered: ['Ocean Drive']
            },
            currency: {
                cash: 1000,
                gold: 0
            },
            settings: {},
            lastSave: new Date().toISOString()
        };
        
        // Save initial data
        await this.save();
    }
    
    async save() {
        console.log('SaveSystem: Saving data...');
        
        try {
            // Update timestamp
            this.saveData.timestamp = Date.now();
            this.saveData.lastSave = new Date().toISOString();
            
            // Create hash for validation
            this.lastSaveHash = this.createHash(JSON.stringify(this.saveData));
            
            // Save to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(this.saveData));
            
            console.log('SaveSystem: Data saved successfully');
            return true;
        } catch (error) {
            console.error('SaveSystem: Failed to save data:', error);
            return false;
        }
    }
    
    async autoSave() {
        // Only auto-save if enabled in settings
        const settings = JSON.parse(localStorage.getItem('viceCitySettings') || '{}');
        if (settings.gameplay?.autoSave !== false) {
            await this.save();
        }
    }
    
    validateSaveData(data) {
        // Check required fields
        const requiredFields = ['version', 'timestamp', 'player', 'vehicles', 'garage', 'progress', 'currency'];
        
        for (const field of requiredFields) {
            if (data[field] === undefined) {
                return false;
            }
        }
        
        // Check version compatibility
        if (data.version !== '1.0') {
            console.warn(`SaveSystem: Version mismatch. Expected 1.0, got ${data.version}`);
            // For now, accept any version
        }
        
        return true;
    }
    
    createHash(data) {
        // Simple hash function for save validation
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }
    
    // Getters and setters
    getSaveData() {
        return this.saveData;
    }
    
    getPlayerData() {
        return this.saveData.player;
    }
    
    getVehicles() {
        return this.saveData.vehicles;
    }
    
    getCurrentVehicle() {
        const currentId = this.saveData.currentVehicle;
        return this.saveData.vehicles.find(v => v.id === currentId);
    }
    
    getGarage() {
        return this.saveData.garage;
    }
    
    getProgress() {
        return this.saveData.progress;
    }
    
    getCurrency() {
        return this.saveData.currency;
    }
    
    setPlayerData(data) {
        this.saveData.player = { ...this.saveData.player, ...data };
    }
    
    setVehicleData(vehicleId, data) {
        const vehicleIndex = this.saveData.vehicles.findIndex(v => v.id === vehicleId);
        if (vehicleIndex !== -1) {
            this.saveData.vehicles[vehicleIndex] = { 
                ...this.saveData.vehicles[vehicleIndex], 
                ...data 
            };
        }
    }
    
    setCurrentVehicle(vehicleId) {
        if (this.saveData.vehicles.some(v => v.id === vehicleId)) {
            this.saveData.currentVehicle = vehicleId;
        }
    }
    
    setCurrency(data) {
        this.saveData.currency = { ...this.saveData.currency, ...data };
    }
    
    addCash(amount) {
        this.saveData.currency.cash = (this.saveData.currency.cash || 0) + amount;
    }
    
    addGold(amount) {
        this.saveData.currency.gold = (this.saveData.currency.gold || 0) + amount;
    }
    
    // Unlock systems
    unlockVehicle(vehicleId) {
        if (!this.saveData.garage.unlockedVehicles.includes(vehicleId)) {
            this.saveData.garage.unlockedVehicles.push(vehicleId);
        }
    }
    
    unlockMission(missionId) {
        if (!this.saveData.progress.missions.includes(missionId)) {
            this.saveData.progress.missions.push(missionId);
        }
    }
    
    unlockRace(raceId) {
        if (!this.saveData.progress.races.includes(raceId)) {
            this.saveData.progress.races.push(raceId);
        }
    }
    
    discoverDistrict(districtName) {
        if (!this.saveData.progress.districtsDiscovered.includes(districtName)) {
            this.saveData.progress.districtsDiscovered.push(districtName);
        }
    }
    
    // Reset save
    async resetSave() {
        this.stopAutoSave();
        localStorage.removeItem(this.storageKey);
        await this.createNewSave();
        this.startAutoSave();
    }
    
    // Delete save
    async deleteSave() {
        this.stopAutoSave();
        localStorage.removeItem(this.storageKey);
        this.saveData = null;
    }
    
    // Export save
    exportSave() {
        return JSON.stringify(this.saveData, null, 2);
    }
    
    // Import save
    async importSave(data) {
        try {
            const parsedData = JSON.parse(data);
            if (this.validateSaveData(parsedData)) {
                this.saveData = parsedData;
                await this.save();
                return true;
            }
            return false;
        } catch (error) {
            console.error('SaveSystem: Failed to import save:', error);
            return false;
        }
    }
}
