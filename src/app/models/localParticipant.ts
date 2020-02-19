import { LocalStream } from "./localStream";
import { RemoteStream } from "./remoteStream";
import { Participant } from "./participant";
import { RTCConnection } from "light-rtc";

export class LocalParticipant implements Participant {
  public localStreams: LocalStream[];
  public nickname: string;
  public muted: boolean;
  public screenSharingEnabled: boolean;
  public remoteStreams: RemoteStream[];

  constructor(nickName: string) {
    this.nickname = nickName;
    this.localStreams = [];
    this.remoteStreams = [];
    this.screenSharingEnabled = false;
    this.muted = false;
  }

  public addLocalStreamConnection(
    localStreamId: string,
    nickName: string,
    connection: RTCConnection
  ): void {
    const localStream = this.localStreams.find(ls => ls.id === localStreamId);
    const connectionInfos = localStream.addConnection(nickName, connection);
    const peer = connection.getPeer();
    peer.addEventListener("iceconnectionstatechange", state => {
      if (peer.iceConnectionState !== "disconnected") return;
      localStream.connections = localStream.connections.filter(
        c => c !== connectionInfos
      );
      peer.close();
    });
  }

  public addRemoteStreamConnection(
    nickName: string,
    connectionId: string,
    connection: RTCConnection
  ): RemoteStream {
    const remoteStream = new RemoteStream(nickName, connectionId, connection);
    this.remoteStreams.push(remoteStream);
    const peer = connection.getPeer();
    peer.addEventListener("iceconnectionstatechange", state => {
      if (peer.iceConnectionState !== "disconnected") return;
      remoteStream.stop();
      this.remoteStreams = this.remoteStreams.filter(rs => rs !== remoteStream);
    });
    return remoteStream;
  }
}
