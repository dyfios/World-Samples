# City Driving Simulation

A comprehensive multiplayer city driving simulation world for the WebVerse platform. Experience realistic vehicle controls, AI traffic, and multiplayer interaction in a virtual city environment.

## Features

### Core Gameplay
- **Realistic Vehicle Physics**: Acceleration, braking, steering with momentum and inertia
- **Multiplayer Support**: Drive with other players in real-time using VOS synchronization
- **Vehicle Controls**: WASD/Arrow keys for driving, Space for braking, R for reset
- **Auto-Respawn System**: Automatic vehicle reset when stuck for more than 5 seconds
- **HUD Interface**: Speed display, controls help, and status indicators

### Traffic System (Optional Enhancement)
- **AI Traffic Vehicles**: Autonomous cars following predefined routes
- **Traffic Lights**: Functional traffic lights at major intersections  
- **Traffic Rules**: AI vehicles obey lights and maintain following distances
- **Dynamic Traffic Flow**: Realistic city traffic simulation

### Multiplayer Features
- **VOS Synchronization**: Real-time position and state sharing
- **Session Management**: Unique session IDs for world instances
- **Cross-Platform**: Works on desktop, mobile, and VR platforms

## Installation & Setup

1. **Copy World Files**: Place the `City-Driving-Simulation` folder in your World-Samples directory
2. **Configure Assets**: Replace placeholder assets with your 3D models and textures (see Asset Integration below)
3. **Test Connection**: Ensure access to `mqtt.webverse.info` for multiplayer functionality
4. **Load World**: Open `index.veml` in your WebVerse-compatible browser

## Controls

### Desktop Controls
- **W / Up Arrow**: Accelerate forward
- **S / Down Arrow**: Reverse/Brake
- **A / Left Arrow**: Steer left
- **D / Right Arrow**: Steer right
- **Space**: Emergency brake
- **R**: Reset/Respawn vehicle
- **E**: Toggle engine on/off

### VR Controls
- **Left Touchpad**: Acceleration/Deceleration
- **Right Touchpad**: Steering
- **Hand Gestures**: Vehicle interaction (when implemented)

### Mobile Controls
- **Touch Controls**: On-screen virtual joysticks for driving
- **Gesture Support**: Tilt steering (planned feature)

## Asset Integration Guide

To fully customize this driving simulation, replace the placeholder assets with your own models and textures:

### 3D Models (GLB/GLTF Format)

#### Required City Environment
```
Models/city-environment.glb
```
- **Description**: Complete city model with roads, buildings, and intersections
- **Scale**: 1 unit = 1 meter in world space
- **Origin**: Main intersection center at (0,0,0)
- **Requirements**: Roads wide enough for vehicles, clear lane markings
- **Polygon Count**: <100k triangles recommended for performance

#### Player Vehicle
```
Models/player-car.glb
```
- **Description**: Player's controllable vehicle
- **Scale**: Approximately 2x1x4 units (width x height x length)
- **Origin**: Center bottom of vehicle
- **Forward Direction**: +Z axis
- **Features**: Car body, wheels, windows, optional interior

#### AI Traffic Vehicles
```
Models/car-sedan.glb
Models/car-suv.glb  
Models/car-hatchback.glb
Models/truck-small.glb
Models/city-bus.glb
```
- **Description**: Variety of AI traffic vehicles
- **Scale**: Similar to player vehicle
- **Requirements**: Diverse styles for realistic traffic

#### Traffic Infrastructure
```
Models/traffic-light-complete.glb
Models/street-lamp.glb
Models/road-signs/stop-sign.glb
Models/road-signs/speed-limit.glb
```
- **Description**: Traffic control and street furniture
- **Scale**: Real-world proportions
- **Features**: Separate materials for light states (red/yellow/green)

### Textures (PNG/JPG Format)

#### Environment Textures
```
Images/city-sky-day.png
```
- **Description**: 360-degree panoramic sky texture
- **Resolution**: 2048x1024 minimum
- **Format**: PNG or HDR for realistic lighting
- **Variations**: Consider morning, noon, evening, night versions

#### HUD Elements
```
Images/speedometer.png
Images/minimap-bg.png
Images/dashboard.png
```
- **Description**: Vehicle dashboard and UI elements
- **Resolution**: 512x512 for gauges, 256x256 for icons
- **Format**: PNG with transparent backgrounds
- **Style**: Match your vehicle's aesthetic

### Audio Assets (Optional)
```
Sounds/engine-idle.wav
Sounds/engine-rev.wav
Sounds/brake.wav
Sounds/horn.wav
Sounds/traffic-ambient.wav
```
- **Description**: Vehicle and environmental audio
- **Format**: WAV or MP3
- **Quality**: 44.1kHz, 16-bit minimum

