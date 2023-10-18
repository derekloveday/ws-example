import createApp from "./createApp";
import createServer from "./createServer";
import shutdownServer from "./shutdownServer";
import { configure } from "./webSockets";

const app = createApp();
const port = process.env.PORT || 3000;

const serverContext = createServer(app);

const { server } = serverContext;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Configure Websockets
configure(server);

const shutdownServerParams = {
  serverContext,
  timeInMillisecondsToWaitForServerToClose: 10000,
  timeInMillisecondsToWaitBeforeDestroyingConnections: 5000,
};

process.on("SIGTERM", () => shutdownServer(shutdownServerParams));
process.on("SIGINT", () => shutdownServer(shutdownServerParams));

process.on("unhandledRejection", (reason: unknown) => {
  console.error({ message: reason });
});
