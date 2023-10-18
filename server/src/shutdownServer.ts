import ShutdownServerParams from "./interfaces/ShutdownServerParams";

const shutdownServer = (params: ShutdownServerParams) => {
  const {
    serverContext,
    timeInMillisecondsToWaitBeforeDestroyingConnections,
    timeInMillisecondsToWaitForServerToClose,
  } = params;

  const { server, connections } = serverContext;

  console.log("Server shutting down");

  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    console.log("Server did not shutdown in time, forcefully shutting down");
    process.exit(1);
  }, timeInMillisecondsToWaitForServerToClose);

  connections.forEach((c) => c.end());

  setTimeout(
    () => connections.forEach((c) => c.destroy()),
    timeInMillisecondsToWaitBeforeDestroyingConnections
  );
};

export default shutdownServer;
