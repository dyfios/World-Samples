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
    id: "8b14a73e-de5e-4b52-9a36-1359a8d4533b",
    tag: "SpaceStation2"
};

gravityEnabled = false;

let world = new StaticWorld(webSynchronizationParams, focusedSynchronizationParams, sessionInfo, gravityEnabled);
world.AddMeshEntity(null, "https://webverse-samples.s3.amazonaws.com/Models/SpaceStationScene6/space_station_scene_wip_6_test_largetex.glb",
    new Vector3(-79, -0.5, 279), Quaternion.identity, Vector3.one, "Environment");
world.AddDirectionalLightEntity(null, new Vector3(0, 75, 0), new Quaternion(0.4177, -0.2506, 0, 0.8733), "Light");
world.SetSkyTexture("Images/TychoSkymapII.t3_04096x02048.png");