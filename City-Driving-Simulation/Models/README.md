# 3D Model Assets Directory

This directory should contain all 3D models for the City Driving Simulation world.

## Required Model Files

Place your GLB/GLTF model files here with the following names:

### Core Environment
- `city-environment.glb` - Main city model with roads, buildings, and intersections
- `road-straight.glb` - Straight road segment (optional, for modular approach)
- `road-curve.glb` - Curved road segment (optional)
- `road-intersection.glb` - 4-way intersection (optional)

### Vehicles
- `player-car.glb` - Main player vehicle
- `car-sedan.glb` - AI traffic sedan
- `car-suv.glb` - AI traffic SUV
- `car-hatchback.glb` - AI traffic hatchback
- `truck-small.glb` - AI traffic small truck
- `city-bus.glb` - AI traffic bus

### Infrastructure
- `traffic-light-complete.glb` - Complete traffic light assembly
- `street-lamp.glb` - Street lighting
- `building-residential.glb` - Residential building (optional)
- `building-commercial.glb` - Commercial building (optional)
- `building-skyscraper.glb` - Skyscraper (optional)

### Props and Details
- `stop-sign.glb` - Stop sign
- `speed-limit.glb` - Speed limit sign
- `bench.glb` - Street bench
- `trash-can.glb` - Trash receptacle
- `fire-hydrant.glb` - Fire hydrant

## Model Requirements

### Format
- Use GLB (preferred) or GLTF format
- Include all textures and materials in the GLB file

### Scale
- 1 unit = 1 meter in world space
- Vehicle dimensions: approximately 2x1x4 units (width x height x length)
- Building heights: realistic proportions

### Optimization
- Keep polygon count reasonable (<10k per vehicle, <50k for buildings)
- Use texture atlasing when possible
- Optimize for real-time rendering

### Coordinate System
- Forward direction: +Z axis
- Up direction: +Y axis
- Right direction: +X axis

## Placeholder Models

Until you provide your own models, the simulation will use:
- Basic geometric shapes or
- Links to existing web-hosted models (which may not work in all environments)

Replace these placeholders with your custom models for the best experience.

## Testing Your Models

1. Load each model individually to check scale and orientation
2. Test vehicle models for proper physics collision
3. Verify that buildings don't interfere with traffic routes
4. Check texture quality and lighting behavior

For detailed integration instructions, see the main README.md file and comments in the script files.