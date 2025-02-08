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
    id: "90eda5f0-259a-433e-a066-de8164da3eda",
    tag: "EiffelTower"
};

gravityEnabled = true;

let world = new StaticWorld(webSynchronizationParams, focusedSynchronizationParams, sessionInfo, gravityEnabled);
world.AddMeshEntity(null, "https://webverse-samples.s3.amazonaws.com/Models/EiffelTower/eiffel_tower_paris_france_largetex.glb",
    new Vector3(-79, -53, -1239), Quaternion.identity, new Vector3(100, 100, 100), "Environment");
world.AddDirectionalLightEntity(null, new Vector3(0, 75, 0), new Quaternion(0.4177, -0.2506, 0, 0.8733), "Light");
world.SetSkyTexture("Images/night.png");