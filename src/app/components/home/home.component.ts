import { Component } from "@angular/core";
import { FormGroup, FormControl, Validator } from "src/app/models";
import { SnackBarService } from "src/app/services";
import { ConferenceService } from "src/app/services";
import { MatDialog } from "@angular/material";
import { RTCConfigurationDialogComponent } from "../RTC-configuration-dialog/RTC-configuration-dialog.component";

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  public createRoomFormGroup: FormGroup;
  public createRoomNickNameControl: FormControl;
  public joinRoomFormGroup: FormGroup;
  public roomIdControl: FormControl;
  public joinRoomNicknameControl: FormControl;
  constructor(
    private snackbarService: SnackBarService,
    private conferenceService: ConferenceService,
    private dialog: MatDialog
  ) {
    this.createRoomNickNameControl = new FormControl(
      "",
      Validator.required("Ce champ est requis")
    );
    this.joinRoomNicknameControl = new FormControl(
      "",
      Validator.required("Ce champ est requis")
    );
    this.roomIdControl = new FormControl(
      "",
      Validator.required("Ce champ est requis")
    );
    this.createRoomFormGroup = new FormGroup({
      nickname: this.createRoomNickNameControl,
    });
    this.joinRoomFormGroup = new FormGroup({
      roomId: this.roomIdControl,
      nickname: this.joinRoomNicknameControl,
    });
  }

  public openRtcConfigurationDialog(): void {
    const dialogRef = this.dialog.open(RTCConfigurationDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.snackbarService.success("RTC configuration saved");
    });
  }

  public submitCreateRoom(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {
      this.snackbarService.error("Le formulaire est invalide");
      return;
    }
    const { nickname } = form.value;
    this.conferenceService
      .connect()
      .then(() => this.conferenceService.createConference(nickname));
  }

  public submitJoinRoom(form: FormGroup): void {
    form.markAllAsTouched();
    if (form.invalid) {
      this.snackbarService.error("Le formulaire est invalide");
      return;
    }
    const { roomId, nickname } = form.value;
    this.conferenceService
      .connect()
      .then(() => this.conferenceService.joinConference(roomId, nickname));
  }
}
