const webSynchronizationParams = {
    host: "mqtt.webverse.info",
    port: 15526,
    tls: true,
    transport: "websocket"
};

const focusedSynchronizationParams = {
    host: "mqtt.webverse.info",
    port: 15525,
    tls: false,
    transport: "tcp"
};

const sessionInfo = {
    id: "ba8e3de0-4a5d-4ca8-9841-ae78fb12e0a4",
    tag: "test"
};

gravityEnabled = true;

let world = new StaticWorld(webSynchronizationParams, focusedSynchronizationParams, sessionInfo, gravityEnabled);
world.AddMeshEntity(null, "https://webverse-samples.s3.amazonaws.com/Models/Simple-Meshes-Scene/test.glb",
    new Vector3(0, 0, 0), Quaternion.identity, Vector3.one, "Environment");
world.AddDirectionalLightEntity(null, new Vector3(0, 75, 0), new Quaternion(0.4177, -0.2506, 0, 0.8733), "Light");
world.SetSkyTexture("Images/night.png");