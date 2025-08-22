/// @file vehicle-controller.js
/// Vehicle control system for city driving simulation

/**
 * VehicleController class handles vehicle physics, controls, and state management
 * This class extends basic movement controls to provide realistic vehicle behavior
 */
class VehicleController {
    constructor(vehicleEntity, startPosition = new Vector3(0, 1, 0)) {
        // Vehicle entity reference
        this.vehicleEntity = vehicleEntity;
        
        // Vehicle physics properties
        this.speed = 0;
        this.maxSpeed = 20;
        this.acceleration = 5;
        this.deceleration = 8;
        this.turnSpeed = 2;
        this.currentSteer = 0;
        this.maxSteerAngle = 45;
        
        // Vehicle state
        this.isAccelerating = false;
        this.isBraking = false;
        this.isReversing = false;
        this.engineRunning = true;
        
        // Input state
        this.inputAcceleration = 0;
        this.inputSteering = 0;
        
        // Respawn system
        this.lastValidPosition = startPosition;
        this.lastValidRotation = Quaternion.identity;
        this.stuckTimer = 0;
        this.maxStuckTime = 5.0; // seconds before respawn
        this.minMovementThreshold = 0.1;
        
        // HUD elements (to be created)
        this.speedometerEntity = null;
        this.minimapEntity = null;
        
        // Initialize vehicle
        this.Initialize();
    }
    
    /**
     * Initialize vehicle controller
     */
    Initialize() {
        if (this.vehicleEntity) {
            this.vehicleEntity.SetInteractionState(InteractionState.Physical);
            this.vehicleEntity.SetVisibility(true, true);
            this.vehicleEntity.EnablePositionBroadcast(0.1); // Higher frequency for smooth multiplayer
            this.vehicleEntity.EnableRotationBroadcast(0.1);
        }
        
        // Create HUD interface
        this.CreateHUD();
        
        // Set up update loop
        this.StartUpdateLoop();
        
        Logging.Log("Vehicle Controller initialized");
    }
    
    /**
     * Create HUD interface elements
     * TODO: Replace with user-provided HUD assets
     */
    CreateHUD() {
        try {
            // Create speedometer canvas
            this.hudCanvas = CanvasEntity.Create(null, Vector3.zero, Quaternion.identity, Vector3.one, false);
            this.hudCanvas.MakeScreenCanvas(false);
            this.hudCanvas.SetVisibility(true);
            
            // Speed display
            this.speedometerEntity = TextEntity.Create(
                this.hudCanvas, 
                "Speed: 0 mph", 
                24, 
                new Vector2(-0.8, -0.8), 
                new Vector2(0.3, 0.1)
            );
            this.speedometerEntity.SetVisibility(true);
            
            // Controls help text
            this.controlsHelpEntity = TextEntity.Create(
                this.hudCanvas, 
                "WASD/Arrow Keys: Drive | Space: Brake | R: Reset Vehicle", 
                16, 
                new Vector2(-0.9, 0.8), 
                new Vector2(1.8, 0.1)
            );
            this.controlsHelpEntity.SetVisibility(true);
            
            /*
             * USER ASSET PLACEHOLDER: HUD/Dashboard Assets
             * Replace the basic text elements above with your custom HUD assets:
             * 
             * Required assets:
             * - Speedometer gauge image: "Images/speedometer.png"
             * - Minimap background: "Images/minimap-bg.png"
             * - Dashboard overlay: "Images/dashboard.png"
             * 
             * Example integration:
             * this.speedometerImage = ImageEntity.Create(
             *     this.hudCanvas,
             *     "Images/speedometer.png",
             *     new Vector2(-0.8, -0.8),
             *     new Vector2(0.2, 0.2)
             * );
             * 
             * Format: PNG images with transparent backgrounds
             * Resolution: 512x512 recommended for gauges, 256x256 for icons
             */
            
        } catch (error) {
            Logging.LogError("Failed to create HUD: " + error);
        }
    }
    
