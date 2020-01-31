import { RTCConnection } from "light-rtc";
import guid from "./guid";

export class LocalStream {
  public stream: MediaStream;
  public id: string;
  public connections: RTCConnection[];

  constructor(stream: MediaStream) {
    this.id = guid();
    this.connections = [];
    this.stream = stream;
  }

  public addConnection(connection: RTCConnection): void {
    this.connections.push(connection);
  }
}
