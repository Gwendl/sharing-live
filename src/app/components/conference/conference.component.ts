import { Component, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConferenceService } from "src/app/services/conference.service";
import { RemoteStream, LocalStream } from "src/app/models";
import { MatDialog } from "@angular/material";
import { AddStreamDialogComponent } from "../add-stream-dialog/add-stream-dialog.component";
import { SnackBarService } from "src/app/services";
import { AddNicknameDialogComponent } from "../add-nickname-dialog/add-nickname-dialog.component";
import { ParticipantStream } from "src/app/models/participant-stream";
import { ScreenQualityDialogComponent } from "../screen-quality-dialog/screen-quality-dialog.component";

@Component({
  templateUrl: "./conference.component.html",
  styleUrls: ["./conference.component.scss"],
})
export class ConferenceComponent {
  private focusedStream: MediaStream | undefined = undefined;
  public panelVisibility: boolean = true;
  @ViewChild("mainStreamVideo", { static: true })
  public mainStreamVideo: ElementRef<HTMLVideoElement>;
  constructor(
    private router: ActivatedRoute,
    private conferenceService: ConferenceService,
    private dialog: MatDialog,
    private snackbarService: SnackBarService
  ) {
    this.initConference();
  }

  public getMainStream(): MediaStream | undefined {
    if (this.focusedStream) return this.focusedStream;
    const localParticipant = this.conferenceService.getLocalParticipant();
    if (!localParticipant) return;
    const lastRemoteStream = localParticipant.remoteStreams.reverse()[0];
    return (
      (lastRemoteStream && lastRemoteStream.stream) ||
      localParticipant.localStreams.map((ls) => ls.stream)[0]
    );
  }

  public isFocused(stream: MediaStream): boolean {
    if (!this.focusedStream) return false;
    return this.focusedStream === stream;
  }

  public focusStream(stream: MediaStream): void {
    this.focusedStream = stream;
  }

  public async initConference(): Promise<void> {
    if (!this.conferenceService.isInConference()) {
      const nickName = await this.openNicknameDialog();
      await this.conferenceService.connect();
      const conferenceId = this.router.snapshot.params.id;
      this.conferenceService.joinConference(conferenceId, nickName);
    }
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.conferenceService.addStream(stream);
        stream.getAudioTracks().forEach((track) => (track.enabled = false));
      });
  }

  public getLocalStreams(): LocalStream[] {
    if (!this.conferenceService.isInConference()) return [];
    return this.conferenceService.getLocalParticipant().localStreams;
  }

  public getRemoteStreams(): RemoteStream[] {
    if (!this.conferenceService.isInConference()) return [];
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
    stream.getAudioTracks().forEach((at) => (at.enabled = true));
  }

  public disableMic(stream: MediaStream): void {
    stream.getAudioTracks().forEach((at) => (at.enabled = false));
  }

  public addStream(): void {
    const dialogRef = this.dialog.open(AddStreamDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.conferenceService.addStream(result);
      this.snackbarService.success("Stream added");
    });
  }

  public enterInFullScreen(): void {
    if (this.mainStreamVideo.nativeElement.requestFullscreen) {
      this.mainStreamVideo.nativeElement.requestFullscreen();
    }
  }

  public canShareScreen(): boolean {
    // tslint:disable-next-line: no-string-literal
    return navigator.mediaDevices["getDisplayMedia"] !== undefined;
  }

  public async addScreenShare(): Promise<void> {
    // tslint:disable-next-line: no-string-literal
    let width: number;
    let height: number;
    const dialogRef = this.dialog.open(ScreenQualityDialogComponent);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;
      switch (result) {
        case "AUTO":
          width = undefined;
          height = undefined;
          break;
        case "SD":
          width = 1280;
          height = 720;
          break;
        case "HD":
          width = 1920;
          height = 1080;
          break;
        case "4K":
          width = 3840;
          height = 2160;
          break;
      }
      // tslint:disable-next-line: no-string-literal
      const stream = await navigator.mediaDevices["getDisplayMedia"]({
        audio: false,
        video: {
          frameRate: 60,
          resizeMode: "crop-and-scale",
          width,
          height,
        },
      });
      this.conferenceService.addStream(stream);
      this.snackbarService.success("Screen share added");
    });
  }

  public async openNicknameDialog(): Promise<string> {
    const dialogRef = this.dialog.open(AddNicknameDialogComponent, {
      disableClose: true,
    });
    const nickname = await dialogRef.afterClosed().toPromise();
    if (!nickname) return;
    this.snackbarService.success(`Welcome ${nickname}!`);
    return nickname;
  }

  public trackByStreamState(
    index: number,
    participant: ParticipantStream
  ): string {
    const stream = participant.stream;
    if (!stream) return undefined;
    return participant.id + stream.active;
  }

  public async copyToClipboardShareLink(): Promise<void> {
    const shareLink = location.href;
    await navigator.clipboard.writeText(shareLink);
    return this.snackbarService.success("Lien copié dans le presse papier");
  }

  public triggerVisibility(): void {
    this.panelVisibility = !this.panelVisibility;
  }

  public isMicEnabled(stream: MediaStream): boolean {
    if (!stream) return;
    return stream.getAudioTracks()[0] && !stream.getAudioTracks()[0].enabled;
  }
}
