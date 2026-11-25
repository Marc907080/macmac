// VICE CITY: STREET LIFE - Mobile Bundle
// Single-file version for better mobile compatibility
// Uses Three.js global variable instead of ES6 modules

// Check if Three.js is loaded
if (typeof THREE === 'undefined') {
    // Try to load from CDN as fallback
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = function() {
        if (typeof THREE !== 'undefined') {
            initGame();
        } else {
            showError('Failed to load Three.js. Please check your internet connection.');
        }
    };
    script.onerror = function() {
        showError('Failed to load Three.js. Please check your internet connection.');
    };
    document.head.appendChild(script);
} else {
    // Three.js is already loaded, initialize game
    initGame();
}

// Game state
var gameState = {
    current: 'loading',
    renderer: null,
    scene: null,
    camera: null,
    vehicle: null,
    world: null,
    touchControls: {
        steeringLeft: false,
        steeringRight: false,
        accelerate: false,
        brake: false,
        nitro: false
    },
    clock: null,
    lastTime: 0
};

// Settings
var settings = {
    graphics: {
        quality: 'medium',
        antiAliasing: true,
        shadows: 'medium'
    },
    controls: {
        steeringSensitivity: 0.5
    }
};

// UI Elements
var uiElements = {
    loadingScreen: null,
    loadingBar: null,
    loadingText: null,
    mainMenu: null,
    hud: null,
    speedometer: null,
    gearDisplay: null,
    pauseMenu: null,
    notification: null,
    touchControls: null
};

// Initialize game
function initGame() {
    console.log('VICE CITY: STREET LIFE - Initializing...');
    
    // Get UI elements
    uiElements.loadingScreen = document.getElementById('loading-screen');
    uiElements.loadingBar = document.getElementById('loading-bar');
    uiElements.loadingText = document.getElementById('loading-text');
    uiElements.mainMenu = document.getElementById('main-menu');
    uiElements.hud = document.getElementById('hud');
    uiElements.speedometer = document.getElementById('speedometer');
    uiElements.gearDisplay = document.getElementById('gear-display');
    uiElements.pauseMenu = document.getElementById('pause-menu');
    uiElements.notification = document.getElementById('notification');
    uiElements.touchControls = document.getElementById('touch-controls');
    
    // Show loading screen
    showLoadingScreen();
    updateLoadingProgress(0, 'Initializing...');
    
    // Initialize Three.js scene
    initThreeJS();
}

// Initialize Three.js
function initThreeJS() {
    console.log('Initializing Three.js...');
    updateLoadingProgress(10, 'Creating scene...');
    
    // Create scene
    gameState.scene = new THREE.Scene();
    gameState.scene.background = new THREE.Color(0x111122);
    gameState.scene.fog = new THREE.Fog(0x111122, 100, 500);
    
    // Create camera
    gameState.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    gameState.camera.position.set(0, 5, 10);
    gameState.camera.lookAt(0, 0, 0);
    
    // Create renderer
    var canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    document.body.appendChild(canvas);
    
    gameState.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: settings.graphics.antiAliasing,
        alpha: false
    });
    
    gameState.renderer.setSize(window.innerWidth, window.innerHeight);
    gameState.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gameState.renderer.shadowMap.enabled = true;
    gameState.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    gameState.renderer.toneMappingExposure = 1.0;
    gameState.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Setup resize handler
    window.addEventListener('resize', onWindowResize);
    
    // Create lights
    createLights();
    
    // Create skybox
    createSkybox();
    
    updateLoadingProgress(30, 'Creating city...');
    
    // Create world
    createWorld();
    
    updateLoadingProgress(60, 'Loading vehicle...');
    
    // Create vehicle
    createVehicle();
    
    // Setup touch controls
    setupTouchControls();
    
    // Setup menu buttons
    setupMenuButtons();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker registered');
            })
            .catch(function(error) {
                console.error('Service Worker registration failed:', error);
            });
    }
    
    // Add minimum loading time
    setTimeout(function() {
        updateLoadingProgress(100, 'Ready to play!');
        hideLoadingScreen();
        showMainMenu();
        startGameLoop();
    }, 1500);
}

// Create lights
function createLights() {
    // Directional light (sun)
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(100, 100, 50);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    light.shadow.camera.left = -200;
    light.shadow.camera.right = 200;
    light.shadow.camera.top = 200;
    light.shadow.camera.bottom = -200;
    gameState.scene.add(light);
    
    // Ambient light
    var ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    gameState.scene.add(ambientLight);
    
    // Hemisphere light
    var hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3);
    gameState.scene.add(hemiLight);
}

