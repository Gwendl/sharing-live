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
      this.stopRemoteStream(connectionId);
    });
    return remoteStream;
  }

  public stopLocalStream(localStreamId: string): void {
    const localStream = this.localStreams.find(ls => ls.id === localStreamId);
    if (!localStream) return;
    this.localStreams = this.localStreams.filter(ls => ls !== localStream);
    localStream.stop();
  }

  public stopLocalStreamFor(localStreamId: string, nickName: string): void {
    const localStream = this.localStreams.find(ls => ls.id === localStreamId);
    if (!localStream) return;
    localStream.stopConnection(nickName);
    if (!localStream.hasConnection()) this.stopLocalStream(localStreamId);
  }

  public stopRemoteStream(connectionId: string): void {
    const remoteStream = this.remoteStreams.find(rs => rs.id === connectionId);
    if (!remoteStream) return;
    remoteStream.stop();
    this.remoteStreams = this.remoteStreams.filter(rs => rs !== remoteStream);
  }
}
