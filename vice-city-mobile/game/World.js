// VICE CITY: STREET LIFE - World Class
// Creates the 3D city environment

import * as THREE from 'three';

export class World {
    constructor(scene, settings) {
        this.scene = scene;
        this.settings = settings;
        
        // World objects
        this.roadNetwork = [];
        this.buildings = [];
        this.vegetation = [];
        this.props = [];
        this.traffic = [];
        
        // Ground
        this.ground = null;
        
        // City layout
        this.districts = [];
        
        // Textures (will be loaded)
        this.textures = {
            road: null,
            sidewalk: null,
            grass: null,
            building: null,
            water: null
        };
        
        // Colors
        this.colors = {
            road: 0x333333,
            roadLine: 0xffffff,
            sidewalk: 0x555555,
            grass: 0x228822,
            building: 0x666666,
            water: 0x114488,
            palmTrunk: 0x8B4513,
            palmLeaves: 0x228822
        };
    }
    
    async loadAssets() {
        console.log('World: Loading assets...');
        
        // For now, we'll use simple colors
        // In later phases, we'll load actual textures
        
        // Create simple procedural textures
        this.createProceduralTextures();
        
        console.log('World: Assets loaded');
    }
    
    createProceduralTextures() {
        // Road texture
        const roadTexture = new THREE.CanvasTexture(this.createRoadCanvas());
        roadTexture.wrapS = THREE.RepeatWrapping;
        roadTexture.wrapT = THREE.RepeatWrapping;
        roadTexture.repeat.set(10, 10);
        this.textures.road = roadTexture;
        
        // Sidewalk texture
        const sidewalkTexture = new THREE.CanvasTexture(this.createSidewalkCanvas());
        sidewalkTexture.wrapS = THREE.RepeatWrapping;
        sidewalkTexture.wrapT = THREE.RepeatWrapping;
        sidewalkTexture.repeat.set(10, 10);
        this.textures.sidewalk = sidewalkTexture;
        
        // Grass texture
        const grassTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMzM4YzMzIi8+PC9zdmc+');
        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(20, 20);
        this.textures.grass = grassTexture;
    }
    
    createRoadCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Base road color
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, 128, 128);
        
        // Road lines
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        // Center line
        ctx.beginPath();
        ctx.moveTo(0, 64);
        ctx.lineTo(128, 64);
        ctx.stroke();
        
        // Side lines
        ctx.beginPath();
        ctx.moveTo(0, 32);
        ctx.lineTo(128, 32);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 96);
        ctx.lineTo(128, 96);
        ctx.stroke();
        
        return canvas;
    }
    
    createSidewalkCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Base sidewalk color
        ctx.fillStyle = '#555555';
        ctx.fillRect(0, 0, 64, 64);
        
        // Sidewalk lines
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 64; i += 8) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(64, i);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    async create() {
        console.log('World: Creating city...');
        
        // Create ground
        this.createGround();
        
        // Create ocean
        this.createOcean();
        
        // Create districts
        await this.createDistricts();
        
        // Create road network
        this.createRoads();
        
        // Add vegetation
        this.createVegetation();
        
        // Add props
        this.createProps();
        
        // Create collision boundaries
        this.createCollisionBoundaries();
        
        console.log('World: City created');
    }
    
    createGround() {
        const geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
        
        // Create a simple terrain with some variation
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            // Add slight randomness to terrain
            const noise = Math.sin(vertices[i] * 0.01) * Math.cos(vertices[i + 1] * 0.01) * 0.1;
            vertices[i + 2] = noise;
        }
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshStandardMaterial({
            color: this.colors.grass,
            roughness: 0.8,
            metalness: 0.2
        });
        
        this.ground = new THREE.Mesh(geometry, material);
        this.ground.receiveShadow = true;
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = -0.1;
        this.scene.add(this.ground);
    }
    
    createOcean() {
        // Create ocean around the city
        const oceanGeometry = new THREE.PlaneGeometry(3000, 3000);
        const oceanMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.water,
            roughness: 0.1,
            metalness: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.y = -1;
        this.scene.add(ocean);
        
        // Add some waves with simple animation
        ocean.userData.animate = true;
        ocean.userData.waveTime = 0;
    }
    
    async createDistricts() {
        // Create District A - Ocean Drive (Beach area)
        this.createOceanDriveDistrict();
        
        // Create District B - Downtown
        this.createDowntownDistrict();
        
        // Create District C - Palm District
        this.createPalmDistrict();
        
        // Create District D - Little Havana
        this.createLittleHavanaDistrict();
        
        // Create District E - Port
        this.createPortDistrict();
        
        // Create District G - Sunset Highway
        this.createSunsetHighway();
    }
    
    createOceanDriveDistrict() {
        const district = {
            name: 'Ocean Drive',
            position: { x: 0, z: -200 },
            size: { width: 400, depth: 300 },
            buildings: [],
            props: []
        };
        
        // Create beach
        const beachGeometry = new THREE.PlaneGeometry(400, 100);
        const beachMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4a460,
            roughness: 0.9,
            metalness: 0.1
        });
        const beach = new THREE.Mesh(beachGeometry, beachMaterial);
        beach.rotation.x = -Math.PI / 2;
        beach.position.set(0, -0.1, -200);
        this.scene.add(beach);
        district.props.push(beach);
        
        // Create beachfront road
        const roadGeometry = new THREE.PlaneGeometry(400, 20);
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.road,
            roughness: 0.7,
            metalness: 0.1
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0.1, -150);
        this.scene.add(road);
        district.props.push(road);
        
        // Create palm trees along the beach
        for (let i = 0; i < 20; i++) {
            const palm = this.createPalmTree();
            palm.position.set(
                -180 + (i * 20),
                0,
                -220 + Math.sin(i * 0.5) * 10
            );
            this.scene.add(palm);
            district.props.push(palm);
        }
        
        // Create beachfront buildings (hotels)
        for (let i = 0; i < 10; i++) {
            const building = this.createBuilding(
                'hotel',
                20 + Math.random() * 10,
                30 + Math.random() * 50,
                20 + Math.random() * 10
            );
            building.position.set(
                -180 + (i * 40),
                0,
                -180
            );
            this.scene.add(building);
            district.buildings.push(building);
        }
        
        this.districts.push(district);
    }
    
    createDowntownDistrict() {
        const district = {
            name: 'Downtown',
            position: { x: 200, z: 0 },
            size: { width: 400, depth: 400 },
            buildings: [],
            props: []
        };
        
        // Create tall skyscrapers
        for (let i = 0; i < 15; i++) {
            const building = this.createBuilding(
                'skyscraper',
                30 + Math.random() * 20,
                100 + Math.random() * 200,
                30 + Math.random() * 20
            );
            building.position.set(
                220 + (i % 5) * 70 - 140,
                0,
                -150 + Math.floor(i / 5) * 70
            );
            this.scene.add(building);
            district.buildings.push(building);
        }
        
        // Create intersection
        const intersectionGeometry = new THREE.PlaneGeometry(100, 100);
        const intersectionMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.road,
            roughness: 0.7,
            metalness: 0.1
        });
        const intersection = new THREE.Mesh(intersectionGeometry, intersectionMaterial);
        intersection.rotation.x = -Math.PI / 2;
        intersection.position.set(200, 0.1, 0);
        this.scene.add(intersection);
        district.props.push(intersection);
        
        this.districts.push(district);
    }
    
    createPalmDistrict() {
        const district = {
            name: 'Palm District',
            position: { x: -300, z: 100 },
            size: { width: 300, depth: 300 },
            buildings: [],
            props: []
        };
        
        // Create luxury houses
        for (let i = 0; i < 12; i++) {
            const building = this.createBuilding(
                'house',
                25 + Math.random() * 15,
                15 + Math.random() * 10,
                25 + Math.random() * 15
            );
            building.position.set(
                -280 + (i % 4) * 60,
                0,
                120 + Math.floor(i / 4) * 60
            );
            this.scene.add(building);
            district.buildings.push(building);
        }
        
        // Create pools
        for (let i = 0; i < 6; i++) {
            const poolGeometry = new THREE.PlaneGeometry(20, 10);
            const poolMaterial = new THREE.MeshStandardMaterial({
                color: 0x114488,
                roughness: 0.1,
                metalness: 0.5
            });
            const pool = new THREE.Mesh(poolGeometry, poolMaterial);
            pool.rotation.x = -Math.PI / 2;
            pool.position.set(
                -280 + (i % 3) * 80,
                0.1,
                130 + Math.floor(i / 3) * 80
            );
            this.scene.add(pool);
            district.props.push(pool);
        }
        
        // Create many palm trees
        for (let i = 0; i < 30; i++) {
            const palm = this.createPalmTree();
            palm.position.set(
                -290 + Math.random() * 280,
                0,
                110 + Math.random() * 280
            );
            this.scene.add(palm);
            district.props.push(palm);
        }
        
        this.districts.push(district);
    }
    
    createLittleHavanaDistrict() {
        const district = {
            name: 'Little Havana',
            position: { x: 100, z: 200 },
            size: { width: 200, depth: 200 },
            buildings: [],
            props: []
        };
        
        // Create colorful buildings
        for (let i = 0; i < 20; i++) {
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
            const building = this.createBuilding(
                'shop',
                15 + Math.random() * 10,
                10 + Math.random() * 20,
                15 + Math.random() * 10,
                colors[Math.floor(Math.random() * colors.length)]
            );
            building.position.set(
                110 + (i % 5) * 30 - 75,
                0,
                210 + Math.floor(i / 5) * 30
            );
            this.scene.add(building);
            district.buildings.push(building);
        }
        
        this.districts.push(district);
    }
    
    createPortDistrict() {
        const district = {
            name: 'Port',
            position: { x: -200, z: 250 },
            size: { width: 300, depth: 200 },
            buildings: [],
            props: []
        };
        
        // Create cargo buildings
        for (let i = 0; i < 8; i++) {
            const building = this.createBuilding(
                'warehouse',
                40 + Math.random() * 20,
                20 + Math.random() * 15,
                30 + Math.random() * 20
            );
            building.position.set(
                -190 + (i % 4) * 60,
                0,
                260 + Math.floor(i / 4) * 40
            );
            this.scene.add(building);
            district.buildings.push(building);
        }
        
        // Create containers
        for (let i = 0; i < 30; i++) {
            const container = this.createContainer();
            container.position.set(
                -180 + Math.random() * 260,
                0,
                270 + Math.random() * 160
            );
            this.scene.add(container);
            district.props.push(container);
        }
        
        this.districts.push(district);
    }
    
    createSunsetHighway() {
        const district = {
            name: 'Sunset Highway',
            position: { x: 0, z: 400 },
            size: { width: 500, depth: 100 },
            buildings: [],
            props: []
        };
        
        // Create long coastal highway
        const highwayGeometry = new THREE.PlaneGeometry(500, 40);
        const highwayMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.road,
            roughness: 0.7,
            metalness: 0.1
        });
        const highway = new THREE.Mesh(highwayGeometry, highwayMaterial);
        highway.rotation.x = -Math.PI / 2;
        highway.position.set(0, 0.1, 400);
        this.scene.add(highway);
        district.props.push(highway);
        
        // Create highway barriers
        for (let i = 0; i < 50; i++) {
            const barrier = this.createBarrier();
            barrier.position.set(
                -240 + (i * 10),
                0,
                400
            );
            this.scene.add(barrier);
            district.props.push(barrier);
        }
        
        // Create street lights
        for (let i = 0; i < 25; i++) {
            const streetLight = this.createStreetLight();
            streetLight.position.set(
                -230 + (i * 20),
                0,
                400
            );
            this.scene.add(streetLight);
            district.props.push(streetLight);
        }
        
        this.districts.push(district);
    }
    
    createRoads() {
        // Create main road network connecting districts
        
        // Main north-south road
        const mainRoadGeometry = new THREE.PlaneGeometry(2000, 30);
        const mainRoadMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.road,
            roughness: 0.7,
            metalness: 0.1
        });
        const mainRoad = new THREE.Mesh(mainRoadGeometry, mainRoadMaterial);
        mainRoad.rotation.x = -Math.PI / 2;
        mainRoad.position.set(0, 0.1, 0);
        this.scene.add(mainRoad);
        this.roadNetwork.push(mainRoad);
        
        // East-west road
        const ewRoadGeometry = new THREE.PlaneGeometry(1500, 30);
        const ewRoad = new THREE.Mesh(ewRoadGeometry, mainRoadMaterial);
        ewRoad.rotation.x = -Math.PI / 2;
        ewRoad.rotation.z = Math.PI / 2;
        ewRoad.position.set(0, 0.1, 0);
        this.scene.add(ewRoad);
        this.roadNetwork.push(ewRoad);
        
        // Additional connecting roads
        for (let i = 0; i < 5; i++) {
            const road = new THREE.Mesh(
                new THREE.PlaneGeometry(200 + Math.random() * 300, 25),
                mainRoadMaterial
            );
            road.rotation.x = -Math.PI / 2;
            road.position.set(
                -400 + Math.random() * 800,
                0.1,
                -300 + Math.random() * 600
            );
            this.scene.add(road);
            this.roadNetwork.push(road);
        }
    }
    
    createVegetation() {
        // Add palm trees throughout the city
        for (let i = 0; i < 100; i++) {
            const palm = this.createPalmTree();
            palm.position.set(
                -900 + Math.random() * 1800,
                0,
                -900 + Math.random() * 1800
            );
            this.scene.add(palm);
            this.vegetation.push(palm);
        }
        
        // Add bushes
        for (let i = 0; i < 200; i++) {
            const bush = this.createBush();
            bush.position.set(
                -900 + Math.random() * 1800,
                0,
                -900 + Math.random() * 1800
            );
            this.scene.add(bush);
            this.vegetation.push(bush);
        }
    }
    
    createProps() {
        // Add street lights
        for (let i = 0; i < 50; i++) {
            const streetLight = this.createStreetLight();
            streetLight.position.set(
                -800 + Math.random() * 1600,
                0,
                -800 + Math.random() * 1600
            );
            this.scene.add(streetLight);
            this.props.push(streetLight);
        }
        
        // Add benches
        for (let i = 0; i < 30; i++) {
            const bench = this.createBench();
            bench.position.set(
                -800 + Math.random() * 1600,
                0,
                -800 + Math.random() * 1600
            );
            this.scene.add(bench);
            this.props.push(bench);
        }
        
        // Add trash bins
        for (let i = 0; i < 20; i++) {
            const trashBin = this.createTrashBin();
            trashBin.position.set(
                -800 + Math.random() * 1600,
                0,
                -800 + Math.random() * 1600
            );
            this.scene.add(trashBin);
            this.props.push(trashBin);
        }
    }
    
    createCollisionBoundaries() {
        // Create invisible walls around the city to prevent falling off
        const boundaryGeometry = new THREE.BoxGeometry(2000, 100, 10);
        const boundaryMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            visible: false
        });
        
        // North boundary
        const northBoundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
        northBoundary.position.set(0, 50, 500);
        northBoundary.userData.isBoundary = true;
        this.scene.add(northBoundary);
        
        // South boundary
        const southBoundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
        southBoundary.position.set(0, 50, -500);
        southBoundary.userData.isBoundary = true;
        this.scene.add(southBoundary);
        
        // East boundary
        const eastBoundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
        eastBoundary.rotation.y = Math.PI / 2;
        eastBoundary.position.set(500, 50, 0);
        eastBoundary.userData.isBoundary = true;
        this.scene.add(eastBoundary);
        
        // West boundary
        const westBoundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
        westBoundary.rotation.y = Math.PI / 2;
        westBoundary.position.set(-500, 50, 0);
        westBoundary.userData.isBoundary = true;
        this.scene.add(westBoundary);
    }
    
    // Object creation methods
    createPalmTree() {
        const group = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.2, 5, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.palmTrunk,
            roughness: 0.8,
            metalness: 0.1
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2.5;
        group.add(trunk);
        
        // Leaves (simplified)
        const leavesGeometry = new THREE.ConeGeometry(2, 3, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.palmLeaves,
            roughness: 0.7,
            metalness: 0.1
        });
        
        // Create multiple leaf bunches
        for (let i = 0; i < 5; i++) {
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.y = 5 + i * 0.5;
            leaves.rotation.x = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
            leaves.rotation.z = Math.random() * Math.PI * 2;
            group.add(leaves);
        }
        
        group.userData.type = 'palm_tree';
        group.castShadow = true;
        group.receiveShadow = true;
        
        return group;
    }
    
    createBuilding(type, width, height, depth, color = null) {
        const group = new THREE.Group();
        
        const baseColor = color || this.colors.building;
        
        // Main building
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.7,
            metalness: 0.2
        });
        const building = new THREE.Mesh(geometry, material);
        building.position.y = height / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);
        
        // Windows
        if (height > 20) {
            const windowGeometry = new THREE.BoxGeometry(1, 1, 0.5);
            const windowMaterial = new THREE.MeshStandardMaterial({
                color: 0x00aaff,
                transparent: true,
                opacity: 0.7
            });
            
            // Add windows in a grid pattern
            const windowRows = Math.floor(height / 5);
            const windowCols = Math.floor(width / 4);
            
            for (let r = 0; r < windowRows; r++) {
                for (let c = 0; c < windowCols; c++) {
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    window.position.set(
                        -width / 2 + 2 + c * 4,
                        2 + r * 5,
                        depth / 2 + 0.3
                    );
                    group.add(window);
                }
            }
        }
        
        // Roof
        const roofGeometry = new THREE.BoxGeometry(width * 1.1, 1, depth * 1.1);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.1
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = height + 0.5;
        group.add(roof);
        
        group.userData.type = 'building';
        group.userData.buildingType = type;
        
        return group;
    }
    
    createContainer() {
        const group = new THREE.Group();
        
        // Container body
        const bodyGeometry = new THREE.BoxGeometry(6, 2.5, 2.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.5,
            metalness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Container doors
        const doorGeometry = new THREE.BoxGeometry(0.2, 2, 2);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.7,
            metalness: 0.1
        });
        const door1 = new THREE.Mesh(doorGeometry, doorMaterial);
        door1.position.set(2.9, 0, 0);
        group.add(door1);
        
        const door2 = new THREE.Mesh(doorGeometry, doorMaterial);
        door2.position.set(-2.9, 0, 0);
        group.add(door2);
        
        group.userData.type = 'container';
        
        return group;
    }
    
    createStreetLight() {
        const group = new THREE.Group();
        
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
        const poleMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.5,
            metalness: 0.5
        });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 3;
        group.add(pole);
        
        // Light
        const lightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const lightMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.y = 6;
        group.add(light);
        
        // Add point light
        const pointLight = new THREE.PointLight(0xffff00, 0.5, 20);
        pointLight.position.y = 6;
        group.add(pointLight);
        
        group.userData.type = 'street_light';
        
        return group;
    }
    
    createBench() {
        const group = new THREE.Group();
        
        // Seat
        const seatGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.5);
        const seatMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.1
        });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        group.add(seat);
        
        // Legs
        for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
            const leg = new THREE.Mesh(legGeometry, seatMaterial);
            leg.position.set(
                -0.6 + (i % 2) * 1.2,
                -0.15,
                -0.2 + Math.floor(i / 2) * 0.4
            );
            group.add(leg);
        }
        
        // Backrest
        const backrestGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.1);
        const backrest = new THREE.Mesh(backrestGeometry, seatMaterial);
        backrest.position.set(0, 0.3, -0.25);
        group.add(backrest);
        
        group.userData.type = 'bench';
        
        return group;
    }
    
    createTrashBin() {
        const group = new THREE.Group();
        
        // Bin
        const binGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
        const binMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.5,
            metalness: 0.3
        });
        const bin = new THREE.Mesh(binGeometry, binMaterial);
        group.add(bin);
        
        // Lid
        const lidGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 16);
        const lidMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.7,
            metalness: 0.2
        });
        const lid = new THREE.Mesh(lidGeometry, lidMaterial);
        lid.position.y = 0.55;
        group.add(lid);
        
        group.userData.type = 'trash_bin';
        
        return group;
    }
    
    createBarrier() {
        const group = new THREE.Group();
        
        // Barrier segments
        for (let i = 0; i < 3; i++) {
            const segmentGeometry = new THREE.BoxGeometry(1, 0.5, 0.2);
            const segmentMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                roughness: 0.7,
                metalness: 0.2
            });
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.position.set(i * 1.2, 0.25, 0);
            group.add(segment);
        }
        
        group.userData.type = 'barrier';
        
        return group;
    }
    
    update(deltaTime) {
        // Animate ocean
        const oceanObjects = this.scene.children.filter(obj => obj.userData.animate);
        oceanObjects.forEach(obj => {
            obj.userData.waveTime += deltaTime * 0.001;
            const vertices = obj.geometry.attributes.position.array;
            for (let i = 0; i < vertices.length; i += 3) {
                const noise = Math.sin(vertices[i] * 0.01 + obj.userData.waveTime) * 
                             Math.cos(vertices[i + 1] * 0.01 + obj.userData.waveTime) * 0.05;
                vertices[i + 2] = -1 + noise;
            }
            obj.geometry.attributes.position.needsUpdate = true;
            obj.geometry.computeVertexNormals();
        });
        
        // Update traffic (placeholder for now)
        this.updateTraffic(deltaTime);
    }
    
    updateTraffic(deltaTime) {
        // Traffic AI will be implemented in a later phase
        // For now, just a placeholder
    }
    
    // Get spawn points for vehicles
    getSpawnPoints() {
        return [
            { x: 0, y: 0.5, z: 0 },
            { x: 50, y: 0.5, z: 0 },
            { x: -50, y: 0.5, z: 0 },
            { x: 0, y: 0.5, z: 50 },
            { x: 0, y: 0.5, z: -50 }
        ];
    }
}
