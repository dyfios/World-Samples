# FPS Arena - Multiplayer First Person Shooter

A synchronized multiplayer first person shooter experience with real-time combat, health tracking, and respawn mechanics.

## Features

- **Multiplayer Synchronization**: Real-time player position and action sync using VOS
- **First Person Controls**: WASD movement, mouse look, spacebar jump
- **Combat System**: Left-click shooting with raycast hit detection
- **Health System**: Visual health bar, damage tracking, respawn on death
- **Scoring System**: Kill counter with multiplayer leaderboard
- **HUD Interface**: Health bar, weapon indicator, score display

## Controls

- **Movement**: WASD keys
- **Look**: Mouse movement
- **Jump**: Spacebar
- **Shoot**: Left mouse button
- **Reload**: R key (visual indicator only)

## Game Mechanics

- Players spawn with 100 health
- Each successful hit deals 25 damage (4 hits to eliminate)
- When eliminated, player respawns at origin with full health
- Eliminating a player awards 1 point to the shooter
- Real-time score tracking across all players

## 3D Model Requirements

Replace the placeholder URLs in `Scripts/fps-arena.js` with your own models:

### Player Character Model
- **File**: `PLAYER_MODEL_URL` (line ~45)
- **Format**: .gltf or .glb
- **Requirements**: Humanoid character, properly rigged for animation
- **Suggested Scale**: 1.8 units tall (average human height)

### Weapon Models
- **Primary Weapon**: `WEAPON_MODEL_URL` (line ~50)
- **Format**: .gltf or .glb
- **Requirements**: Weapon model oriented properly for first-person view
- **Suggested Scale**: Scaled to fit in player hands

### Arena Environment
- **File**: `ARENA_MODEL_URL` (line ~55)
- **Format**: .gltf or .glb
- **Requirements**: 
  - Arena/battlefield layout with cover elements
  - Ground plane at Y=0
  - Spawn areas clearly defined
  - Suggested size: 50x50 units

### HUD Assets
Replace the following in the Images directory:
- **Health Bar**: `Images/health-bar.png`
- **Weapon Icons**: `Images/weapon-rifle.png`
- **Crosshair**: `Images/crosshair.png`
- **Background**: `Images/arena-sky.png`

## Setup Instructions

1. Replace all placeholder model URLs with your actual 3D models
2. Add HUD image assets to the Images directory
3. Configure VOS server settings in `Scripts/fps-arena.js` (lines 1-12)
4. Test in both desktop and VR modes
5. Adjust damage values and respawn timer as needed

## Technical Notes

- Uses VOS (Virtual Operating System) for multiplayer synchronization
- Canvas-based HUD with percentage positioning for responsive design
- Raycast-based shooting system with collision detection
- Efficient network updates (10 updates per second for position)
- State management for health, ammo, and scores