// Create skybox
function createSkybox() {
    var skyGeometry = new THREE.SphereGeometry(500, 60, 40);
    var skyMaterial = new THREE.ShaderMaterial({
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
    
    var skybox = new THREE.Mesh(skyGeometry, skyMaterial);
    gameState.scene.add(skybox);
}

// Create world
function createWorld() {
    // Create ground
    var groundGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    var vertices = groundGeometry.attributes.position.array;
    for (var i = 0; i < vertices.length; i += 3) {
        var noise = Math.sin(vertices[i] * 0.01) * Math.cos(vertices[i + 1] * 0.01) * 0.1;
        vertices[i + 2] = noise;
    }
    groundGeometry.computeVertexNormals();
    
    var groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x228822,
        roughness: 0.8,
        metalness: 0.2
    });
    
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    gameState.scene.add(ground);
    
    // Create ocean
    var oceanGeometry = new THREE.PlaneGeometry(3000, 3000);
    var oceanMaterial = new THREE.MeshStandardMaterial({
        color: 0x114488,
        roughness: 0.1,
        metalness: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    var ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -1;
    gameState.scene.add(ocean);
    
    // Create simple city
    createSimpleCity();
    
    // Create collision boundaries
    createCollisionBoundaries();
}

// Create simple city
function createSimpleCity() {
    // Create some roads
    var roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.1
    });
    
    var roadGeometry = new THREE.PlaneGeometry(2000, 30);
    var mainRoad = new THREE.Mesh(roadGeometry, roadMaterial);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.y = 0.1;
    gameState.scene.add(mainRoad);
    
    var ewRoad = new THREE.Mesh(roadGeometry, roadMaterial);
    ewRoad.rotation.x = -Math.PI / 2;
    ewRoad.rotation.z = Math.PI / 2;
    ewRoad.position.y = 0.1;
    gameState.scene.add(ewRoad);
    
    // Create buildings
    var buildingMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.7,
        metalness: 0.2
    });
    
    for (var i = 0; i < 20; i++) {
        var width = 15 + Math.random() * 15;
        var height = 10 + Math.random() * 30;
        var depth = 10 + Math.random() * 15;
        
        var buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        var building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(
            -200 + Math.random() * 400,
            height / 2,
            -200 + Math.random() * 400
        );
        building.castShadow = true;
        building.receiveShadow = true;
        gameState.scene.add(building);
    }
    
    // Create palm trees
    for (var i = 0; i < 50; i++) {
        var palm = createPalmTree();
        palm.position.set(
            -250 + Math.random() * 500,
            0,
            -250 + Math.random() * 500
        );
        gameState.scene.add(palm);
    }
}

// Create palm tree
function createPalmTree() {
    var group = new THREE.Group();
    
    // Trunk
    var trunkGeometry = new THREE.CylinderGeometry(0.3, 0.2, 5, 8);
    var trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.8,
        metalness: 0.1
    });
    var trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2.5;
    group.add(trunk);
    
    // Leaves
    var leavesGeometry = new THREE.ConeGeometry(2, 3, 8);
    var leavesMaterial = new THREE.MeshStandardMaterial({
        color: 0x228822,
        roughness: 0.7,
        metalness: 0.1
    });
    
    for (var i = 0; i < 5; i++) {
        var leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 5 + i * 0.5;
        leaves.rotation.x = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        leaves.rotation.z = Math.random() * Math.PI * 2;
        group.add(leaves);
    }
    
    return group;
}

// Create collision boundaries
function createCollisionBoundaries() {
    var boundaryGeometry = new THREE.BoxGeometry(2000, 100, 10);
    var boundaryMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        visible: false
    });
    
    // North
    var northBoundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    northBoundary.position.set(0, 50, 500);
    northBoundary.userData.isBoundary = true;
    gameState.scene.add(northBoundary);
    
    // South
    var southBoundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    southBoundary.position.set(0, 50, -500);
    southBoundary.userData.isBoundary = true;
    gameState.scene.add(southBoundary);
    
    // East
    var eastBoundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    eastBoundary.rotation.y = Math.PI / 2;
    eastBoundary.position.set(500, 50, 0);
    eastBoundary.userData.isBoundary = true;
    gameState.scene.add(eastBoundary);
    
    // West
    var westBoundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    westBoundary.rotation.y = Math.PI / 2;
    westBoundary.position.set(-500, 50, 0);
    westBoundary.userData.isBoundary = true;
    gameState.scene.add(westBoundary);
}

