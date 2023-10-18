import { IncomingMessage, Server } from "http";
import { validate } from "uuid";
import { WebSocket, WebSocketServer } from "ws";

interface WebSocketAlive extends WebSocket {
  connectionId: string;
  isAlive: boolean;
}

const wss = new WebSocketServer({ noServer: true });

const clients = new Map<string, WebSocket>();

function heartbeat() {
  // @ts-ignore
  (this as WebSocketAlive).isAlive = true;
}

const onSocketPreError = (e: Error) => {
  console.log(e);
};

const onSocketPostError = (e: Error) => {
  console.log(e);
};

const configure = (server: Server) => {
  server.on("upgrade", (req, socket, head) => {
    socket.on("error", onSocketPreError);

    if (req.headers["BadAuth"]) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      socket.removeListener("error", onSocketPreError);
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws: WebSocketAlive, req: IncomingMessage) => {
    const connectionId = req.url?.substring(1);

    if (connectionId) {
      // Validate that the past connectionId is a valid UUID
      const valid = validate(connectionId);

      if (!valid) {
        ws.send(
          `Invalid connectionId, ${connectionId} sent.  Terminating connection.`
        );
        setTimeout(() => {
          ws.terminate();
        }, 100);
        return;
      }
      ws.connectionId = connectionId;
      clients.set(connectionId, ws);
    }
    ws.isAlive = true;

    ws.on("error", onSocketPostError);

    ws.on("message", function message(msg, isBinary) {
      // Check if a ping message from a client
      // If so, respond with a pong message
      if (isBinary && msg.toString() === "ping") {
        const msg = "pong";
        const arr = Uint8Array.from(msg, (c) => c.charCodeAt(0));
        this.send(arr, { binary: true });
        return;
      }

      // This broadcast the message back to all OPEN clients
      const connectionId = (this as WebSocketAlive).connectionId;

      wss.clients.forEach((client) => {
        const c = client as WebSocketAlive;
        if (
          c.readyState === WebSocket.OPEN &&
          c.connectionId !== connectionId
        ) {
          c.send(msg, { binary: isBinary });
        }
      });
    });

    ws.on("pong", heartbeat);

    ws.on("close", function close() {
      const connectionId = (this as WebSocketAlive).connectionId;
      if (connectionId) {
        clients.delete(connectionId);
      }
      console.log("Connection closed");
    });

    console.log("Connection opened");
  });

  wss.on("close", () => {
    clearInterval(interval);
  });

  const interval = setInterval(() => {
    for (let ws of wss.clients as Set<WebSocketAlive>) {
      if (!ws.isAlive) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    }
  }, 15000);
};

export default configure;
