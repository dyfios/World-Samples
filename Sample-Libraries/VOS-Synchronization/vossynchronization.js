/// @file vossynchronization.js
/// Module for a VOS synchronizer.

class VOSSynchronizer {
    constructor(host, port, tls = false, transport = "tcp", sessionToConnectTo = null, onConnect = null, onJoinedSession = null, onMessage = null) {
        this.host = host;
        this.port = port;
        this.tls = tls;
        this.transport = transport;
        this.sessionToConnectTo = sessionToConnectTo;
        this.onJoinedSession = onJoinedSession;
        this.onMessage = onMessage;
        this.clientID = null;
        this.onConnect = onConnect;
        
        this.OnConnected = function() {
            var context = Context.GetContext("VOSSynchronizationContext");
            if (context.onConnect != null) {
                context.onConnect();
            }
        }
        
        this.Connect = function() {
            var context = Context.GetContext("VOSSynchronizationContext");

            if (context == null) {
                return;
            }
            
            var onJoinedAction =
            `
                var context = Context.GetContext("VOSSynchronizationContext");
                if (context.OnConnected != null) {
                    context.OnConnected();
                }
                
                if (context.onMessage != null) {
                    VOSSynchronization.RegisterMessageCallback(context.sessionToConnectTo.id, context.onMessage);
                }

                Logging.Log('[VOSSynchronization:Connect] Joined Session');
                if (context.onJoinedSession != null) {
                    context.onJoinedSession();
                }
            `;
            
            if (context.transport === "tcp" || context.transport === "TCP") {
                VOSSynchronization.JoinSession(context.host, context.port, context.tls, context.sessionToConnectTo.id,
                    context.sessionToConnectTo.tag, onJoinedAction, VSSTransport.TCP, UUID.NewUUID().ToString());
            }
            else if (context.transport === "websocket" || context.transport === "WEBSOCKET") {
                VOSSynchronization.JoinSession(context.host, context.port, context.tls, context.sessionToConnectTo.id,
                    context.sessionToConnectTo.tag, onJoinedAction, VSSTransport.WebSocket, UUID.NewUUID().ToString());
            }
            else {
                Logging.LogError("[VOSSynchronization:Connect] Invalid transport.");
            }

            Context.DefineContext("VOSSynchronizationContext", context);
        }

        this.Disconnect = function() {
            var context = Context.GetContext("VOSSynchronizationContext");

            if (context == null) {
                return;
            }

            //VOSSynchronization.DisconnectService(context.host, context.port);

            Context.DefineContext("VOSSynchronizationContext", context);
        }

        Context.DefineContext("VOSSynchronizationContext", this);
    }
    
    Connect() {
        var onJoinedAction =
            `
                var context = Context.GetContext("VOSSynchronizationContext");
                if (context.OnConnected != null) {
                    context.OnConnected();
                }
                
                if (context.onMessage != null) {
                    VOSSynchronization.RegisterMessageCallback(context.sessionToConnectTo.id, context.onMessage);
                }

                Logging.Log('[VOSSynchronization:Connect] Joined Session');
                if (context.onJoinedSession != null) {
                    context.onJoinedSession();
                }
            `;
        
        if (context.transport === "tcp" || context.transport === "TCP") {
            VOSSynchronization.JoinSession(context.host, context.port, context.tls, context.sessionToConnectTo.id,
                context.sessionToConnectTo.tag, onJoinedAction, VSSTransport.TCP);
        }
        else if (context.transport === "websocket" || context.transport === "WEBSOCKET") {
            VOSSynchronization.JoinSession(context.host, context.port, context.tls, context.sessionToConnectTo.id,
                context.sessionToConnectTo.tag, onJoinedAction, VSSTransport.WebSocket);
        }
        else {
            Logging.LogError("[VOSSynchronization:Connect] Invalid transport.");
        }
    }
    
    Disconnect() {
        VOSSynchronization.DisconnectService(this.host, this.port);
    }
    
    AddEntity(entityID, deleteWithClient = false, resources = null) {
        VOSSynchronization.StartSynchronizingEntity(this.sessionToConnectTo.id, entityID, deleteWithClient, resources);
    }
    
    SendMessage(topic, message) {
        VOSSynchronization.SendMessage(this.sessionToConnectTo.id, topic, message);
    }
}

function AddVOSSynchronizationEntity(entityID, deleteWithClient = false, resources = null) {
    var context = Context.GetContext("VOSSynchronizationContext");

    if (context == null) {
        return;
    }

    VOSSynchronization.StartSynchronizingEntity(context.sessionToConnectTo.id, entityID, deleteWithClient, resources);

    Context.DefineContext("VOSSynchronizationContext", context);
}

function SendVOSSynchronizationMessage(topic, message) {
    var context = Context.GetContext("VOSSynchronizationContext");

    if (context == null) {
        return;
    }

    VOSSynchronization.SendMessage(context.sessionToConnectTo.id, topic, message);

    Context.DefineContext("VOSSynchronizationContext", context);
}