import { RTCConnection } from "light-rtc";
import { ParticipantConnection } from "./participantConnection";
import { ParticipantStream } from "./participant-stream";

export class RemoteStream implements ParticipantConnection, ParticipantStream {
  public stream: MediaStream;
  public nickname: string;
  public id: string;
  public connection: RTCConnection;

  public constructor(
    sourceNickname: string,
    id: string,
    connection: RTCConnection
  ) {
    this.id = id;
    this.nickname = sourceNickname;
    this.connection = connection;
    connection.onStream(s => (this.stream = s));
  }

  public stop(): void {
    this.connection.getPeer().close();
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
  }
}
