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
    socketIoClient.on("participantJoined", this.onParticipantJoined);
    socketIoClient.on("ParticipantLeft", this.onParticipantLeft);
    socketIoClient.on("conferenceJoined", this.onParticipantLeft);
    socketIoClient.on("conferenceCreated", this.onConferenceCreated);
    socketIoClient.on("rtcHandshake", this.onRTCHandshake);
  }

  public joinConference(conferenceId: string, nickName: string): void {
    this.socketIo.emit("joinConference", conferenceId, nickName);
    this.conferenceId = conferenceId;
    this.localUser = new LocalParticipant(nickName);
  }

  public createConference(nickName: string): void {
    this.localUser = new LocalParticipant(nickName);
    console.log(this.socketIo);
    this.socketIo.emit("createConference", nickName);
  }

  public onConferenceCreated(conferenceId: string): void {
    this.conferenceId = conferenceId;
    this.router.navigate(["conference", conferenceId]);
  }

  public async onParticipantJoined(participant: Participant): Promise<void> {
    this.participants.push(participant);
    this.localUser.localStreams.forEach(localStream => {
      const remoteStream = this.sendStream(localStream, participant);
    });
  }

  private sendStream(
    localStream: LocalStream,
    participant: Participant
  ): RTCConnection {
    return new RTCInitiator(localStream.stream, infos => {
      this.sendRTCHandshake(participant.nickname, localStream.id, infos);
    });
  }

  public sendRTCHandshake(
    nickName: string,
    peerId: string,
    rtcInfos: RTCInformation
  ): void {
    this.socketIo.emit("rtcHandshake", nickName, peerId, rtcInfos);
  }

  public onRTCHandshake(
    nickName: string,
    peerId: string,
    rtcInfos: RTCInformation
  ): void {
    const participant = this.participants.find(p => p.nickname === nickName);
    const rtcConnection = new RTCReceiver(undefined, infos => {
      this.sendRTCHandshake(participant.nickname, peerId, infos);
    });
    const remoteStream = new RemoteStream(peerId, rtcConnection);
    this.localUser.remoteStreams.push(remoteStream);
  }

  public addStream(stream: MediaStream): void {
    const localStream = new LocalStream(stream);
    this.participants.forEach(p => {
      this.sendStream(localStream, p);
    });
    this.localUser.localStreams.push(localStream);
  }

  public async onParticipantLeft(participant: Participant): Promise<void> {}
}
