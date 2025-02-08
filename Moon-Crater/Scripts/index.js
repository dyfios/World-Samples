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
    id: "078b768c-164f-4e4e-9ecf-367fb824a738",
    tag: "MoonCrater"
};

gravityEnabled = true;

let world = new StaticWorld(webSynchronizationParams, focusedSynchronizationParams, sessionInfo, gravityEnabled);
world.AddMeshEntity(null, "https://webverse-samples.s3.amazonaws.com/Models/PetaviusCrater/moon_-_petavius_crater_largetex.glb",
    new Vector3(0, -17, 0), Quaternion.identity, new Vector3(1000, 1000, 1000), "Environment");
world.AddDirectionalLightEntity(null, new Vector3(0, 75, 0), new Quaternion(0.4177, -0.2506, 0, 0.8733), "Light");
world.SetSkyTexture("Images/TychoSkymapII.t3_04096x02048.png");