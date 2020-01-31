import { RTCConnection } from "light-rtc";

export class RemoteStream {
  public stream: MediaStream;
  public id: string;
  public connection: RTCConnection;

  public constructor(id: string, connection: RTCConnection) {
    this.id = id;
    this.connection = connection;
    connection.onStream(s => (this.stream = s));
  }
}