    /**
     * Handle driving input (acceleration/deceleration)
     */
    DriveVehicle(inputVector) {
        if (!this.engineRunning) return;
        
        // inputVector is Vector2 where y-component is forward/backward
        this.inputAcceleration = inputVector.y;
        
        this.isAccelerating = this.inputAcceleration > 0;
        this.isBraking = this.inputAcceleration < 0;
        this.isReversing = this.speed < 0;
    }
    
    /**
     * Handle steering input
     */
    SteerVehicle(inputVector) {
        if (!this.engineRunning) return;
        
        // inputVector is Vector2 where x-component is steering
        this.inputSteering = Math.max(-1, Math.min(1, inputVector.x));
    }
    
    /**
     * Stop vehicle input
     */
    StopVehicle() {
        this.inputAcceleration = 0;
        this.isAccelerating = false;
        this.isBraking = false;
    }
    
    /**
     * Stop steering input
     */
    StopSteering() {
        this.inputSteering = 0;
    }
    
    /**
     * Handle keyboard input for vehicle controls
     */
    OnKeyPress(key) {
        switch(key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.DriveVehicle(new Vector2(0, 1));
                break;
            case 's':
            case 'arrowdown':
                this.DriveVehicle(new Vector2(0, -1));
                break;
            case 'a':
            case 'arrowleft':
                this.SteerVehicle(new Vector2(-1, 0));
                break;
            case 'd':
            case 'arrowright':
                this.SteerVehicle(new Vector2(1, 0));
                break;
            case ' ':
            case 'space':
                this.ApplyBrake();
                break;
            case 'r':
                this.RespawnVehicle();
                break;
            case 'e':
                this.ToggleEngine();
                break;
        }
    }
    
    /**
     * Handle key release events
     */
    OnKeyRelease(key) {
        switch(key.toLowerCase()) {
            case 'w':
            case 's':
            case 'arrowup':
            case 'arrowdown':
                this.StopVehicle();
                break;
            case 'a':
            case 'd':
            case 'arrowleft':
            case 'arrowright':
                this.StopSteering();
                break;
        }
    }
    
    /**
     * Apply emergency brake
     */
    ApplyBrake() {
        this.speed *= 0.5; // Quick deceleration
    }
    
    /**
     * Toggle engine on/off
     */
    ToggleEngine() {
        this.engineRunning = !this.engineRunning;
        if (!this.engineRunning) {
            this.StopVehicle();
            this.StopSteering();
        }
        Logging.Log("Engine " + (this.engineRunning ? "started" : "stopped"));
    }
    
    /**
     * Update vehicle physics and position
     */
    UpdateVehicle(deltaTime) {
        if (!this.vehicleEntity || !this.engineRunning) return;
        
        const currentTransform = this.vehicleEntity.GetTransform();
        const currentPosition = currentTransform.position;
        const currentRotation = currentTransform.rotation;
        
        // Update speed based on acceleration input
        if (this.isAccelerating) {
            this.speed += this.acceleration * deltaTime;
        } else if (this.isBraking) {
            this.speed -= this.deceleration * deltaTime;
        } else {
            // Natural deceleration when no input
            this.speed *= Math.pow(0.9, deltaTime);
        }
        
        // Clamp speed to limits
        this.speed = Math.max(-this.maxSpeed * 0.5, Math.min(this.maxSpeed, this.speed));
        
        // Update steering
        this.currentSteer = this.inputSteering * this.maxSteerAngle;
        
        // Calculate movement
        if (Math.abs(this.speed) > 0.1) {
            // Forward movement
            const forwardMovement = Vector3.Scale(currentTransform.forward, this.speed * deltaTime);
            const newPosition = Vector3.Add(currentPosition, forwardMovement);
            
            // Rotation based on steering (only when moving)
            const steerFactor = (this.speed / this.maxSpeed) * this.inputSteering;
            const rotationDelta = Quaternion.Euler(0, steerFactor * this.turnSpeed * 60 * deltaTime, 0);
            const newRotation = Quaternion.Multiply(currentRotation, rotationDelta);
            
            // Apply movement
            this.vehicleEntity.SetPosition(newPosition, false);
            this.vehicleEntity.SetRotation(newRotation, false);
            
            // Update last valid position for respawn system
            this.UpdateValidPosition(newPosition, newRotation);
            this.stuckTimer = 0;
        } else {
            // Check if vehicle is stuck
            this.CheckIfStuck(deltaTime);
        }
        
        // Update HUD
        this.UpdateHUD();
    }
    
