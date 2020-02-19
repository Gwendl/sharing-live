import { RTCConnection } from "light-rtc";
import guid from "./guid";
import { ParticipantConnection } from "./participantConnection";
import { ParticipantStream } from "./participant-stream";

export class LocalStream implements ParticipantStream {
  public stream: MediaStream;
  public id: string;
  public connections: ParticipantConnection[];

  constructor(stream: MediaStream) {
    this.id = guid();
    this.connections = [];
    this.stream = stream;
  }

  public addConnection(
    nickname: string,
    connection: RTCConnection
  ): ParticipantConnection {
    const connectionInfos = {
      nickname,
      id: this.id,
      connection
    };
    this.connections.push(connectionInfos);
    return connectionInfos;
  }

  public stop(): void {
    this.stream.getTracks().forEach(t => t.stop());
    this.connections.forEach(c => c.connection.getPeer().close());
  }
}
