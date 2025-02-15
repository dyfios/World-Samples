function FinishLoadingMeshEntity(meshEntity) {
    var staticWorldContext = Context.GetContext("STATICWORLDCONTEXT");
    meshEntity.SetVisibility(true);
    meshEntity.SetInteractionState(InteractionState.Static);
    meshEntity.tag = staticWorldContext.meshEntityTags[meshEntity.id.ToString()];
    meshEntity.SetScale(staticWorldContext.meshEntityScales[meshEntity.id.ToString()]);
}

function FinishLoadingDirectionalLightEntity(lightEntity) {
    lightEntity.SetVisibility(true);
    lightEntity.SetInteractionState(InteractionState.Static);
    lightEntity.SetLightType(LightType.Directional);
}

function FinishLoadingControlsCanvas(controlsCanvasEntity) {
    controlsCanvasEntity.MakeScreenCanvas();
    controlsCanvasEntity.SetVisibility(true);
    controlsCanvasEntity.SetInteractionState(InteractionState.Static);
}

function FinishLoadingControlsButton(controlsButtonEntity) {
    controlsButtonEntity.SetVisibility(true);
    controlsButtonEntity.SetInteractionState(InteractionState.Static);
}

function FinishLoadingControlsButtonImage(controlsButtonImageEntity) {
    controlsButtonImageEntity.SetVisibility(true);
    controlsButtonImageEntity.SetInteractionState(InteractionState.Static);
}

function FinishLoadingControlsButtonText(controlsButtonTextEntity) {
    controlsButtonTextEntity.SetVisibility(true);
    controlsButtonTextEntity.SetInteractionState(InteractionState.Static);
}

function ToggleView() {
    var context = Context.GetContext("STATICWORLDCONTEXT");

    var currentView = WorldStorage.GetItem("VIEW-MODE");
    if (currentView == null) {
        if (context.gravityEnabled == true) {
            currentView = 0;
        }
        else {
            currentView = 1;
        }
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
            SetMotionModePhysical();
        }
        else if (currentView == 1) {
            buttonText.SetText("Mode: Free Fly");
            SetMotionModeFree();
        }
    }
}

function DecreaseSpeed() {
    speedText = Entity.GetByTag("SpeedText");
    if (speedText == null) {
        Logging.LogError("Unable to get speed text.");
        return;
    }

    speed = parseFloat(speedText.GetText()) / 2;
    if (speed <= 0.25) {
        speed = 0.25
    }
    
    speedText.SetText(speed.toString());
    SetMotionMultiplier(speed);
}

function IncreaseSpeed() {
    speedText = Entity.GetByTag("SpeedText");
    if (speedText == null) {
        Logging.LogError("Unable to get speed text.");
        return;
    }

    speed = parseFloat(speedText.GetText()) * 2;
    if (speed >= 8) {
        speed = 8
    }
    
    speedText.SetText(speed.toString());
    SetMotionMultiplier(speed);
}

