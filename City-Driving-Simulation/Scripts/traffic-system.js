/// @file traffic-system.js
/// Basic traffic system for city driving simulation

/**
 * TrafficSystem class manages AI vehicles, traffic lights, and traffic flow
 * This provides basic traffic simulation to enhance the driving experience
 */
class TrafficSystem {
    constructor() {
        // Traffic vehicles array
        this.trafficVehicles = [];
        this.maxTrafficVehicles = 5;
        
        // Traffic lights array
        this.trafficLights = [];
        this.trafficLightTimer = 0;
        this.trafficLightCycleTime = 30; // seconds
        
        // AI behavior settings
        this.aiVehicleSpeed = 8; // Slower than player max speed
        this.followDistance = 5;
        this.laneWidth = 3;
        
        // Traffic routes (predefined paths for AI vehicles)
        this.trafficRoutes = [
            // Route 1: Main street loop
            [
                new Vector3(-50, 0, 0),
                new Vector3(-25, 0, 0),
                new Vector3(0, 0, 0),
                new Vector3(25, 0, 0),
                new Vector3(50, 0, 0),
                new Vector3(50, 0, 25),
                new Vector3(25, 0, 25),
                new Vector3(0, 0, 25),
                new Vector3(-25, 0, 25),
                new Vector3(-50, 0, 25),
                new Vector3(-50, 0, 0)
            ],
            // Route 2: Cross street
            [
                new Vector3(0, 0, -50),
                new Vector3(0, 0, -25),
                new Vector3(0, 0, 0),
                new Vector3(0, 0, 25),
                new Vector3(0, 0, 50),
                new Vector3(0, 0, 25),
                new Vector3(0, 0, 0),
                new Vector3(0, 0, -25),
                new Vector3(0, 0, -50)
            ]
        ];
        
        this.Initialize();
    }
    
    /**
     * Initialize traffic system
     */
    Initialize() {
        Logging.Log("Initializing Traffic System...");
        
        // Create traffic lights at major intersections
        this.CreateTrafficLights();
        
        // Spawn initial traffic vehicles
        this.SpawnTrafficVehicles();
        
        // Start traffic update loop
        this.StartTrafficUpdateLoop();
        
        Logging.Log("Traffic System initialized with " + this.trafficVehicles.length + " vehicles");
    }
    
    /**
     * Create traffic lights at intersections
     * TODO: Replace with user-provided traffic light models
     */
    CreateTrafficLights() {
        // Main intersection traffic lights
        const intersectionPositions = [
            new Vector3(0, 2, 0),   // Center intersection
            new Vector3(25, 2, 0),  // East intersection
            new Vector3(-25, 2, 0), // West intersection
            new Vector3(0, 2, 25),  // North intersection
            new Vector3(0, 2, -25)  // South intersection
        ];
        
        intersectionPositions.forEach((position, index) => {
            try {
                /*
                 * USER ASSET PLACEHOLDER: Traffic Light Models
                 * Replace the cube entities below with proper traffic light models:
                 * 
                 * Required assets:
                 * - Traffic light pole: "Models/traffic-light-pole.glb" 
                 * - Traffic light box: "Models/traffic-light-box.glb"
                 * - Red light texture: "Images/red-light.png"
                 * - Yellow light texture: "Images/yellow-light.png" 
                 * - Green light texture: "Images/green-light.png"
                 * 
                 * Example integration:
                 * const trafficLightEntity = world.AddMeshEntity(
                 *     null,
                 *     "Models/traffic-light-complete.glb",
                 *     position,
                 *     Quaternion.identity,
                 *     Vector3.one,
                 *     "TrafficLight_" + index
                 * );
                 * 
                 * Format: GLB/GLTF models with separate materials for each light color
                 * Scale: Approximately 2-3 units tall for proper visibility
                 */
                
                // Temporary placeholder - basic colored cube
                const trafficLight = {
                    position: position,
                    currentState: 'green', // 'red', 'yellow', 'green'
                    timer: Math.random() * this.trafficLightCycleTime,
                    entity: null // Will be created when world is available
                };
                
                this.trafficLights.push(trafficLight);
                
            } catch (error) {
                Logging.LogError("Failed to create traffic light at " + position + ": " + error);
            }
        });
    }
    
