import ServerContext from "./ServerContext";

export default interface ShutdownServerParams {
  serverContext: ServerContext;
  timeInMillisecondsToWaitForServerToClose: number;
  timeInMillisecondsToWaitBeforeDestroyingConnections: number;
}
