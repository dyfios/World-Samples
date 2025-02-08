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
    id: "2e39fbfd-6908-4336-adce-0124f4082b8f",
    tag: "MarsBase"
};

gravityEnabled = true;

let world = new StaticWorld(webSynchronizationParams, focusedSynchronizationParams, sessionInfo, gravityEnabled);
world.AddMeshEntity(null, "https://webverse-samples.s3.amazonaws.com/Models/MarsOneBase/mars_one_mission_-_base_largetex.glb",
    new Vector3(0, 0, 0), Quaternion.identity, Vector3.one, "Environment");
//world.AddDirectionalLightEntity(null, new Vector3(0, 0, 0), new Quaternion(0.4177, -0.2506, 0, 0.8733), "Light");