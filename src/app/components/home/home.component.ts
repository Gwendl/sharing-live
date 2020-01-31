import { Component } from "@angular/core";
import { FormGroup, FormControl, Validator } from "src/app/models";
import { SnackBarService } from "src/app/services";

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
  public createRoomFormGroup: FormGroup;
  public nicknameControl: FormControl;
  public joinRoomFormGroup: FormGroup;
  public roomIdControl: FormControl;
  constructor(private snackbarService: SnackBarService) {
    this.nicknameControl = new FormControl(
      "",
      Validator.required("Ce champ est requis")
    );
    this.roomIdControl = new FormControl(
      "",
      Validator.required("Ce champ est requis")
    );

    this.createRoomFormGroup = new FormGroup({
      nickname: this.nicknameControl
    });

    this.joinRoomFormGroup = new FormGroup({
      roomId: this.roomIdControl
    });
  }

  public submitCreateRoom(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {
      this.snackbarService.error("Le formulaire est invalide");
      return;
    }
    console.log(form.value);
    // call
  }

  public submitJoinRoom(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {
      this.snackbarService.error("Le formulaire est invalide");
      return;
    }
    console.log(form.value);
    // call
  }
}
