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
    socketIoClient.on("participantJoined", nickname =>
      this.onParticipantJoined(nickname)
    );
    socketIoClient.on("participantLeft", nickname =>
      this.onParticipantLeft(nickname)
    );
    socketIoClient.on(
      "conferenceJoined",
      (conferenceId, nickname, participants) =>
        this.onConferenceJoined(conferenceId, nickname, participants)
    );
    socketIoClient.on("rtcHandshake", (nickname, peerId, rtcInfos) =>
      this.onRTCHandshake(nickname, peerId, rtcInfos)
    );
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
    localStream.connections.push({
      connection,
      nickname,
      id: localStream.id
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

  public onParticipantLeft(nickname: string): void {
    this.participants = this.participants.filter(p => p.nickname !== nickname);
  }
}
