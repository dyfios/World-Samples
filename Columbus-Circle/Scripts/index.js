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
    id: "7f9f8c8e-0aac-4fbc-99fe-00d4a654f8a9",
    tag: "ColumbusCircle"
};

gravityEnabled = false;

let world = new StaticWorld(webSynchronizationParams, focusedSynchronizationParams, sessionInfo, gravityEnabled);
world.AddMeshEntity(null, "https://webverse-samples.s3.amazonaws.com/Models/Columbus-Circle/model-0-0-decimated.glb",
    new Vector3(500, -25, -500), Quaternion.identity, Vector3.one, "Environment");
world.AddMeshEntity(null, "https://webverse-samples.s3.amazonaws.com/Models/Columbus-Circle/model-0-1-decimated.glb",
        new Vector3(500, -25, -500), Quaternion.identity, Vector3.one, "Environment");
world.AddDirectionalLightEntity(null, new Vector3(0, 75, 0), new Quaternion(0.4177, -0.2506, 0, 0.8733), "Light");
world.SetSkyTexture("Images/night.png");