// Create vehicle
function createVehicle() {
    var group = new THREE.Group();
    
    // Body
    var bodyGeometry = new THREE.BoxGeometry(2.5, 1.2, 4.5);
    var bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.3,
        metalness: 0.5
    });
    var body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    group.add(body);
    
    // Windows
    var windowGeometry = new THREE.BoxGeometry(0.1, 0.8, 1);
    var windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1,
        metalness: 0.1
    });
    
    var frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    frontWindow.position.set(0, 1, 1.8);
    frontWindow.rotation.x = -0.3;
    group.add(frontWindow);
    
    var rearWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    rearWindow.position.set(0, 1, -1.8);
    rearWindow.rotation.x = 0.3;
    group.add(rearWindow);
    
    // Wheels
    var wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    wheelGeometry.rotateX(Math.PI / 2);
    var wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.1
    });
    
    var wheelPositions = [
        { x: -1.2, y: -0.3, z: 0.8 },
        { x: 1.2, y: -0.3, z: 0.8 },
        { x: -1.2, y: -0.3, z: -0.8 },
        { x: 1.2, y: -0.3, z: -0.8 }
    ];
    
    gameState.wheels = [];
    for (var i = 0; i < wheelPositions.length; i++) {
        var wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(wheelPositions[i].x, wheelPositions[i].y, wheelPositions[i].z);
        group.add(wheel);
        gameState.wheels.push(wheel);
    }
    
    // Headlights
    var headlightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    var headlightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffff00
    });
    
    var leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.5, 0.3, 2.4);
    group.add(leftHeadlight);
    
    var rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.5, 0.3, 2.4);
    group.add(rightHeadlight);
    
    // Add to scene
    gameState.scene.add(group);
    gameState.vehicle = group;
    gameState.vehicle.position.set(0, 0.5, 0);
    
    // Vehicle state
    gameState.vehicleState = {
        position: new THREE.Vector3(0, 0.5, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0, 'YXZ'),
        steering: 0,
        throttle: 0,
        brake: 0,
        speed: 0,
        rpm: 0,
        gear: 0
    };
    
    // Setup camera to follow vehicle
    gameState.camera.position.set(0, 5, 10);
    gameState.camera.lookAt(gameState.vehicle.position);
}

// Setup touch controls
function setupTouchControls() {
    // Steering buttons
    var steeringLeft = document.getElementById('steering-left');
    var steeringRight = document.getElementById('steering-right');
    var accelerateBtn = document.getElementById('accelerate-btn');
    var brakeBtn = document.getElementById('brake-btn');
    var nitroBtn = document.getElementById('nitro-btn');
    
    // Touch event handlers
    function touchStartHandler(key) {
        return function(e) {
            e.preventDefault();
            gameState.touchControls[key] = true;
            e.target.classList.add('active');
        };
    }
    
    function touchEndHandler(key) {
        return function(e) {
            e.preventDefault();
            gameState.touchControls[key] = false;
            e.target.classList.remove('active');
        };
    }
    
    if (steeringLeft) {
        steeringLeft.addEventListener('touchstart', touchStartHandler('steeringLeft'));
        steeringLeft.addEventListener('touchend', touchEndHandler('steeringLeft'));
    }
    
    if (steeringRight) {
        steeringRight.addEventListener('touchstart', touchStartHandler('steeringRight'));
        steeringRight.addEventListener('touchend', touchEndHandler('steeringRight'));
    }
    
    if (accelerateBtn) {
        accelerateBtn.addEventListener('touchstart', touchStartHandler('accelerate'));
        accelerateBtn.addEventListener('touchend', touchEndHandler('accelerate'));
    }
    
    if (brakeBtn) {
        brakeBtn.addEventListener('touchstart', touchStartHandler('brake'));
        brakeBtn.addEventListener('touchend', touchEndHandler('brake'));
    }
    
    if (nitroBtn) {
        nitroBtn.addEventListener('touchstart', touchStartHandler('nitro'));
        nitroBtn.addEventListener('touchend', touchEndHandler('nitro'));
    }
}

// Setup menu buttons
function setupMenuButtons() {
    var freeRoamBtn = document.getElementById('free-roam-btn');
    var raceBtn = document.getElementById('race-btn');
    var settingsBtn = document.getElementById('settings-btn');
    var resumeBtn = document.getElementById('resume-btn');
    var restartBtn = document.getElementById('restart-btn');
    var quitBtn = document.getElementById('quit-btn');
    
    if (freeRoamBtn) {
        freeRoamBtn.addEventListener('click', function() {
            hideMainMenu();
            startFreeRoam();
        });
    }
    
    if (raceBtn) {
        raceBtn.addEventListener('click', function() {
            showNotification('Race mode coming soon!');
        });
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            showNotification('Settings coming soon!');
        });
    }
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function() {
            hidePauseMenu();
        });
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            resetVehicle();
            hidePauseMenu();
        });
    }
    
    if (quitBtn) {
        quitBtn.addEventListener('click', function() {
            hidePauseMenu();
            showMainMenu();
        });
    }
}

