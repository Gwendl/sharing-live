import { RTCConnection } from "light-rtc";
import guid from "./guid";
import { ParticipantConnection } from "./participantConnection";

export class LocalStream {
  public stream: MediaStream;
  public id: string;
  public connections: ParticipantConnection[];

  constructor(stream: MediaStream) {
    this.id = guid();
    this.connections = [];
    this.stream = stream;
  }

  public addConnection(nickname: string, connection: RTCConnection): void {
    this.connections.push({
      nickname,
      id: this.id,
      connection
    });
  }
}
