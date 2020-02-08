import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConferenceService } from "src/app/services/conference.service";
import { RemoteStream, LocalStream } from "src/app/models";
import { MatDialog } from "@angular/material";
import { AddStreamDialogComponent } from "../add-stream-dialog/add-stream-dialog.component";
import { SnackBarService } from "src/app/services";
import { AddNicknameDialogComponent } from "../add-nickname-dialog/add-nickname-dialog.component";

@Component({
  templateUrl: "./conference.component.html",
  styleUrls: ["./conference.component.scss"]
})
export class ConferenceComponent {
  public localStream: MediaStream;
  public focusedStream: MediaStream;
  constructor(
    private router: ActivatedRoute,
    private conferenceService: ConferenceService,
    private dialog: MatDialog,
    private snackbarService: SnackBarService
  ) {
    this.initConference();
  }

  public async initConference() : Promise<void> {
    if (!this.conferenceService.isInConference()){
     const nickName = await this.openNicknameDialog();
     await this.conferenceService.connect();
     const conferenceId = this.router.snapshot.params.id;
     await this.conferenceService.joinConference(conferenceId, nickName);
    }
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(stream => {
      this.localStream = stream;
      this.focusedStream = stream;
      this.conferenceService.addStream(stream);
    });
  }

  public getLocalStreams(): LocalStream[] {
    if (!this.conferenceService.isInConference())
      return [];
    return this.conferenceService.getLocalParticipant().localStreams;
  }

  public getRemoteStreams(): RemoteStream[] {
    if (!this.conferenceService.isInConference())
      return [];
    return this.conferenceService.getLocalParticipant().remoteStreams;
  }

  public closeLocalStreamConnection(localStreamConnectionId: string): void {
    this.conferenceService.stopLocalStreamConnection(localStreamConnectionId);
  }

  public closeRemoteStreamConnection(remoteStreamConnectionId: string): void {
    this.conferenceService.stopRemoteStreamConnection(remoteStreamConnectionId);
  }

  public hangupConference(): void {
    this.conferenceService.disconnect();
  }

  public enableMic(stream: MediaStream): void {
    // enable microphone
    console.log("enable microphone", stream);
  }

  public disableMic(stream: MediaStream): void {
    // disable microphone
    console.log("disable microphone", stream);
  }

  public addStream(): void {
    const dialogRef = this.dialog.open(AddStreamDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.conferenceService.addStream(result);
      this.snackbarService.success("Stream added");
    });
  }

  public canShareScreen() : boolean {
    return navigator.mediaDevices["getDisplayMedia"] != undefined;
  }

  public async addScreenShare(): Promise<void> {
    const stream = await navigator.mediaDevices["getDisplayMedia"]();
    this.conferenceService.addStream(stream);
  }

  public openNicknameDialog(): Promise<string> {
    const dialogRef = this.dialog.open(AddNicknameDialogComponent, {
      disableClose: true
    });
    return dialogRef.afterClosed().toPromise().then((nickname: string) => {
      if (!nickname) return;
      console.log(nickname);
      this.snackbarService.success(`Welcome ${nickname}!`);
      return nickname;
    });
  }
}
