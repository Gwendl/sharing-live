import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { FormGroup, FormControl, Validator } from "src/app/models";
import { SnackBarService } from "src/app/services";

@Component({
  selector: "app-add-stream-dialog",
  templateUrl: "./add-stream-dialog.component.html",
  styleUrls: ["./add-stream-dialog.component.scss"]
})
export class AddStreamDialogComponent implements OnInit {
  public formGroup: FormGroup;
  public videoInputControl: FormControl;
  public audioInputControl: FormControl;
  public devices: MediaDeviceInfo[] = [];
  constructor(
    private dialogRef: MatDialogRef<AddStreamDialogComponent>,
    private snackbarService: SnackBarService
  ) {
    this.videoInputControl = new FormControl(undefined);
    this.audioInputControl = new FormControl(undefined);

    this.formGroup = new FormGroup({
      videoDeviceId: this.videoInputControl,
      audioDeviceId: this.audioInputControl
    });
  }

  public async ngOnInit(): Promise<void> {
    this.devices = await this.getDevices();
  }

  private async getDevices(): Promise<MediaDeviceInfo[]> {
    return await navigator.mediaDevices.enumerateDevices();
  }

  public getVideoDevices(): MediaDeviceInfo[] {
    return this.devices.filter(
      (device: MediaDeviceInfo) => device.kind === "videoinput"
    );
  }

  public getAudioDevices(): MediaDeviceInfo[] {
    return this.devices.filter(
      (device: MediaDeviceInfo) => device.kind === "audioinput"
    );
  }

  public close(): void {
    this.dialogRef.close();
  }

  public submitAddStream(form: FormGroup): void {
    const { videoDeviceId, audioDeviceId } = form.value;
    if (!videoDeviceId && !audioDeviceId) return;
    navigator.mediaDevices
      .getUserMedia({
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : false,
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : false
      })
      .then(stream => this.dialogRef.close(stream))
      .catch(e => {
        this.dialogRef.close();
        this.snackbarService.error(e.error);
      });
  }
}
