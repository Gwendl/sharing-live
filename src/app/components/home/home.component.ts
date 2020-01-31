import { Component } from "@angular/core";
import { FormGroup, FormControl, Validator } from "src/app/models";
import { SnackBarService } from "src/app/services";
import { ConferenceService } from "src/app/services";

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
  public createRoomFormGroup: FormGroup;
  public createRoomNickNameControl: FormControl;
  public joinRoomFormGroup: FormGroup;
  public roomIdControl: FormControl;
  public joinRoomNicknameControl: FormControl;
  constructor(
    private snackbarService: SnackBarService,
    private conferenceService: ConferenceService
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
      nickname: this.createRoomNickNameControl
    });
    this.joinRoomFormGroup = new FormGroup({
      roomId: this.roomIdControl,
      nickname: this.joinRoomNicknameControl
    });
    this.conferenceService
      .connect()
      .then(() => this.conferenceService.createConference("Matthieu"));
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

  public submitJoinRoom(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {
      this.snackbarService.error("Le formulaire est invalide");
      return;
    }
    const { roomId } = form.value;
    this.conferenceService
      .connect()
      .then(() => this.conferenceService.joinConference(roomId, "test"));
  }
}