// Window resize
function onWindowResize() {
    if (gameState.camera) {
        gameState.camera.aspect = window.innerWidth / window.innerHeight;
        gameState.camera.updateProjectionMatrix();
    }
    if (gameState.renderer) {
        gameState.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Game loop
function startGameLoop() {
    gameState.clock = new THREE.Clock();
    gameState.lastTime = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        
        var deltaTime = gameState.clock.getDelta();
        
        // Update game
        if (gameState.current === 'playing') {
            updateGame(deltaTime);
        }
        
        // Render
        if (gameState.renderer) {
            gameState.renderer.render(gameState.scene, gameState.camera);
        }
    }
    
    animate();
}

// Update game
function updateGame(deltaTime) {
    // Update vehicle
    updateVehicle(deltaTime);
    
    // Update camera
    updateCamera(deltaTime);
    
    // Update UI
    updateHUD();
}

// Update vehicle
function updateVehicle(deltaTime) {
    if (!gameState.vehicleState) return;
    
    var state = gameState.vehicleState;
    
    // Get input
    var steering = 0;
    var throttle = 0;
    var brake = 0;
    
    // Touch controls
    if (gameState.touchControls.steeringLeft) steering -= 1;
    if (gameState.touchControls.steeringRight) steering += 1;
    if (gameState.touchControls.accelerate) throttle = 1;
    if (gameState.touchControls.brake) brake = 1;
    
    // Apply steering
    state.steering = steering;
    var targetSteeringAngle = steering * (Math.PI / 4);
    state.rotation.y += (targetSteeringAngle - state.rotation.y) * 2.5 * deltaTime;
    
    // Apply throttle
    if (throttle > 0) {
        var forward = getForwardVector(state.rotation.y);
        state.velocity.add(forward.multiplyScalar(8 * throttle * deltaTime));
    }
    
    // Apply brake
    if (brake > 0) {
        state.velocity.multiplyScalar(Math.max(0, 1 - 15 * brake * deltaTime));
    }
    
    // Apply drag
    state.velocity.multiplyScalar(Math.max(0, 1 - 0.02 * deltaTime));
    
    // Limit speed
    if (state.velocity.length() > 60) {
        state.velocity.multiplyScalar(60 / state.velocity.length());
    }
    
    // Update position
    state.position.add(state.velocity.clone().multiplyScalar(deltaTime));
    
    // Update speed and RPM
    state.speed = state.velocity.length();
    state.rpm = state.speed * 100;
    
    // Update gear
    if (state.speed > 5 && state.gear < 5) {
        state.gear = Math.min(5, state.gear + 1);
    } else if (state.speed < 2 && state.gear > 0) {
        state.gear = Math.max(0, state.gear - 1);
    }
    
    // Update vehicle mesh
    if (gameState.vehicle) {
        gameState.vehicle.position.copy(state.position);
        gameState.vehicle.rotation.copy(state.rotation);
    }
    
    // Rotate wheels
    if (gameState.wheels) {
        for (var i = 0; i < gameState.wheels.length; i++) {
            gameState.wheels[i].rotation.x += state.speed * 10 * deltaTime;
        }
    }
    
    // Keep vehicle grounded
    if (state.position.y < 0.3) {
        state.position.y = 0.3;
        state.velocity.y = 0;
    }
    
    // Collision boundaries
    if (state.position.x < -450) {
        state.position.x = -450;
        state.velocity.x *= -0.5;
    } else if (state.position.x > 450) {
        state.position.x = 450;
        state.velocity.x *= -0.5;
    }
    
    if (state.position.z < -450) {
        state.position.z = -450;
        state.velocity.z *= -0.5;
    } else if (state.position.z > 450) {
        state.position.z = 450;
        state.velocity.z *= -0.5;
    }
}

// Get forward vector
function getForwardVector(yRotation) {
    var direction = new THREE.Vector3(0, 0, 1);
    var euler = new THREE.Euler(0, yRotation, 0, 'YXZ');
    direction.applyEuler(euler);
    return direction.normalize();
}

// Update camera
function updateCamera(deltaTime) {
    if (!gameState.vehicle || !gameState.camera) return;
    
    var targetPosition = gameState.vehicle.position.clone();
    var forward = getForwardVector(gameState.vehicleState.rotation.y);
    forward.negate();
    
    var cameraPosition = targetPosition.clone();
    cameraPosition.add(forward.multiplyScalar(8));
    cameraPosition.y += 2;
    
    // Smooth camera movement
    gameState.camera.position.lerp(cameraPosition, 0.1);
    gameState.camera.lookAt(targetPosition);
}

// Update HUD
function updateHUD() {
    if (!gameState.vehicleState) return;
    
    var speedKmh = Math.round(gameState.vehicleState.speed * 3.6);
    var gearText = gameState.vehicleState.gear === 0 ? 'N' : gameState.vehicleState.gear;
    
    if (uiElements.speedometer) {
        uiElements.speedometer.textContent = speedKmh + ' KM/H';
    }
    
    if (uiElements.gearDisplay) {
        uiElements.gearDisplay.textContent = gearText;
    }
}

// Start free roam
function startFreeRoam() {
    gameState.current = 'playing';
    
    if (uiElements.hud) uiElements.hud.classList.add('active');
    if (uiElements.touchControls) uiElements.touchControls.classList.add('active');
    
    resetVehicle();
    
    showNotification('Free Roam Mode - Drive anywhere!');
}

// Reset vehicle
function resetVehicle() {
    if (gameState.vehicleState) {
        gameState.vehicleState.position.set(0, 0.5, 0);
        gameState.vehicleState.velocity.set(0, 0, 0);
        gameState.vehicleState.rotation.set(0, 0, 0);
        gameState.vehicleState.speed = 0;
        gameState.vehicleState.rpm = 0;
        gameState.vehicleState.gear = 0;
        
        if (gameState.vehicle) {
            gameState.vehicle.position.set(0, 0.5, 0);
            gameState.vehicle.rotation.set(0, 0, 0);
        }
        
        if (gameState.camera) {
            gameState.camera.position.set(0, 5, 10);
            gameState.camera.lookAt(0, 0, 0);
        }
    }
}

// Show functions
function showLoadingScreen() {
    if (uiElements.loadingScreen) {
        uiElements.loadingScreen.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    if (uiElements.loadingScreen) {
        uiElements.loadingScreen.classList.add('hidden');
    }
}

function showMainMenu() {
    gameState.current = 'menu';
    if (uiElements.mainMenu) {
        uiElements.mainMenu.classList.add('active');
    }
    if (uiElements.hud) {
        uiElements.hud.classList.remove('active');
    }
    if (uiElements.touchControls) {
        uiElements.touchControls.classList.remove('active');
    }
}

function hideMainMenu() {
    if (uiElements.mainMenu) {
        uiElements.mainMenu.classList.remove('active');
    }
}

function showPauseMenu() {
    gameState.current = 'paused';
    if (uiElements.pauseMenu) {
        uiElements.pauseMenu.classList.add('active');
    }
    if (uiElements.hud) {
        uiElements.hud.classList.remove('active');
    }
    if (uiElements.touchControls) {
        uiElements.touchControls.classList.remove('active');
    }
}

function hidePauseMenu() {
    gameState.current = 'playing';
    if (uiElements.pauseMenu) {
        uiElements.pauseMenu.classList.remove('active');
    }
    if (uiElements.hud) {
        uiElements.hud.classList.add('active');
    }
    if (uiElements.touchControls) {
        uiElements.touchControls.classList.add('active');
    }
}

function showNotification(message, duration) {
    if (uiElements.notification) {
        uiElements.notification.textContent = message;
        uiElements.notification.style.display = 'block';
        
        if (!duration) duration = 2000;
        
        setTimeout(function() {
            if (uiElements.notification) {
                uiElements.notification.style.display = 'none';
            }
        }, duration);
    }
}

function updateLoadingProgress(progress, text) {
    if (uiElements.loadingBar) {
        uiElements.loadingBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }
    if (uiElements.loadingText) {
        uiElements.loadingText.textContent = text || 'Loading...';
    }
}

// Fullscreen toggle
function toggleFullscreen() {
    var elem = document.documentElement;
    
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(function(err) {
                console.error('Fullscreen error:', err);
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Error handling
function showError(message) {
    showNotification('ERROR: ' + message, 5000);
    console.error('VICE CITY ERROR:', message);
}

// Start the game if Three.js is already loaded
if (typeof THREE !== 'undefined') {
    initGame();
}
