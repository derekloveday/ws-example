import http from "http";
import { ServerContext } from "./interfaces";

const createServer = (requestListener: http.RequestListener) => {
  const server = http.createServer(requestListener);

  const context: ServerContext = {
    server,
    connections: [],
  };

  server.on("connection", (connection) => {
    context.connections.push(connection);

    connection.on("close", () => {
      context.connections = context.connections.filter((c) => c !== connection);
    });
  });

  return context;
};

export default createServer;
