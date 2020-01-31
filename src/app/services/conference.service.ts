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

@Injectable({
  providedIn: "root"
})
export class ConferenceService {
  private participants: Participant[];
  private socketIo: SocketIOClient.Socket;
  private localUser: LocalParticipant;
  private conferenceId: string;

  constructor(private router: Router) {}

  public async connect(): Promise<void> {
    this.participants = [];
    this.socketIo = await this.createConnection();
    this.socketIo.on("disconnect", () => {
      console.log("disconnected");
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
    socketIoClient.on("conferenceJoined", (conferenceId, nickname) =>
      this.onConferenceJoined(conferenceId, nickname)
    );
    socketIoClient.on("rtcHandshake", (nickname, peerId, rtcInfos) =>
      this.onRTCHandshake(nickname, peerId, rtcInfos)
    );
  }

  public onConferenceJoined(conferenceId: string, nickname: string): void {
    this.conferenceId = conferenceId;
    this.localUser = new LocalParticipant(nickname);
    this.router.navigate(["conference", conferenceId]);
  }

  public joinConference(conferenceId: string, nickname: string): void {
    this.socketIo.emit("joinConference", conferenceId, nickname);
  }

  public createConference(nickname: string): void {
    this.localUser = new LocalParticipant(nickname);
    console.log(this.socketIo);
    this.socketIo.emit("createConference", nickname);
  }

  public async onParticipantJoined(nickname: string): Promise<void> {
    this.participants.push({
      nickname,
      muted: false
    });
    this.localUser.localStreams.forEach(localStream => {
      const remoteStream = this.sendStream(localStream, nickname);
    });
  }

  private sendStream(
    localStream: LocalStream,
    nickname: string
  ): RTCConnection {
    return new RTCInitiator(localStream.stream, infos => {
      this.sendRTCHandshake(nickname, localStream.id, infos);
    });
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
    const participant = this.participants.find(p => p.nickname === nickname);
    const rtcConnection = new RTCReceiver(undefined, infos => {
      this.sendRTCHandshake(participant.nickname, peerId, infos);
    });
    rtcConnection.addInformations(rtcInfos);
    const remoteStream = new RemoteStream(peerId, rtcConnection);
    this.localUser.remoteStreams.push(remoteStream);
  }

  public addStream(stream: MediaStream): void {
    const localStream = new LocalStream(stream);
    this.participants.forEach(p => {
      this.sendStream(localStream, p.nickname);
    });
    this.localUser.localStreams.push(localStream);
  }

  public onParticipantLeft(nickname: string): void {
    this.participants = this.participants.filter(p => p.nickname !== nickname);
  }
}
