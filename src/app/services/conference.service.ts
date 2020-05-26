import { Injectable } from "@angular/core";
import { Participant } from "src/app/models/participant";
import { Router } from "@angular/router";
import * as socketIo from "socket.io-client";
import {
  RTCInformation,
  RTCInitiator,
  RTCConnection,
  RTCReceiver,
} from "light-rtc";
import { LocalParticipant, LocalStream, RemoteStream } from "../models";
import { environment } from "src/environments/environment";
import { ParticipantConnection } from "../models/participantConnection";
import { flatten } from "lodash";
import { RTCConfigurationService } from "./rtc-configuration.service";

@Injectable({
  providedIn: "root",
})
export class ConferenceService {
  private participants: Participant[];
  private socketIo: SocketIOClient.Socket;
  private localParticipant: LocalParticipant;

  constructor(
    private router: Router,
    private rtcConfigurationService: RTCConfigurationService
  ) {
    this.clean();
  }

  public getLocalParticipant(): LocalParticipant {
    return this.localParticipant;
  }

  public async connect(): Promise<void> {
    if (this.socketIo && this.socketIo.connected) this.socketIo.close();
    this.clean();
    this.socketIo = await this.createConnection();
    this.socketIo.on("disconnect", () => {
      this.clean();
      this.router.navigate(["home"]);
    });
    this.subscribeEvents(this.socketIo);
  }

  private clean(): void {
    this.participants = [];
    if (!this.localParticipant) return;
    this.localParticipant.localStreams.forEach((ls) => ls.stop());
    this.localParticipant.remoteStreams.forEach((rs) => rs.stop());
    this.localParticipant = undefined;
  }

  public disconnect(): void {
    this.socketIo.disconnect();
  }

  private createConnection(): Promise<SocketIOClient.Socket> {
    return new Promise((res, rej) => {
      const socket = socketIo(environment.serverUrl, {
        reconnection: false,
      });
      socket.once("connect", () => res(socket));
      socket.on("disconnect", rej);
    });
  }

  private subscribeEvents(socketIoClient: SocketIOClient.Socket): void {
    socketIoClient.on("participantJoined", (nickname: string) => {
      this.onParticipantJoined(nickname);
    });
    socketIoClient.on("participantLeft", (nickname: string) => {
      this.onParticipantLeft(nickname);
    });
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

  public onConferenceJoined(
    conferenceId: string,
    nickname: string,
    participants: string[]
  ): void {
    this.localParticipant = new LocalParticipant(nickname);
    this.participants = participants.map((name) => ({
      nickname: name,
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
      nickname,
    });
    this.localParticipant.localStreams.forEach((localStream) => {
      const connection = this.sendStream(localStream, nickname);
    });
  }

  private sendStream(
    localStream: LocalStream,
    nickname: string
  ): RTCConnection {
    const RTCConfiguration = this.rtcConfigurationService.getRTCConfiguration();
    const iceServer = {
      urls:
        (RTCConfiguration && RTCConfiguration.stunTurnUri) ||
        "stun:stun.l.google.com:19302",
      username: RTCConfiguration && RTCConfiguration.turnUsername,
      credential: RTCConfiguration && RTCConfiguration.turnPassword,
    };
    const connection = new RTCInitiator(
      localStream.stream,
      (infos) => {
        this.sendRTCHandshake(nickname, localStream.id, infos);
      },
      {
        iceServers: [iceServer, { urls: "stun:stun.l.google.com:19302" }],
      }
    );
    localStream.addConnection(nickname, connection);
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
      connections.find((c) => c.nickname === nickname && c.id === peerId) ||
      this.createReceiver(nickname, peerId);
    participantConnection.connection.addInformations(rtcInfos);
  }

  private createReceiver(nickname: string, peerId: string): RemoteStream {
    const RTCConfiguration = this.rtcConfigurationService.getRTCConfiguration();
    const iceServer = {
      urls:
        (RTCConfiguration && RTCConfiguration.stunTurnUri) ||
        "stun:stun.l.google.com:19302",
      username: RTCConfiguration && RTCConfiguration.turnUsername,
      credential: RTCConfiguration && RTCConfiguration.turnPassword,
    };
    const rtcConnection = new RTCReceiver(
      undefined,
      (infos) => {
        this.sendRTCHandshake(nickname, peerId, infos);
      },
      {
        iceServers: [iceServer, { urls: "stun:stun.l.google.com:19302" }],
      }
    );
    return this.localParticipant.addRemoteStreamConnection(
      nickname,
      peerId,
      rtcConnection
    );
  }

  private getPeerConnections(): ParticipantConnection[] {
    const localStreams = this.localParticipant.localStreams;
    const localStreamConnections = flatten(
      localStreams.map((streams) => streams.connections)
    );
    return localStreamConnections.concat(this.localParticipant.remoteStreams);
  }

  public addStream(stream: MediaStream): void {
    const localStream = new LocalStream(stream);
    this.participants.forEach((p) => {
      this.sendStream(localStream, p.nickname);
    });
    this.localParticipant.localStreams.push(localStream);
  }

  public stopLocalStreamConnection(id: string): void {
    const localStreamConnection = this.localParticipant.localStreams.find(
      (ls) => ls.id === id
    );
    localStreamConnection.stop();
    this.localParticipant.localStreams = this.localParticipant.localStreams.filter(
      (ls) => ls !== localStreamConnection
    );
  }

  public stopRemoteStreamConnection(id: string): void {
    const remoteStreamConnection = this.localParticipant.remoteStreams.find(
      (rs) => rs.id === id
    );
    remoteStreamConnection.stop();
    this.localParticipant.remoteStreams = this.localParticipant.remoteStreams.filter(
      (rs) => rs !== remoteStreamConnection
    );
  }

  public onParticipantLeft(nickname: string): void {
    this.localParticipant.remoteStreams = this.localParticipant.remoteStreams.filter(
      (rs) => rs.nickname !== nickname
    );
    this.participants = this.participants.filter(
      (p) => p.nickname !== nickname
    );
  }

  public isInConference(): boolean {
    return this.localParticipant !== undefined;
  }
}
