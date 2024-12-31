const WEBGLSYNCHRONIZATIONPARAMS = {
    HOST: "mqtt.webverse.info",
    PORT: 15526,
    TLS: true,
    TRANSPORT: "websocket"
};

const FOCUSEDSYNCHRONIZATIONPARAMS = {
    HOST: "mqtt.webverse.info",
    PORT: 15525,
    TLS: false,
    TRANSPORT: "tcp"
};

const SESSIONINFO = {
    id: "dbf95ca1-1620-4d8e-b668-2773678b6988",
    tag: "CraterCity"
};

let characterSynchronized = false;
let characterLoaded = false;
let sessionJoined = false;
let userName = null;
let interfaceMode = null;
let runtimeMode = null;

HandleQueryParams();

SetTouchControls();

let vosSynchronizer = null;
if (runtimeMode === "webgl") {
    vosSynchronizer = new VOSSynchronizer(WEBGLSYNCHRONIZATIONPARAMS.HOST, WEBGLSYNCHRONIZATIONPARAMS.PORT,
        WEBGLSYNCHRONIZATIONPARAMS.TLS, WEBGLSYNCHRONIZATIONPARAMS.TRANSPORT, SESSIONINFO, OnConnect, OnJoinSession);
}
else if (runtimeMode === "focused") {
    vosSynchronizer = new VOSSynchronizer(FOCUSEDSYNCHRONIZATIONPARAMS.HOST, FOCUSEDSYNCHRONIZATIONPARAMS.PORT,
        FOCUSEDSYNCHRONIZATIONPARAMS.TLS, FOCUSEDSYNCHRONIZATIONPARAMS.TRANSPORT, SESSIONINFO, OnConnect, OnJoinSession);
}
let thirdPersonCharacter = new ThirdPersonCharacter(userName, null, -90, 90, 1, 0.1, new Vector3(0, 0, 0), OnCharacterLoaded, interfaceMode);
vosSynchronizer.Connect();

Time.SetInterval(`
    if (!characterSynchronized) {
        if (characterLoaded && sessionJoined) {
            vosSynchronizer.AddEntity(thirdPersonCharacter.characterEntityID, true);
            sessionJoined = true;
            characterSynchronized = true;
        }
    }
`, 0.1);

function HandleQueryParams() {
    userName = World.GetQueryParam("USER_NAME");
    interfaceMode = World.GetQueryParam("IF_MODE");
    if (interfaceMode === "desktop") {
        
    }
    else if (interfaceMode === "vr") {
        
    }
    else if (interfaceMode === "mobile") {
        
    }
    else {
        Logging.Log("Interface Mode not set or invalid. Defaulting to desktop.");
        interfaceMode = "desktop";
    }
    runtimeMode = World.GetQueryParam("RT_MODE");
    if (runtimeMode === "webgl") {
        
    }
    else if (runtimeMode === "focused") {
        
    }
    else {
        Logging.Log("Runtime Mode not set or invalid. Defaulting to webgl.");
        runtimeMode = "webgl";
    }
}

function SetTouchControls() {
    var upControlEntity = Entity.GetByTag("Up");
    if (upControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Up.");
        return;
    }

    var downControlEntity = Entity.GetByTag("Down");
    if (downControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Down.");
        return;
    }
    
    var leftControlEntity = Entity.GetByTag("Left");
    if (leftControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Left.");
        return;
    }

    var rightControlEntity = Entity.GetByTag("Right");
    if (rightControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Right.");
        return;
    }

    var jumpControlEntity = Entity.GetByTag("Jump");
    if (jumpControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Jump.");
        return;
    }

    var dropControlEntity = Entity.GetByTag("Drop");
    if (dropControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Drop.");
        return;
    }

    if (interfaceMode === "mobile") {
        upControlEntity.SetVisibility(true);
    }
    else {
        upControlEntity.SetVisibility(false);
    }
    
    if (interfaceMode === "mobile") {
        downControlEntity.SetVisibility(true);
    }
    else {
        downControlEntity.SetVisibility(false);
    }

    if (interfaceMode === "mobile") {
        leftControlEntity.SetVisibility(true);
    }
    else {
        leftControlEntity.SetVisibility(false);
    }

    if (interfaceMode === "mobile") {
        rightControlEntity.SetVisibility(true);
    }
    else {
        rightControlEntity.SetVisibility(false);
    }

    if (interfaceMode === "mobile") {
        jumpControlEntity.SetVisibility(true);
    }
    else {
        jumpControlEntity.SetVisibility(false);
    }

    if (interfaceMode === "mobile") {
        dropControlEntity.SetVisibility(true);
    }
    else {
        dropControlEntity.SetVisibility(false);
    }
}

function ToggleView() {
    var currentView = WorldStorage.GetItem("VIEW-MODE");
    if (currentView == null) {
        currentView = 0;
    }
    else if (currentView == 0) {
        currentView = 1;
    }
    else if (currentView == 1) {
        currentView = 0;
    }
    else {
        currentView = 1;
    }
    WorldStorage.SetItem("VIEW-MODE", currentView);

    var buttonText = Entity.GetByTag("ViewText");
    if (buttonText != null) {
        if (currentView == 0) {
            buttonText.SetText("Mode: Surface");
            thirdPersonCharacter.SetMotionModePhysical();
        }
        else if (currentView == 1) {
            buttonText.SetText("Mode: Free Fly");
            thirdPersonCharacter.SetMotionModeFree();
        }
    }
}

function OnConnect() {
    
}

function OnJoinSession() {
    sessionJoined = true;
}

function OnCharacterLoaded() {
    characterLoaded = true;
}

ToggleView();