    /**
     * Spawn AI traffic vehicles
     * TODO: Replace with user-provided vehicle models
     */
    SpawnTrafficVehicles() {
        for (let i = 0; i < this.maxTrafficVehicles; i++) {
            try {
                // Select random route and starting position
                const routeIndex = Math.floor(Math.random() * this.trafficRoutes.length);
                const route = this.trafficRoutes[routeIndex];
                const startPosition = route[0];
                
                /*
                 * USER ASSET PLACEHOLDER: AI Vehicle Models
                 * Replace the basic entity creation below with diverse vehicle models:
                 * 
                 * Required assets:
                 * - Car models: "Models/car-sedan.glb", "Models/car-suv.glb", "Models/car-hatchback.glb"
                 * - Truck models: "Models/truck-small.glb", "Models/truck-large.glb"  
                 * - Bus model: "Models/city-bus.glb"
                 * - Emergency vehicles: "Models/police-car.glb", "Models/ambulance.glb"
                 * 
                 * Example integration:
                 * const vehicleModels = [
                 *     "Models/car-sedan.glb",
                 *     "Models/car-suv.glb", 
                 *     "Models/truck-small.glb"
                 * ];
                 * const modelPath = vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
                 * 
                 * Format: GLB/GLTF models, scaled appropriately for the city environment
                 * Scale: Approximately 2x1x4 units (width x height x length)
                 */
                
                const trafficVehicle = {
                    id: "traffic_vehicle_" + i,
                    routeIndex: routeIndex,
                    route: route,
                    currentWaypointIndex: 0,
                    position: new Vector3(startPosition.x, startPosition.y, startPosition.z),
                    rotation: Quaternion.identity,
                    speed: this.aiVehicleSpeed * (0.8 + Math.random() * 0.4), // Vary speed slightly
                    entity: null, // Will be created when world is available
                    lastPosition: startPosition,
                    stuckTimer: 0
                };
                
                this.trafficVehicles.push(trafficVehicle);
                
            } catch (error) {
                Logging.LogError("Failed to create traffic vehicle " + i + ": " + error);
            }
        }
    }
    
    /**
     * Create traffic vehicle entities (called after world is initialized)
     */
    CreateTrafficVehicleEntities(world) {
        this.trafficVehicles.forEach((vehicle, index) => {
            try {
                // Create a basic placeholder entity for the traffic vehicle
                // This will be replaced with proper vehicle models
                const entityId = UUID.NewUUID().ToString();
                
                // For now, we'll track the vehicle logically and let the main world
                // handle the visual representation through proper model loading
                vehicle.entityId = entityId;
                
                Logging.Log("Created traffic vehicle entity: " + vehicle.id);
                
            } catch (error) {
                Logging.LogError("Failed to create entity for traffic vehicle " + vehicle.id + ": " + error);
            }
        });
    }
    
    /**
     * Update traffic system
     */
    UpdateTraffic(deltaTime) {
        // Update traffic lights
        this.UpdateTrafficLights(deltaTime);
        
        // Update AI vehicles
        this.UpdateTrafficVehicles(deltaTime);
    }
    
    /**
     * Update traffic light states
     */
    UpdateTrafficLights(deltaTime) {
        this.trafficLights.forEach(light => {
            light.timer += deltaTime;
            
            // Cycle through traffic light states
            if (light.timer > this.trafficLightCycleTime) {
                light.timer = 0;
                
                switch (light.currentState) {
                    case 'green':
                        light.currentState = 'yellow';
                        break;
                    case 'yellow':
                        light.currentState = 'red';
                        break;
                    case 'red':
                        light.currentState = 'green';
                        break;
                }
                
                // TODO: Update visual representation when models are available
                // light.entity.SetMaterial(light.currentState + "Material");
            }
        });
    }
    
