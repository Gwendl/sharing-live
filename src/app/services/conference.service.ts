import { Injectable } from "@angular/core";
import { Participant } from "src/app/models/participant";
import { Router } from "@angular/router";
import * as socketIo from "socket.io-client";
import {
  RTCInformation,
  RTCInitiator,
  RTCConnection,
  RTCReceiver
} from "light-rtc";
import { LocalParticipant, LocalStream, RemoteStream } from "../models";
import { environment } from "src/environments/environment";
import { ParticipantConnection } from "../models/participantConnection";
import { flatten } from "lodash";

@Injectable({
  providedIn: "root"
})
export class ConferenceService {
  private participants: Participant[];
  private socketIo: SocketIOClient.Socket;
  private localParticipant: LocalParticipant;

  constructor(private router: Router) {}

  public getLocalParticipant(): LocalParticipant {
    return this.localParticipant;
  }

  public async connect(): Promise<void> {
    this.participants = [];
    this.socketIo = await this.createConnection();
    this.socketIo.on("disconnect", () => {
      this.router.navigate(["home"]);
    });
    this.subscribeEvents(this.socketIo);
  }

  public disconnect() : void {
    this.socketIo.disconnect();
  }

  private createConnection(): Promise<SocketIOClient.Socket> {
    return new Promise((res, rej) => {
      const socket = socketIo(environment.serverUrl, {
        reconnection: false
      });
      socket.once("connect", () => res(socket));
      socket.on("disconnect", rej);
    });
  }

  private subscribeEvents(socketIoClient: SocketIOClient.Socket): void {
    socketIoClient.on("participantJoined", (nickname: string) =>
      this.onParticipantJoined(nickname)
    );
    socketIoClient.on("participantLeft", (nickname: string) =>
      this.onParticipantLeft(nickname)
    );
    socketIoClient.on(
      "conferenceJoined",
      (conferenceId: string, nickname: string, participants: string[]) =>
        this.onConferenceJoined(conferenceId, nickname, participants)
    );
    socketIoClient.on(
      "rtcHandshake",
      (nickname: string, peerId: string, rtcInfos: RTCInformation) =>
        this.onRTCHandshake(nickname, peerId, rtcInfos)
    );
  }

  public stopConnection(nickname: string, streamId: string) : void {
    const participantConnection = this.getPeerConnections().find(c => c.id === streamId && c.nickname === nickname);
    participantConnection.connection.getPeer().close();
  }

  public onConferenceJoined(
    conferenceId: string,
    nickname: string,
    participants: string[]
  ): void {
    this.localParticipant = new LocalParticipant(nickname);
    this.participants = participants.map(name => ({
      nickname: name
    }));
    this.router.navigate(["conference", conferenceId]);
  }

  public joinConference(conferenceId: string, nickname: string): void {
    this.socketIo.emit("joinConference", conferenceId, nickname);
  }

  public createConference(nickname: string): void {
    this.socketIo.emit("createConference", nickname);
  }

  public async onParticipantJoined(nickname: string): Promise<void> {
    this.participants.push({
      nickname
    });
    this.localParticipant.localStreams.forEach(localStream => {
      const connection = this.sendStream(localStream, nickname);
    });
  }

  private sendStream(
    localStream: LocalStream,
    nickname: string
  ): RTCConnection {
    const connection = new RTCInitiator(localStream.stream, infos => {
      this.sendRTCHandshake(nickname, localStream.id, infos);
    });
    const connectionInfos = {
      connection,
      nickname,
      id: localStream.id
    };
    localStream.connections.push(connectionInfos);
    const peer = connection.getPeer();
    peer.addEventListener("connectionstatechange", state => {
      if (peer.connectionState === "disconnected" || peer.connectionState === "closed")
      {
        console.log("receiver", peer.connectionState);
        localStream.connections = localStream.connections.filter(c => c != connectionInfos);
      }
    });
    return connection;
  }

  public sendRTCHandshake(
    nickname: string,
    peerId: string,
    rtcInfos: RTCInformation
  ): void {
    this.socketIo.emit("rtcHandshake", nickname, peerId, rtcInfos);
  }

  public onRTCHandshake(
    nickname: string,
    peerId: string,
    rtcInfos: RTCInformation
  ): void {
    const connections = this.getPeerConnections();
    const participantConnection =
      connections.find(c => c.nickname === nickname && c.id === peerId) ||
      this.createReceiver(nickname, peerId);
    participantConnection.connection.addInformations(rtcInfos);
  }

  private createReceiver(nickname: string, peerId: string): RemoteStream {
    const rtcConnection = new RTCReceiver(undefined, infos => {
      this.sendRTCHandshake(nickname, peerId, infos);
    });
    const remoteStream = new RemoteStream(nickname, peerId, rtcConnection);
    this.localParticipant.remoteStreams.push(remoteStream);
    const peer = rtcConnection.getPeer();
    peer.addEventListener("connectionstatechange", state => {
      if (peer.connectionState === "disconnected" || peer.connectionState === "closed")
      {
        console.log("receiver", peer.connectionState);
        this.localParticipant.remoteStreams = this.localParticipant.remoteStreams.filter(rs => rs != remoteStream);
        if (remoteStream.stream)
          remoteStream.stream.getTracks().forEach(t => t.stop());
      }
    });
    return remoteStream;
  }

  private getPeerConnections(): ParticipantConnection[] {
    const localStreams = this.localParticipant.localStreams;
    const localStreamConnections = flatten(
      localStreams.map(streams => streams.connections)
    );
    return localStreamConnections.concat(this.localParticipant.remoteStreams);
  }

  public addStream(stream: MediaStream): void {
    const localStream = new LocalStream(stream);
    this.participants.forEach(p => {
      this.sendStream(localStream, p.nickname);
    });
    this.localParticipant.localStreams.push(localStream);
  }

  public stopLocalStreamConnection(id: string) : void {
    const localStreamConnection = this.localParticipant.localStreams.find(ls => ls.id === id);
    localStreamConnection.connections.forEach(c => {
      console.log("close : ", c.connection.getPeer().peerIdentity);
      c.connection.getPeer().close();
    });
    localStreamConnection.stream.getTracks().forEach(t => t.stop());
    this.localParticipant.localStreams = this.localParticipant.localStreams.filter(ls => ls !== localStreamConnection);
  }

  public stopRemoteStreamConnection(id: string) : void {
    const remoteStreamConnection = this.localParticipant.remoteStreams.find(rs => rs.id);
    remoteStreamConnection.connection.getPeer().close();
    if (remoteStreamConnection.stream)
      remoteStreamConnection.stream.getTracks().forEach(t => t.stop());
    this.localParticipant.remoteStreams = this.localParticipant.remoteStreams.filter(rs => rs !== remoteStreamConnection);
  }

  public onParticipantLeft(nickname: string): void {
    this.participants = this.participants.filter(p => p.nickname !== nickname);
  }

  public isInConference() : boolean {
    return this.localParticipant != undefined;
  }
}
