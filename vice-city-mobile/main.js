// VICE CITY: STREET LIFE - Main Entry Point
// Build Phase: 0 & 1 - Project Foundation + Playable Driving

import { Game } from './game/Game.js';

// Check if Three.js is loaded
function checkThreeJS() {
    return typeof THREE !== 'undefined';
}

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', async () => {
    console.log('VICE CITY: STREET LIFE - Initializing...');
    
    // Wait for Three.js to load if not already available
    const maxWaitTime = 10000; // 10 seconds
    const startTime = Date.now();
    
    while (!checkThreeJS() && Date.now() - startTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!checkThreeJS()) {
        console.error('Three.js failed to load!');
        showError('Three.js failed to load. Please check your internet connection.');
        return;
    }
    
    // Create game instance
    const game = new Game();
    
    try {
        // Show loading screen immediately (direct DOM manipulation to avoid dependency on game.ui)
        const loadingScreen = document.getElementById('loading-screen');
        const loadingBar = document.getElementById('loading-bar');
        const loadingText = document.getElementById('loading-text');
        if (loadingScreen) loadingScreen.classList.remove('hidden');
        if (loadingBar) loadingBar.style.width = '0%';
        if (loadingText) loadingText.textContent = 'Initializing game...';
        
        // Initialize game
        await game.init();
        game.updateLoadingProgress(20, 'Initializing renderer...');
        
        // Load assets with progress updates
        await game.loadAssets();
        game.updateLoadingProgress(90, 'Finalizing...');
        
        // Add minimum loading time for better UX
        const loadingStart = Date.now();
        const minLoadingTime = 1500; // 1.5 seconds minimum
        const elapsed = Date.now() - loadingStart;
        if (elapsed < minLoadingTime) {
            await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
        }
        
        // Start game
        game.start();
        
        console.log('VICE CITY: STREET LIFE - Ready!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        // Hide loading screen directly
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.add('hidden');
        showError('Failed to load game. Please refresh.');
    }
});

function showError(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
}
