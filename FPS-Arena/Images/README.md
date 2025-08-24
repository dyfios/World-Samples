# FPS Arena - Image Assets Directory

This directory contains placeholder image assets for the FPS Arena HUD. Replace these with your actual game assets.

## Required HUD Assets

### Health Bar Assets
- **health-bar-bg.png** - Background/border for health bar (dark frame)
- **health-bar-fill.png** - Health bar fill (green to red gradient)

### Weapon Assets  
- **weapon-rifle.png** - Primary weapon icon (rifle silhouette)
- **crosshair.png** - Targeting crosshair (simple cross design)

### Environment Assets
- **arena-sky.png** - Arena background/skybox texture

## Asset Specifications

All images should be:
- **Format**: PNG with transparency support
- **Quality**: High resolution for crisp display
- **Style**: Consistent with your game's visual theme

### Recommended Sizes
- Health bar assets: 256x64 pixels
- Weapon icons: 128x128 pixels  
- Crosshair: 64x64 pixels
- Arena sky: 2048x1024 pixels (skybox format)

## Usage

These assets are referenced in:
1. **index.veml** - HUD element definitions
2. **Scripts/fps-arena.js** - ASSET_URLS configuration

Update the file paths in both locations when you add your custom assets.