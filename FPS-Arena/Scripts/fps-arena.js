// ============================================================================
// FPS Arena - Multiplayer First Person Shooter
// ============================================================================

// ============================================================================
// CONFIGURATION - VOS Synchronization Settings
// ============================================================================
// Configure these settings to match your VOS server deployment
const VOS_CONFIG = {
    // For web-based clients (WebSocket)
    web: {
        host: "mqtt.webverse.info",
        port: 15526,
        tls: true,
        transport: "websocket"
    },
    // For focused/desktop clients (TCP)
    focused: {
        host: "mqtt.webverse.info", 
        port: 15525,
        tls: false,
        transport: "tcp"
    },
    // Session configuration
    session: {
        id: "fps-arena-session-" + Math.random().toString(36).substr(2, 9),
        tag: "fps-arena"
    }
};

// ============================================================================
// USER MODEL PLACEHOLDERS - Replace with your 3D model URLs
// ============================================================================
const ASSET_URLS = {
    // PLAYER MODEL: Replace with your player character model
    // Expected: Humanoid character, .gltf/.glb format, ~1.8 units tall
    // Should be rigged for basic animations (walk, idle, etc.)
    PLAYER_MODEL: "https://example.com/models/player-character.gltf",
    
    // WEAPON MODEL: Replace with your primary weapon model  
    // Expected: Rifle/gun model, .gltf/.glb format, properly oriented
    // Should be sized appropriately for first-person view
    WEAPON_MODEL: "https://example.com/models/assault-rifle.gltf",
    
    // ARENA ENVIRONMENT: Replace with your arena/battlefield model
    // Expected: Large arena with cover, spawn points, boundaries
    // Size: ~50x50 units, ground plane at Y=0
    ARENA_MODEL: "https://example.com/models/combat-arena.gltf",
    
    // HUD ASSETS: Replace with your UI image assets
    // All images should be PNG format with appropriate transparency
    HEALTH_BAR_BG: "Images/health-bar-bg.png",
    HEALTH_BAR_FILL: "Images/health-bar-fill.png", 
    WEAPON_ICON: "Images/weapon-rifle.png",
    CROSSHAIR: "Images/crosshair.png",
    ARENA_SKY: "Images/arena-sky.png"
};

// ============================================================================
// GAME CONFIGURATION
// ============================================================================
const GAME_CONFIG = {
    // Player settings
    MAX_HEALTH: 100,
    DAMAGE_PER_HIT: 25,
    MOVE_SPEED: 5.0,
    LOOK_SENSITIVITY: 2.0,
    JUMP_FORCE: 8.0,
    
    // Combat settings
    SHOOT_COOLDOWN: 0.2, // Seconds between shots
    WEAPON_RANGE: 100.0, // Maximum shooting distance
    
    // Respawn settings  
    RESPAWN_DELAY: 3.0, // Seconds before respawn
    SPAWN_POSITIONS: [
        new Vector3(0, 2, 0),    // Center spawn
        new Vector3(10, 2, 10),  // Northeast
        new Vector3(-10, 2, 10), // Northwest  
        new Vector3(10, 2, -10), // Southeast
        new Vector3(-10, 2, -10) // Southwest
    ],
    
    // Network settings
    UPDATE_RATE: 100 // Milliseconds between network updates
};