    /**
     * Update last valid position for respawn system
     */
    UpdateValidPosition(position, rotation) {
        // Only update if we've moved significantly
        const distance = Vector3.Distance(position, this.lastValidPosition);
        if (distance > 2.0) {
            this.lastValidPosition = position;
            this.lastValidRotation = rotation;
        }
    }
    
    /**
     * Check if vehicle is stuck and needs respawn
     */
    CheckIfStuck(deltaTime) {
        if (this.isAccelerating || this.isBraking) {
            this.stuckTimer += deltaTime;
            if (this.stuckTimer > this.maxStuckTime) {
                Logging.Log("Vehicle appears stuck - triggering respawn");
                this.RespawnVehicle();
            }
        } else {
            this.stuckTimer = 0;
        }
    }
    
    /**
     * Respawn vehicle to last valid position
     */
    RespawnVehicle() {
        if (this.vehicleEntity) {
            this.vehicleEntity.SetPosition(this.lastValidPosition, false);
            this.vehicleEntity.SetRotation(this.lastValidRotation, false);
            this.speed = 0;
            this.stuckTimer = 0;
            this.StopVehicle();
            this.StopSteering();
            Logging.Log("Vehicle respawned");
        }
    }
    
    /**
     * Update HUD elements
     */
    UpdateHUD() {
        try {
            if (this.speedometerEntity) {
                const speedMph = Math.abs(this.speed * 2.237); // Convert to mph (rough approximation)
                const direction = this.speed >= 0 ? "Forward" : "Reverse";
                this.speedometerEntity.SetText(`Speed: ${speedMph.toFixed(1)} mph (${direction})`);
            }
        } catch (error) {
            Logging.LogError("Failed to update HUD: " + error);
        }
    }
    
    /**
     * Start the vehicle update loop
     */
    StartUpdateLoop() {
        const context = this;
        
        // Store reference in global context for the interval function
        Context.DefineContext("VehicleControllerContext", context);
        
        // Update loop at 60 FPS
        Time.SetInterval(`
            const context = Context.GetContext("VehicleControllerContext");
            if (context) {
                context.UpdateVehicle(1/60); // Approximate 60 FPS
            }
        `, 16); // ~60 FPS (16ms intervals)
    }
    
    /**
     * Get current vehicle status for multiplayer synchronization
     */
    GetVehicleState() {
        return {
            speed: this.speed,
            steering: this.currentSteer,
            engineRunning: this.engineRunning
        };
    }
}

// Global functions for VEML input events
function DriveVehicle(inputVector) {
    const context = Context.GetContext("VehicleControllerContext");
    if (context && context.DriveVehicle) {
        context.DriveVehicle(inputVector);
    }
}

function SteerVehicle(inputVector) {
    const context = Context.GetContext("VehicleControllerContext");
    if (context && context.SteerVehicle) {
        context.SteerVehicle(inputVector);
    }
}

function StopVehicle() {
    const context = Context.GetContext("VehicleControllerContext");
    if (context && context.StopVehicle) {
        context.StopVehicle();
    }
}

function StopSteering() {
    const context = Context.GetContext("VehicleControllerContext");
    if (context && context.StopSteering) {
        context.StopSteering();
    }
}

function OnKeyPress(key) {
    const context = Context.GetContext("VehicleControllerContext");
    if (context && context.OnKeyPress) {
        context.OnKeyPress(key);
    }
}

function OnKeyRelease(key) {
    const context = Context.GetContext("VehicleControllerContext");
    if (context && context.OnKeyRelease) {
        context.OnKeyRelease(key);
    }
}