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
    connection.getPeer().addEventListener("iceconnectionstatechange", () => {
      if (connection.getPeer().iceConnectionState !== "disconnected") return;
      this.stopConnection(nickname);
    });
    return connectionInfos;
  }

  public stopConnection(nickName: string): void {
    const participantConnection = this.connections.find(
      pc => pc.nickname === nickName
    );
    if (!participantConnection) return;
    participantConnection.connection.getPeer().close();
    this.connections = this.connections.filter(
      pc => pc !== participantConnection
    );
  }

  public stop(): void {
    this.stream.getTracks().forEach(t => t.stop());
    this.connections.forEach(c => this.stopConnection(c.nickname));
  }

  public hasConnection(): boolean {
    return this.connections.length > 0;
  }
}