// ============================================================================
// GLOBAL GAME STATE
// ============================================================================
let gameState = {
    // Local player state
    player: {
        entity: null,
        characterEntity: null,
        weaponEntity: null,
        health: GAME_CONFIG.MAX_HEALTH,
        eliminations: 0,
        isAlive: true,
        lastShootTime: 0,
        ammo: 30,
        maxAmmo: 120
    },
    
    // Multiplayer state
    multiplayer: {
        session: null,
        vos: null,
        players: {}, // Other players in session
        isConnected: false
    },
    
    // Input state
    input: {
        movement: Vector3.zero,
        looking: false,
        mouseX: 0,
        mouseY: 0
    },
    
    // HUD elements
    hud: {
        healthText: null,
        healthFill: null,
        ammoText: null,
        scoreText: null,
        respawnMessage: null,
        crosshair: null
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the FPS Arena game
 * Called when the world loads
 */
function initializeFPSArena() {
    Logging.Log("[FPS Arena] Initializing game...");
    
    // Generate unique player ID
    if (!LocalStorage.GetItem("playerId")) {
        LocalStorage.SetItem("playerId", "player-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5));
    }
    
    // Initialize game systems
    initializePlayer();
    initializeHUD();
    initializeMultiplayer();
    initializeInput();
    
    // Start game loop
    startGameLoop();
    
    Logging.Log("[FPS Arena] Game initialized successfully!");
}

/**
 * Initialize the local player
 */
function initializePlayer() {
    Logging.Log("[FPS Arena] Setting up player...");
    
    // Create player character entity
    // USER MODEL PLACEHOLDER: This will load your player character model
    // Replace ASSET_URLS.PLAYER_MODEL with your actual player model URL
    gameState.player.characterEntity = new MeshEntity(
        World,
        ASSET_URLS.PLAYER_MODEL,
        GAME_CONFIG.SPAWN_POSITIONS[0],
        Quaternion.identity,
        Vector3.one,
        null,
        "local-player"
    );
    
    // Wait for character to load
    if (gameState.player.characterEntity) {
        // Set character properties
        gameState.player.characterEntity.SetVisibility(true);
        gameState.player.characterEntity.SetInteractionState(InteractionState.Static);
        
        // Create weapon entity attached to player
        // USER MODEL PLACEHOLDER: This will load your weapon model
        // Replace ASSET_URLS.WEAPON_MODEL with your actual weapon model URL
        gameState.player.weaponEntity = new MeshEntity(
            World,
            ASSET_URLS.WEAPON_MODEL,
            new Vector3(0.5, -0.3, 0.8), // Relative to camera
            Quaternion.identity,
            new Vector3(0.5, 0.5, 0.5),
            null,
            "player-weapon"
        );
        
        if (gameState.player.weaponEntity) {
            gameState.player.weaponEntity.SetVisibility(true);
            gameState.player.weaponEntity.SetInteractionState(InteractionState.Static);
        }
    }
    
    gameState.player.entity = gameState.player.characterEntity;
}

/**
 * Initialize HUD elements
 */
function initializeHUD() {
    Logging.Log("[FPS Arena] Setting up HUD...");
    
    // Get HUD elements (these are defined in the VEML file)
    try {
        gameState.hud.healthText = Entity.GetByTag("health-text")[0];
        gameState.hud.healthFill = Entity.GetByTag("health-fill")[0];
        gameState.hud.ammoText = Entity.GetByTag("ammo-text")[0];
        gameState.hud.scoreText = Entity.GetByTag("score-hud")[0];
        gameState.hud.respawnMessage = Entity.GetByTag("respawn-message")[0];
        gameState.hud.crosshair = Entity.GetByTag("crosshair")[0];
        
        // Hide respawn message initially
        if (gameState.hud.respawnMessage) {
            gameState.hud.respawnMessage.SetVisibility(false);
        }
        
        // Update initial HUD state
        updateHUD();
        
    } catch (error) {
        Logging.LogError("[FPS Arena] Error initializing HUD: " + error);
    }
}

/**
 * Initialize multiplayer systems
 */
function initializeMultiplayer() {
    Logging.Log("[FPS Arena] Setting up multiplayer...");
    
    try {
        // Create VOS synchronizer for multiplayer
        gameState.multiplayer.vos = new VOSSynchronizer(
            VOS_CONFIG.web.host,
            VOS_CONFIG.web.port,
            VOS_CONFIG.web.tls,
            VOS_CONFIG.web.transport,
            VOS_CONFIG.session,
            onVOSConnected,
            onVOSSessionJoined,
            onVOSMessage
        );
        
        // Connect to multiplayer session
        gameState.multiplayer.vos.Connect();
        
    } catch (error) {
        Logging.LogError("[FPS Arena] Error setting up multiplayer: " + error);
    }
}

/**
 * Initialize input handling
 */
function initializeInput() {
    Logging.Log("[FPS Arena] Setting up input handlers...");
    
    // Input state will be handled by the input event functions
    // defined in the VEML file and implemented below
}

// ============================================================================
// INPUT HANDLERS (Called from VEML input events)
// ============================================================================

/**
 * Handle movement input (WASD keys)
 * Called by VEML input event: input="move"
 */
function OnMove(moveVector) {
    if (!gameState.player.isAlive || !gameState.player.entity) return;
    
    // Store movement input
    gameState.input.movement = new Vector3(
        moveVector.x * GAME_CONFIG.MOVE_SPEED,
        0,
        moveVector.y * GAME_CONFIG.MOVE_SPEED
    );
}

/**
 * Handle end of movement input
 * Called by VEML input event: input="endmove" 
 */
function OnEndMove() {
    gameState.input.movement = Vector3.zero;
}

/**
 * Handle mouse look input
 * Called by VEML input event: input="look"
 */
function OnLook(lookVector) {
    if (!gameState.player.isAlive) return;
    
    gameState.input.looking = true;
    gameState.input.mouseX = lookVector.x * GAME_CONFIG.LOOK_SENSITIVITY;
    gameState.input.mouseY = lookVector.y * GAME_CONFIG.LOOK_SENSITIVITY;
}

/**
 * Handle end of mouse look
 * Called by VEML input event: input="endlook"
 */
function OnEndLook() {
    gameState.input.looking = false;
    gameState.input.mouseX = 0;
    gameState.input.mouseY = 0;
}

/**
 * Handle key press events
 * Called by VEML input event: input="key"
 */
function OnKeyPress(key) {
    if (!gameState.player.isAlive) return;
    
    switch (key.toLowerCase()) {
        case " ": // Spacebar - Jump
        case "space":
            performJump();
            break;
            
        case "r": // R key - Reload (visual only)
            performReload();
            break;
    }
}

/**
 * Handle key release events  
 * Called by VEML input event: input="endkey"
 */
function OnKeyRelease(key) {
    // Currently no specific key release handling needed
}

/**
 * Handle shooting input (left mouse click)
 * Called by VEML input event: input="leftclick"
 */
function OnShoot() {
    if (!gameState.player.isAlive) return;
    
    performShoot();
}

// ============================================================================
// PLAYER ACTIONS
// ============================================================================

/**
 * Make the player jump
 */
function performJump() {
    if (!gameState.player.entity) return;
    
    var currentPos = gameState.player.entity.GetPosition();
    var jumpPos = Vector3.Add(currentPos, new Vector3(0, GAME_CONFIG.JUMP_FORCE, 0));
    gameState.player.entity.SetPosition(jumpPos);
    
    // Broadcast jump to other players
    broadcastPlayerAction("jump", { position: jumpPos });
}

/**
 * Perform weapon reload (visual feedback only)
 */
function performReload() {
    // Visual reload - reset ammo count
    gameState.player.ammo = 30;
    updateHUD();
    
    // Broadcast reload action
    broadcastPlayerAction("reload", {});
    
    Logging.Log("[FPS Arena] Reloaded weapon");
}

/**
 * Perform shooting action
 */
function performShoot() {
    var currentTime = Time.time;
    
    // Check shoot cooldown
    if (currentTime - gameState.player.lastShootTime < GAME_CONFIG.SHOOT_COOLDOWN) {
        return;
    }
    
    // Check ammo
    if (gameState.player.ammo <= 0) {
        Logging.Log("[FPS Arena] Out of ammo! Press R to reload.");
        return;
    }
    
    gameState.player.lastShootTime = currentTime;
    gameState.player.ammo--;
    
    // Perform raycast from camera center
    var cameraPos = Camera.GetPosition();
    var cameraRot = Camera.GetRotation();
    
    // Calculate shoot direction (forward from camera)
    var shootDirection = new Vector3(0, 0, 1); // Forward
    // Apply camera rotation to direction (simplified)
    
    // Perform raycast to find hit target
    var hit = performRaycast(cameraPos, shootDirection, GAME_CONFIG.WEAPON_RANGE);
    
    if (hit && hit.entity) {
        // Check if hit target is another player
        var hitPlayerId = getPlayerIdFromEntity(hit.entity);
        if (hitPlayerId && hitPlayerId !== LocalStorage.GetItem("playerId")) {
            // Hit another player - broadcast damage
            broadcastPlayerAction("damage", {
                targetPlayerId: hitPlayerId,
                damage: GAME_CONFIG.DAMAGE_PER_HIT,
                shooterPosition: cameraPos
            });
            
            Logging.Log("[FPS Arena] Hit player: " + hitPlayerId);
        }
    }
    
    // Visual feedback for shooting
    showMuzzleFlash();
    
    // Update HUD
    updateHUD();
    
    // Broadcast shoot action to other players
    broadcastPlayerAction("shoot", {
        position: cameraPos,
        direction: shootDirection,
        timestamp: currentTime
    });
}

/**
 * Perform raycast for shooting
 * Simplified implementation - replace with actual World API raycast when available
 */
function performRaycast(origin, direction, maxDistance) {
    // PLACEHOLDER: This is a simplified raycast implementation
    // Replace with actual World API raycast functionality when available
    
    // For now, we'll check distance to other players manually
    var closest = null;
    var closestDistance = maxDistance;
    
    for (var playerId in gameState.multiplayer.players) {
        var otherPlayer = gameState.multiplayer.players[playerId];
        if (otherPlayer && otherPlayer.entity) {
            var distance = Vector3.Distance(origin, otherPlayer.entity.GetPosition());
            if (distance < closestDistance) {
                closest = {
                    entity: otherPlayer.entity,
                    distance: distance,
                    playerId: playerId
                };
                closestDistance = distance;
            }
        }
    }
    
    return closest;
}

/**
 * Get player ID from entity (helper function)
 */
function getPlayerIdFromEntity(entity) {
    // Check if entity belongs to a multiplayer player
    for (var playerId in gameState.multiplayer.players) {
        if (gameState.multiplayer.players[playerId].entity === entity) {
            return playerId;
        }
    }
    return null;
}

/**
 * Show muzzle flash effect (visual feedback)
 */
function showMuzzleFlash() {
    // PLACEHOLDER: Add muzzle flash visual effect
    // This could create a temporary light entity or particle effect
    Logging.Log("[FPS Arena] *BANG* Weapon fired!");
}

// ============================================================================
// DAMAGE AND HEALTH SYSTEM  
// ============================================================================

/**
 * Apply damage to local player
 */
function takeDamage(damage, shooterPlayerId) {
    if (!gameState.player.isAlive) return;
    
    gameState.player.health -= damage;
    Logging.Log("[FPS Arena] Took " + damage + " damage! Health: " + gameState.player.health);
    
    // Check if player is eliminated
    if (gameState.player.health <= 0) {
        gameState.player.health = 0;
        playerEliminated(shooterPlayerId);
    }
    
    updateHUD();
}

/**
 * Handle player elimination
 */
function playerEliminated(shooterPlayerId) {
    gameState.player.isAlive = false;
    
    Logging.Log("[FPS Arena] You have been eliminated!");
    
    // Award point to shooter
    if (shooterPlayerId) {
        broadcastPlayerAction("elimination", {
            eliminatedPlayerId: LocalStorage.GetItem("playerId"),
            shooterPlayerId: shooterPlayerId
        });
    }
    
    // Show respawn message
    showRespawnCountdown();
    
    // Schedule respawn
    Scripting.ScheduleExecution("respawnPlayer();", GAME_CONFIG.RESPAWN_DELAY * 1000);
}

/**
 * Respawn the player
 */
function respawnPlayer() {
    Logging.Log("[FPS Arena] Respawning player...");
    
    // Reset player state
    gameState.player.health = GAME_CONFIG.MAX_HEALTH;
    gameState.player.isAlive = true;
    gameState.player.ammo = 30;
    
    // Choose random spawn position
    var spawnIndex = Math.floor(Math.random() * GAME_CONFIG.SPAWN_POSITIONS.length);
    var spawnPosition = GAME_CONFIG.SPAWN_POSITIONS[spawnIndex];
    
    // Move player to spawn
    if (gameState.player.entity) {
        gameState.player.entity.SetPosition(spawnPosition);
    }
    
    // Hide respawn message
    if (gameState.hud.respawnMessage) {
        gameState.hud.respawnMessage.SetVisibility(false);
    }
    
    // Update HUD
    updateHUD();
    
    // Broadcast respawn
    broadcastPlayerAction("respawn", {
        position: spawnPosition
    });
    
    Logging.Log("[FPS Arena] Player respawned at: " + spawnPosition.toString());
}

/**
 * Show respawn countdown
 */
function showRespawnCountdown() {
    if (!gameState.hud.respawnMessage) return;
    
    gameState.hud.respawnMessage.SetVisibility(true);
    
    var countdown = Math.ceil(GAME_CONFIG.RESPAWN_DELAY);
    var updateCountdown = function() {
        if (countdown > 0) {
            gameState.hud.respawnMessage.SetText("ELIMINATED! Respawning in " + countdown + "...");
            countdown--;
            Scripting.ScheduleExecution("(" + updateCountdown.toString() + ")()", 1000);
        }
    };
    
    updateCountdown();
}

// ============================================================================
// HUD UPDATES
// ============================================================================

/**
 * Update all HUD elements
 */
function updateHUD() {
    updateHealthDisplay();
    updateAmmoDisplay(); 
    updateScoreDisplay();
}

/**
 * Update health display
 */
function updateHealthDisplay() {
    if (gameState.hud.healthText) {
        gameState.hud.healthText.SetText("Health: " + gameState.player.health);
    }
    
    if (gameState.hud.healthFill) {
        // Scale health bar based on current health percentage
        var healthPercent = gameState.player.health / GAME_CONFIG.MAX_HEALTH;
        var scale = new Vector3(healthPercent, 1, 1);
        gameState.hud.healthFill.SetScale(scale);
    }
}

/**
 * Update ammo display
 */
function updateAmmoDisplay() {
    if (gameState.hud.ammoText) {
        gameState.hud.ammoText.SetText(gameState.player.ammo + " / " + gameState.player.maxAmmo);
    }
}

/**
 * Update score display
 */
function updateScoreDisplay() {
    if (gameState.hud.scoreText) {
        gameState.hud.scoreText.SetText("Eliminations: " + gameState.player.eliminations);
    }
}

// ============================================================================
// MULTIPLAYER NETWORKING
// ============================================================================

/**
 * VOS connection established callback
 */
function onVOSConnected() {
    Logging.Log("[FPS Arena] Connected to VOS service");
    gameState.multiplayer.isConnected = true;
}

/**
 * VOS session joined callback
 */
function onVOSSessionJoined() {
    Logging.Log("[FPS Arena] Joined multiplayer session: " + VOS_CONFIG.session.id);
    
    // Start sending position updates
    startNetworkUpdates();
    
    // Broadcast player joined
    broadcastPlayerAction("joined", {
        playerId: LocalStorage.GetItem("playerId"),
        position: gameState.player.entity ? gameState.player.entity.GetPosition() : Vector3.zero
    });
}

/**
 * Handle incoming VOS messages
 */
function onVOSMessage(message) {
    try {
        var data = JSON.parse(message);
        handlePlayerAction(data);
    } catch (error) {
        Logging.LogError("[FPS Arena] Error parsing VOS message: " + error);
    }
}

/**
 * Broadcast player action to other players
 */
function broadcastPlayerAction(action, data) {
    if (!gameState.multiplayer.vos || !gameState.multiplayer.isConnected) {
        return;
    }
    
    var message = {
        playerId: LocalStorage.GetItem("playerId"),
        action: action,
        data: data,
        timestamp: Date.now()
    };
    
    try {
        gameState.multiplayer.vos.SendMessage("player-action", JSON.stringify(message));
    } catch (error) {
        Logging.LogError("[FPS Arena] Error broadcasting action: " + error);
    }
}

/**
 * Handle incoming player actions from network
 */
function handlePlayerAction(message) {
    var playerId = message.playerId;
    var action = message.action;
    var data = message.data;
    
    // Ignore our own messages
    if (playerId === LocalStorage.GetItem("playerId")) {
        return;
    }
    
    switch (action) {
        case "joined":
            handlePlayerJoined(playerId, data);
            break;
            
        case "position":
            handlePlayerPosition(playerId, data);
            break;
            
        case "damage":
            handlePlayerDamage(data);
            break;
            
        case "elimination":
            handlePlayerElimination(data);
            break;
            
        case "respawn":
            handlePlayerRespawn(playerId, data);
            break;
            
        case "shoot":
            handlePlayerShoot(playerId, data);
            break;
            
        case "left":
            handlePlayerLeft(playerId);
            break;
    }
}

/**
 * Handle new player joining
 */
function handlePlayerJoined(playerId, data) {
    Logging.Log("[FPS Arena] Player joined: " + playerId);
    
    // Create visual representation for new player
    // USER MODEL PLACEHOLDER: This creates other players using your player model
    var playerEntity = new MeshEntity(
        World,
        ASSET_URLS.PLAYER_MODEL,
        data.position || Vector3.zero,
        Quaternion.identity,
        Vector3.one,
        null,
        "player-" + playerId
    );
    
    if (playerEntity) {
        playerEntity.SetVisibility(true);
        playerEntity.SetInteractionState(InteractionState.Static);
        
        gameState.multiplayer.players[playerId] = {
            entity: playerEntity,
            health: GAME_CONFIG.MAX_HEALTH,
            eliminations: 0
        };
    }
}

/**
 * Handle player position update
 */
function handlePlayerPosition(playerId, data) {
    var player = gameState.multiplayer.players[playerId];
    if (player && player.entity && data.position) {
        player.entity.SetPosition(data.position);
        if (data.rotation) {
            player.entity.SetRotation(data.rotation);
        }
    }
}

/**
 * Handle damage dealt to local player
 */
function handlePlayerDamage(data) {
    if (data.targetPlayerId === LocalStorage.GetItem("playerId")) {
        takeDamage(data.damage, data.shooterPlayerId);
    }
}

/**
 * Handle player elimination
 */
function handlePlayerElimination(data) {
    // Award point to shooter
    if (data.shooterPlayerId === LocalStorage.GetItem("playerId")) {
        gameState.player.eliminations++;
        updateScoreDisplay();
        Logging.Log("[FPS Arena] You eliminated " + data.eliminatedPlayerId + "!");
    }
}

/**
 * Handle player respawn
 */
function handlePlayerRespawn(playerId, data) {
    var player = gameState.multiplayer.players[playerId];
    if (player && player.entity && data.position) {
        player.entity.SetPosition(data.position);
        player.health = GAME_CONFIG.MAX_HEALTH;
        Logging.Log("[FPS Arena] Player " + playerId + " respawned");
    }
}

/**
 * Handle player shooting
 */
function handlePlayerShoot(playerId, data) {
    // Visual feedback for other player shooting
    Logging.Log("[FPS Arena] Player " + playerId + " fired weapon");
    // Could add muzzle flash or sound effect here
}

/**
 * Handle player leaving
 */
function handlePlayerLeft(playerId) {
    Logging.Log("[FPS Arena] Player left: " + playerId);
    
    var player = gameState.multiplayer.players[playerId];
    if (player && player.entity) {
        player.entity.Delete();
        delete gameState.multiplayer.players[playerId];
    }
}

/**
 * Start regular network updates
 */
function startNetworkUpdates() {
    // Send position updates regularly
    function sendPositionUpdate() {
        if (gameState.player.entity && gameState.player.isAlive) {
            broadcastPlayerAction("position", {
                position: gameState.player.entity.GetPosition(),
                rotation: gameState.player.entity.GetRotation()
            });
        }
        
        // Schedule next update
        Scripting.ScheduleExecution("sendPositionUpdate();", GAME_CONFIG.UPDATE_RATE);
    }
    
    // Make function available globally
    window.sendPositionUpdate = sendPositionUpdate;
    sendPositionUpdate();
}

// ============================================================================
// GAME LOOP
// ============================================================================

/**
 * Start the main game loop
 */
function startGameLoop() {
    function gameLoop() {
        updatePlayer();
        updateCamera();
        
        // Schedule next frame
        Scripting.ScheduleExecution("gameLoop();", 16); // ~60 FPS
    }
    
    // Make function available globally  
    window.gameLoop = gameLoop;
    gameLoop();
}

/**
 * Update player movement and actions
 */
function updatePlayer() {
    if (!gameState.player.entity || !gameState.player.isAlive) return;
    
    // Apply movement
    if (gameState.input.movement.magnitude > 0) {
        var currentPos = gameState.player.entity.GetPosition();
        var newPos = Vector3.Add(currentPos, Vector3.Scale(gameState.input.movement, Time.deltaTime || 0.016));
        gameState.player.entity.SetPosition(newPos);
    }
}

/**
 * Update camera based on input
 */
function updateCamera() {
    if (!gameState.player.isAlive) return;
    
    // Apply mouse look
    if (gameState.input.looking) {
        // Apply camera rotation based on mouse input
        // This is simplified - actual implementation would depend on Camera API
        var currentRot = Camera.GetRotation();
        // Apply rotation changes based on gameState.input.mouseX and mouseY
    }
}

// ============================================================================
// INITIALIZATION ENTRY POINT
// ============================================================================

// Initialize the game when the world loads
if (World.GetWorldLoadState() === "loadedworld") {
    initializeFPSArena();
} else {
    // Wait for world to load
    Scripting.ScheduleExecution("if (World.GetWorldLoadState() === 'loadedworld') { initializeFPSArena(); }", 100);
}

// Make key functions available globally for VEML input events
window.OnMove = OnMove;
window.OnEndMove = OnEndMove;
window.OnLook = OnLook;
window.OnEndLook = OnEndLook;
window.OnKeyPress = OnKeyPress;
window.OnKeyRelease = OnKeyRelease;
window.OnShoot = OnShoot;
window.respawnPlayer = respawnPlayer;