// VICE CITY: STREET LIFE - Main Entry Point
// Build Phase: 0 & 1 - Project Foundation + Playable Driving

import { Game } from './game/Game.js';

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', async () => {
    console.log('VICE CITY: STREET LIFE - Initializing...');
    
    // Create game instance
    const game = new Game();
    
    try {
        // Initialize game
        await game.init();
        
        // Start loading
        game.showLoadingScreen();
        
        // Load assets
        await game.loadAssets();
        
        // Start game
        game.start();
        
        console.log('VICE CITY: STREET LIFE - Ready!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        showError('Failed to load game. Please refresh.');
    }
});

function showError(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}