class StaticWorld {
    constructor(webSynchronizationParams, focusedSynchronizationParams, sessionInfo, gravityEnabled) {
        this.meshEntityScales = {};
        this.meshEntityTags = {};
        this.vosSynchronizer = null;
        this.characterSynchronized = false;
        this.characterLoaded = false;
        this.sessionJoined = false;
        this.userName = null;
        this.interfaceMode = null;
        this.runtimeMode = null;
        this.gravityEnabled = gravityEnabled;
        Context.DefineContext("STATICWORLDCONTEXT", this);

        HandleQueryParams();

        var context = Context.GetContext("STATICWORLDCONTEXT");

        if (context.runtimeMode === "webgl") {
            context.vosSynchronizer = new VOSSynchronizer(webSynchronizationParams.host, webSynchronizationParams.port,
                webSynchronizationParams.tls, webSynchronizationParams.transport, sessionInfo, OnConnect, OnJoinSession);
        }
        else if (runtimeMode === "focused") {
            context.vosSynchronizer = new VOSSynchronizer(focusedSynchronizationParams.host, focusedSynchronizationParams.port,
                focusedSynchronizationParams.tls, focusedSynchronizationParams.transport, sessionInfo, OnConnect, OnJoinSession);
        }
        context.vosSynchronizer.Connect();

        Context.DefineContext("STATICWORLDCONTEXT", context);

        function HandleQueryParams() {
            var context = Context.GetContext("STATICWORLDCONTEXT");
            context.userName = World.GetQueryParam("USER_NAME");
            context.interfaceMode = World.GetQueryParam("IF_MODE");
            if (context.interfaceMode === "desktop") {
                
            }
            else if (context.interfaceMode === "vr") {
                
            }
            else if (context.interfaceMode === "mobile") {
                
            }
            else {
                Logging.Log("Interface Mode not set or invalid. Defaulting to desktop.");
                context.interfaceMode = "desktop";
            }
            context.runtimeMode = World.GetQueryParam("RT_MODE");
            if (context.runtimeMode === "webgl") {
                
            }
            else if (context.runtimeMode === "focused") {
                
            }
            else {
                Logging.Log("Runtime Mode not set or invalid. Defaulting to webgl.");
                context.runtimeMode = "webgl";
            }
            Context.DefineContext("STATICWORLDCONTEXT", context);
        }

        function OnConnect() {
    
        }
        
        function OnJoinSession() {
            var context = Context.GetContext("STATICWORLDCONTEXT");
            context.thirdPersonCharacter = new ThirdPersonCharacter(context.userName, null,
                -90, 90, 1, 0.1, new Vector3(0, 0, 0), OnCharacterLoaded, context.interfaceMode,
                gravityEnabled);
            context.sessionJoined = true;
            SetUpControls();
            SetTouchControls();
            ToggleView();
            Context.DefineContext("STATICWORLDCONTEXT", context);
        }
        
        function OnCharacterLoaded(id) {
            var context = Context.GetContext("STATICWORLDCONTEXT");

            AddVOSSynchronizationEntity(id, true);

            context.sessionJoined = true;

            context.characterSynchronized = true;

            context.characterLoaded = true;
            Context.DefineContext("STATICWORLDCONTEXT", context);
        }

        function SetUpControls() {
            var context = Context.GetContext("STATICWORLDCONTEXT");
            var controlsCanvasEntity = CanvasEntity.Create(null, Vector3.zero, Quaternion.identity, Vector3.one,
                false, null, "WASDControls", "FinishLoadingControlsCanvas");
            var upButton = ButtonEntity.Create(controlsCanvasEntity, "MoveCharacterOneStep(1, 0);",
                new Vector2(0.17, 0.64), new Vector2(0.1, 0.1), null, "Up", "FinishLoadingControlsButton");
            var upButtonImage = ImageEntity.Create(upButton, "Images/arrow_up.png", new Vector2(0.5, 0.5),
                new Vector2(1, 1), null, "UpImage", "FinishLoadingControlsButtonImage");
            var downButton = ButtonEntity.Create(controlsCanvasEntity, "MoveCharacterOneStep(-1, 0);",
                new Vector2(0.17, 0.88), new Vector2(0.1, 0.1), null, "Down", "FinishLoadingControlsButton");
            var downButtonImage = ImageEntity.Create(downButton, "Images/arrow_down.png", new Vector2(0.5, 0.5),
                new Vector2(1, 1), null, "DownImage", "FinishLoadingControlsButtonImage");
            var leftButton = ButtonEntity.Create(controlsCanvasEntity, "MoveCharacterOneStep(0, 1);",
                new Vector2(0.07, 0.76), new Vector2(0.1, 0.1), null, "Left", "FinishLoadingControlsButton");
            var leftButtonImage = ImageEntity.Create(leftButton, "Images/arrow_left.png", new Vector2(0.5, 0.5),
                new Vector2(1, 1), null, "LeftImage", "FinishLoadingControlsButtonImage");
            var rightButton = ButtonEntity.Create(controlsCanvasEntity, "MoveCharacterOneStep(0, -1);",
                new Vector2(0.27, 0.76), new Vector2(0.1, 0.1), null, "Right", "FinishLoadingControlsButton");
            var rightButtonImage = ImageEntity.Create(rightButton, "Images/arrow_right.png", new Vector2(0.5, 0.5),
                new Vector2(1, 1), null, "RightImage", "FinishLoadingControlsButtonImage");
            var jumpButton = ButtonEntity.Create(controlsCanvasEntity, "LiftCharacterOneStep();",
                new Vector2(0.92, 0.76), new Vector2(0.1, 0.1), null, "Jump", "FinishLoadingControlsButton");
            var jumpButtonText = TextEntity.Create(jumpButton, "Jump", 14, new Vector2(0.5, 0.5),
                new Vector2(1, 1), null, "JumpText", "FinishLoadingControlsButtonText");
            var dropButton = ButtonEntity.Create(controlsCanvasEntity, "DropCharacterOneStep();",
                new Vector2(0.92, 0.88), new Vector2(0.1, 0.1), null, "Drop", "FinishLoadingControlsButton");
            var dropButtonText = TextEntity.Create(dropButton, "Drop", 14, new Vector2(0.5, 0.5),
                new Vector2(1, 1), null, "DropText", "FinishLoadingControlsButtonText");
            var viewButton = ButtonEntity.Create(controlsCanvasEntity, "ToggleView();",
                new Vector2(0.92, 0.15), new Vector2(0.1, 0.1), null, "View", "FinishLoadingControlsButton");
            var viewButtonText = TextEntity.Create(viewButton, "View: unset", 14, new Vector2(0.5, 0.5),
                new Vector2(1, 1), null, "ViewText", "FinishLoadingControlsButtonText");
            var speedLabel = TextEntity.Create(controlsCanvasEntity, "Speed:", 18, new Vector2(0.84, 0.305),
                new Vector2(0.05, 0.05), null, "SpeedLabel", "FinishLoadingControlsButtonText");
            var decreaseSpeedButton = ButtonEntity.Create(controlsCanvasEntity, "DecreaseSpeed();",
                new Vector2(0.88, 0.3), new Vector2(0.025, 0.05), null, "DecreaseSpeed", "FinishLoadingControlsButton");
            var decreaseSpeedButtonText = TextEntity.Create(decreaseSpeedButton, " -", 25, new Vector2(0.5, 0.5),
                new Vector2(1, 1), null, "DecreaseSpeedText", "FinishLoadingControlsButtonText");
            var speedText = TextEntity.Create(controlsCanvasEntity, "1", 20, new Vector2(0.93, 0.3),
                new Vector2(0.05, 0.05), null, "SpeedText", "FinishLoadingControlsButtonText");
            var increaseSpeedButton = ButtonEntity.Create(controlsCanvasEntity, "IncreaseSpeed();",
                new Vector2(0.955, 0.3), new Vector2(0.025, 0.05), null, "IncreaseSpeed", "FinishLoadingControlsButton");
            var increaseSpeedButtonText = TextEntity.Create(increaseSpeedButton, " +", 25, new Vector2(0.5, 0.5),
                new Vector2(1, 1), null, "IncreaseSpeedText", "FinishLoadingControlsButtonText");
        }

        function SetTouchControls() {
            var context = Context.GetContext("STATICWORLDCONTEXT");

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
        
            if (context.interfaceMode === "mobile") {
                upControlEntity.SetVisibility(true);
            }
            else {
                upControlEntity.SetVisibility(false);
            }
            
            if (context.interfaceMode === "mobile") {
                downControlEntity.SetVisibility(true);
            }
            else {
                downControlEntity.SetVisibility(false);
            }
        
            if (context.interfaceMode === "mobile") {
                leftControlEntity.SetVisibility(true);
            }
            else {
                leftControlEntity.SetVisibility(false);
            }
        
            if (context.interfaceMode === "mobile") {
                rightControlEntity.SetVisibility(true);
            }
            else {
                rightControlEntity.SetVisibility(false);
            }
        
            if (context.interfaceMode === "mobile") {
                jumpControlEntity.SetVisibility(true);
            }
            else {
                jumpControlEntity.SetVisibility(false);
            }
        
            if (context.interfaceMode === "mobile") {
                dropControlEntity.SetVisibility(true);
            }
            else {
                dropControlEntity.SetVisibility(false);
            }
        }
    }

    AddDirectionalLightEntity(parent, position, rotation, tag) {
        var uuid = UUID.NewUUID().ToString();
        LightEntity.Create(parent, position, rotation, uuid, tag, "FinishLoadingDirectionalLightEntity");
    }

    AddMeshEntity(parent, meshObject, position, rotation, scale, tag) {
        var staticWorldContext = Context.GetContext("STATICWORLDCONTEXT");
        var uuid = UUID.NewUUID().ToString();
        staticWorldContext.meshEntityScales[uuid] = scale;
        staticWorldContext.meshEntityTags[uuid] = tag;
        Context.DefineContext("STATICWORLDCONTEXT", staticWorldContext);
        MeshEntity.Create(parent, meshObject, [ meshObject ], position, rotation, uuid, "FinishLoadingMeshEntity");
    }

    SetSkyTexture(path) {
        Environment.SetSkyTexture(path);
    }

    SetSkySolidColor(color) {
        Environment.SetSolidColorSky(color);
    }
}