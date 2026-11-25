# VICE CITY: STREET LIFE

## AAA-Style Open-World 3D Mobile Game

**Build Status:** Phase 1 - Playable Driving Demo ✅

## 📋 Project Overview

VICE CITY: STREET LIFE is an original open-world 3D driving game inspired by tropical coastal cities. Built with **Three.js** and **WebGL**, this game offers:

- 🏙️ Large explorable city with multiple districts
- 🚗 Realistic vehicle physics and driving mechanics
- 🎮 Touch and keyboard controls
- 📱 Mobile-optimized for mid-range devices
- 🌅 Dynamic lighting and weather (coming in later phases)

## 🎯 Current Build (Phase 1)

**BUILD 1 — The Driving Demo** ✅

- ✅ Beautiful 3D city with 7 districts
- ✅ Working vehicle with physics
- ✅ Third-person camera system
- ✅ Mobile touch controls
- ✅ Keyboard controls (WASD, Arrow Keys)
- ✅ Collision detection
- ✅ Speedometer, RPM, and Gear display
- ✅ Main menu with navigation
- ✅ Settings menu
- ✅ Pause/resume functionality

## 🚀 Quick Start

### Option 1: Local Development Server

```bash
# Install dependencies (optional)
npm install

# Start development server
npm start

# Or use live-server
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Option 2: Direct File Open

Simply open `index.html` in a modern browser (Chrome recommended).

### Option 3: Mobile Testing

1. Deploy to a web server or use a local server
2. Open on your mobile device
3. Use touch controls to drive

## 🎮 Controls

### Keyboard Controls

| Key | Action |
|-----|--------|
| W / ↑ | Accelerate |
| S / ↓ | Brake / Reverse |
| A / ← | Steer Left |
| D / → | Steer Right |
| Space | Handbrake |
| Shift | Nitro |
| C | Change Camera Mode |
| E | Enter/Exit Vehicle |
| Esc | Pause |

### Touch Controls

- **Left Side:** Steering left/right
- **Right Side:** Accelerate/Brake
- **Center:** Tap to pause

## 🌆 City Districts

1. **Ocean Drive** - Beachfront with hotels and palm trees
2. **Downtown** - Tall skyscrapers and busy intersections
3. **Palm District** - Luxury houses with pools and gardens
4. **Little Havana** - Colorful buildings and shops
5. **Port** - Cargo buildings and containers
6. **Airport** - Terminal and runways (coming soon)
7. **Sunset Highway** - Long coastal road with scenic views

## 📦 Project Structure

```
vice-city-mobile/
├── index.html                 # Main HTML file
├── main.js                    # Game entry point
├── package.json               # Project configuration
├── README.md                  # This file
└── game/
    ├── Game.js                # Core game class
    ├── Renderer.js            # Three.js renderer
    ├── InputManager.js        # Input handling
    ├── World.js               # City and environment
    ├── Vehicle.js             # Vehicle physics and rendering
    ├── CameraManager.js       # Camera system
    ├── UIManager.js           # User interface
    ├── Settings.js            # Game settings
    └── SaveSystem.js          # Save/load system
└── assets/
    ├── textures/              # Texture files
    ├── sounds/                # Audio files
    └── models/                # 3D models
```

## 🔧 Development Phases

### ✅ Phase 0 - Project Foundation (Complete)
- Project structure
- Core game loop
- Input system
- Loading screen
- Basic UI

### ✅ Phase 1 - Playable Driving (Complete)
- 3D city with roads and buildings
- Vehicle with physics
- Camera system
- Mobile touch controls
- Keyboard controls
- Collision detection

### 📅 Phase 2 - City Expansion (Next)
- Expand road network
- More detailed buildings
- Vegetation and props
- Traffic AI
- Ocean and water effects

### 📅 Phase 3 - Racing System
- Race mode with AI opponents
- Checkpoints and laps
- Race HUD
- Results and rewards

### 📅 Phase 4 - Garage System
- Multiple vehicles
- Vehicle customization
- Paint and rims
- Performance upgrades

### 📅 Phase 5 - Character System
- Player model
- Walking and running
- Enter/exit vehicles
- Character selection

### 📅 Phase 6 - World Activities
- Missions
- Activities
- Map system
- NPCs

### 📅 Phase 7 - Polish
- Weather system
- Day/night cycle
- Audio
- Graphics optimization

### 📅 Phase 8 - Final QA
- Testing and bug fixes
- Performance optimization
- Final packaging

## 🎨 Graphics Settings

The game automatically adjusts settings for mobile devices. You can customize in the Settings menu:

- **Graphics Quality:** Low, Medium, High, Ultra
- **Steering Sensitivity:** Adjust touch steering
- **Touch Controls:** Enable/Disable
- **Camera Mode:** Chase, Close Chase, Hood, Interior, Cinematic

## 📱 Mobile Optimization

Target device: **Samsung Galaxy A25** (Mid-range Android)

Recommended settings:
- Resolution: Adaptive
- Target FPS: 30 (60 if stable)
- Shadows: Medium
- Texture Quality: Medium
- View Distance: Medium
- Traffic Density: Medium

## 🔒 Browser Compatibility

- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox
- ✅ Edge
- ⚠️ Safari (Limited support)

## 📝 Known Limitations

- No audio yet (coming in Phase 7)
- No traffic AI (coming in Phase 2)
- No pedestrians (coming in Phase 5)
- No missions (coming in Phase 6)
- No multiplayer

## 🤝 Contributing

This project is currently in active development. Contributions are welcome for:

- 3D modeling and textures
- Sound design
- Bug fixes
- Performance optimization
- New features

## 📄 License

MIT License - Feel free to use, modify, and distribute.

## 🙏 Credits

- **Engine:** Three.js (https://threejs.org/)
- **Inspiration:** Open-world driving games
- **Developer:** Marc907080

---

**Build Date:** 2024
**Version:** 0.1.0 (Phase 1)

*ICE CITY: STREET LIFE - Where the streets come alive! 🌴🚗*