## Code Structure

### Core Scripts

#### `Scripts/index.js`
- Main world initialization and coordination
- Environment setup and asset loading
- Multiplayer configuration
- Performance monitoring

#### `Scripts/vehicle-controller.js`
- Vehicle physics and movement logic
- Input handling for all control methods
- Respawn system for stuck vehicles
- HUD interface management
- Multiplayer synchronization

#### `Scripts/traffic-system.js`
- AI traffic vehicle management
- Traffic light control system
- Route-based AI navigation
- Traffic rule enforcement

### Configuration Files

#### `index.veml`
- World metadata and script loading
- Input event mapping
- VR and control flag configuration
- Environment background settings

## Customization Guide

### Adding New Vehicle Types

1. **Create Vehicle Model**: Design GLB/GLTF model following scale guidelines
2. **Update Vehicle Controller**: Modify physics parameters in `VehicleController` class
3. **Add Model Loading**: Update `SetupPlayerVehicle()` function in `index.js`
4. **Test Performance**: Ensure model complexity doesn't impact framerate

### Expanding the City

1. **Design City Layout**: Plan road network and building placement
2. **Create Modular Assets**: Build roads, intersections, and buildings separately
3. **Update Environment Loading**: Modify `SetupCityEnvironment()` function
4. **Add Traffic Routes**: Define new paths in `TrafficSystem.trafficRoutes`

### Enhancing Traffic System

1. **Add Vehicle Variety**: Create diverse AI vehicle models
2. **Implement Traffic Signals**: Connect traffic lights to route logic
3. **Add Emergency Vehicles**: Special AI with different behaviors
4. **Pedestrian System**: Add walking NPCs with crosswalk behavior

### Multiplayer Enhancements

1. **Voice Chat**: Integrate WebRTC voice communication
2. **Player Identification**: Add nameplates above vehicles
3. **Collision System**: Implement vehicle-to-vehicle collision
4. **Racing Modes**: Add checkpoints and timing systems

## Performance Optimization

### Recommended Settings
- **Max AI Vehicles**: 5-10 for good performance
- **Update Frequencies**: Vehicle 60fps, Traffic 30fps
- **LOD System**: Use level-of-detail for distant objects
- **Texture Streaming**: Load textures based on distance

### Troubleshooting

#### Common Issues
1. **Vehicles Not Moving**: Check input event mapping in VEML
2. **Poor Performance**: Reduce AI vehicle count or model complexity
3. **Multiplayer Sync Issues**: Verify MQTT server connectivity
4. **Missing Assets**: Check file paths and asset loading logs

#### Debug Information
- Enable console logging with `Logging.Log()` statements
- Monitor vehicle state through HUD displays
- Check network connectivity for multiplayer features

## Technical Specifications

### System Requirements
- **WebVerse-compatible browser**: Chrome, Firefox, Safari (latest versions)
- **Network Connection**: Required for multiplayer functionality
- **Hardware**: Modern GPU recommended for 3D rendering
- **RAM**: 4GB minimum, 8GB recommended for large cities

### Browser Compatibility
- **Desktop**: Chrome 80+, Firefox 75+, Safari 13+
- **Mobile**: Chrome Mobile 80+, Safari Mobile 13+
- **VR**: WebXR-compatible browsers and headsets

### Network Requirements
- **MQTT Access**: Connection to `mqtt.webverse.info`
- **Bandwidth**: 1 Mbps minimum for multiplayer
- **Latency**: <200ms recommended for smooth interaction

## Development Notes

### Future Enhancements
- **Weather System**: Rain, fog, day/night cycle effects
- **Vehicle Customization**: Color changes, decals, upgrades
- **Economy System**: Fuel, maintenance, vehicle purchasing
- **Mini-Games**: Parking challenges, delivery missions
- **Social Features**: Friends list, private sessions

### Known Limitations
- **Traffic AI**: Basic pathfinding, may occasionally get stuck
- **Physics**: Simplified vehicle physics for performance
- **Asset Loading**: Placeholder URLs need replacement with real assets
- **Mobile Performance**: May require reduced settings on older devices

## Contributing

When contributing improvements:
1. **Maintain Performance**: Test with multiple vehicles and players
2. **Follow Patterns**: Use existing code structure and commenting style
3. **Document Changes**: Update this README with new features
4. **Test Multiplayer**: Verify synchronization works correctly

## License

This world example follows the same license as the World-Samples repository. See the main repository LICENSE file for details.

---

**Ready to Drive!** 🚗💨

Replace the placeholder assets with your custom models and textures, then experience realistic city driving with friends in your personalized virtual world!