    /**
     * Update AI traffic vehicles
     */
    UpdateTrafficVehicles(deltaTime) {
        this.trafficVehicles.forEach(vehicle => {
            if (!vehicle.route || vehicle.route.length === 0) return;
            
            // Get current waypoint
            const currentWaypoint = vehicle.route[vehicle.currentWaypointIndex];
            const distanceToWaypoint = Vector3.Distance(vehicle.position, currentWaypoint);
            
            // Move towards current waypoint
            if (distanceToWaypoint > 1.0) {
                // Calculate direction to waypoint
                const direction = Vector3.Subtract(currentWaypoint, vehicle.position);
                const normalizedDirection = direction.normalized();
                
                // Move vehicle
                const movement = Vector3.Scale(normalizedDirection, vehicle.speed * deltaTime);
                vehicle.position = Vector3.Add(vehicle.position, movement);
                
                // Update rotation to face movement direction
                if (normalizedDirection.magnitude > 0.1) {
                    const targetRotation = Quaternion.LookRotation(normalizedDirection, Vector3.up);
                    vehicle.rotation = Quaternion.Slerp(vehicle.rotation, targetRotation, deltaTime * 2);
                }
                
                // Check for traffic lights and other vehicles
                this.ApplyTrafficRules(vehicle, deltaTime);
                
            } else {
                // Reached waypoint, move to next one
                vehicle.currentWaypointIndex = (vehicle.currentWaypointIndex + 1) % vehicle.route.length;
            }
            
            // Check if vehicle is stuck
            const movementDistance = Vector3.Distance(vehicle.position, vehicle.lastPosition);
            if (movementDistance < 0.1) {
                vehicle.stuckTimer += deltaTime;
                if (vehicle.stuckTimer > 5.0) {
                    // Reset vehicle to start of route
                    vehicle.position = vehicle.route[0];
                    vehicle.currentWaypointIndex = 0;
                    vehicle.stuckTimer = 0;
                }
            } else {
                vehicle.stuckTimer = 0;
                vehicle.lastPosition = vehicle.position;
            }
            
            // TODO: Update visual entity position when available
            // if (vehicle.entity) {
            //     vehicle.entity.SetPosition(vehicle.position, false);
            //     vehicle.entity.SetRotation(vehicle.rotation, false);
            // }
        });
    }
    
    /**
     * Apply traffic rules to AI vehicles
     */
    ApplyTrafficRules(vehicle, deltaTime) {
        // Check traffic lights
        const nearbyTrafficLight = this.GetNearbyTrafficLight(vehicle.position);
        if (nearbyTrafficLight && nearbyTrafficLight.currentState === 'red') {
            const distanceToLight = Vector3.Distance(vehicle.position, nearbyTrafficLight.position);
            if (distanceToLight < 10) {
                // Stop for red light
                vehicle.speed = Math.max(0, vehicle.speed - 20 * deltaTime);
                return;
            }
        }
        
        // Check other vehicles for collision avoidance
        this.trafficVehicles.forEach(otherVehicle => {
            if (otherVehicle.id === vehicle.id) return;
            
            const distance = Vector3.Distance(vehicle.position, otherVehicle.position);
            if (distance < this.followDistance) {
                // Slow down to maintain following distance
                vehicle.speed = Math.max(this.aiVehicleSpeed * 0.3, vehicle.speed - 10 * deltaTime);
            }
        });
        
        // Restore normal speed when clear
        if (vehicle.speed < this.aiVehicleSpeed) {
            vehicle.speed = Math.min(this.aiVehicleSpeed, vehicle.speed + 5 * deltaTime);
        }
    }
    
    /**
     * Get nearby traffic light
     */
    GetNearbyTrafficLight(position) {
        let nearestLight = null;
        let nearestDistance = Infinity;
        
        this.trafficLights.forEach(light => {
            const distance = Vector3.Distance(position, light.position);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestLight = light;
            }
        });
        
        return nearestDistance < 15 ? nearestLight : null;
    }
    
    /**
     * Start traffic update loop
     */
    StartTrafficUpdateLoop() {
        const context = this;
        
        // Store reference in global context
        Context.DefineContext("TrafficSystemContext", context);
        
        // Update loop at 30 FPS (traffic doesn't need high frequency updates)
        Time.SetInterval(`
            const context = Context.GetContext("TrafficSystemContext");
            if (context) {
                context.UpdateTraffic(1/30); // 30 FPS
            }
        `, 33); // ~30 FPS (33ms intervals)
    }
    
    /**
     * Get traffic information for other systems
     */
    GetTrafficInfo() {
        return {
            vehicleCount: this.trafficVehicles.length,
            trafficLightCount: this.trafficLights.length,
            averageSpeed: this.trafficVehicles.reduce((sum, v) => sum + v.speed, 0) / this.trafficVehicles.length
        };
    }
    
    /**
     * Check if position is near traffic (for collision detection)
     */
    IsNearTraffic(position, checkRadius = 5) {
        return this.trafficVehicles.some(vehicle => 
            Vector3.Distance(position, vehicle.position) < checkRadius
        );
    }
}

// Global reference for other scripts
let globalTrafficSystem = null;

/**
 * Initialize traffic system (called from main script)
 */
function InitializeTrafficSystem() {
    if (!globalTrafficSystem) {
        globalTrafficSystem = new TrafficSystem();
    }
    return globalTrafficSystem;
}

/**
 * Get traffic system instance
 */
function GetTrafficSystem() {
    return globalTrafficSystem;
}