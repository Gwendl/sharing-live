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
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.localStream = stream;
        this.focusedStream = stream;
        this.conferenceService.addStream(stream);
      });
    console.log(this.router.snapshot.params.id);

    // dialog ref nickname test
    this.openNicknameDialog();
  }

  public getLocalStreams(): LocalStream[] {
    return this.conferenceService.getLocalParticipant().localStreams;
  }

  public getRemoteStreams(): RemoteStream[] {
    return this.conferenceService.getLocalParticipant().remoteStreams;
  }

  public closeStream(stream: MediaStream): void {
    // close stream
    console.log("close stream", stream);
  }

  public hangupConference(): void {
    // hang conference
    console.log("hang conference");
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

  public addScreenShare(): void {
    // navigator.mediaDevices.getDisplayMedia();
  }

  public openNicknameDialog(): void {
    const dialogRef = this.dialog.open(AddNicknameDialogComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((nickname: string) => {
      if (!nickname) return;
      console.log(nickname);
      this.snackbarService.success(`Welcome ${nickname}!`);
    });
  }
}
