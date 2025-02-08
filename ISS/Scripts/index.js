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
    id: "603d55d4-6b59-4330-8223-ddbf8f67f7f8",
    tag: "ISS"
};

gravityEnabled = false;

let world = new StaticWorld(webSynchronizationParams, focusedSynchronizationParams, sessionInfo, gravityEnabled);
world.AddMeshEntity(null, "https://webverse-samples.s3.amazonaws.com/Models/InternationalSpaceStation/space_station.glb",
    new Vector3(-139, 0, 0), Quaternion.identity, new Vector3(100, 100, 100), "Environment");
world.AddDirectionalLightEntity(null, new Vector3(-939, 0, 0), new Quaternion(0.4177, -0.2506, 0, 0.8733), "Light");
world.SetSkyTexture("Images/TychoSkymapII.t3_04096x02048.png");