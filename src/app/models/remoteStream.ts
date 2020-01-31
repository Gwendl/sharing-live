import { RTCConnection } from "light-rtc";
import { ParticipantConnection } from "./participantConnection";

export class RemoteStream implements ParticipantConnection {
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
    connection.onStream(s => {
      console.log("Stream received");
      this.stream = s;
    });
  }
}
