import http from "http";
import { Duplex } from "stream";

export default interface ServerContext {
  server: http.Server;
  connections: Duplex[];
}
