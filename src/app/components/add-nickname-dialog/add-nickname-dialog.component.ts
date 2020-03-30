import { Component } from "@angular/core";
import { FormGroup, FormControl, Validator } from "src/app/models";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { SnackBarService } from "src/app/services";

@Component({
  selector: "app-add-nickname-dialog",
  templateUrl: "./add-nickname-dialog.component.html",
  styleUrls: ["./add-nickname-dialog.component.scss"]
})
export class AddNicknameDialogComponent {
  public formGroup: FormGroup;
  public nicknameControl: FormControl;
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<AddNicknameDialogComponent>,
    private snackbarService: SnackBarService
  ) {
    const nickname = localStorage.getItem("nickname");
    this.nicknameControl = new FormControl(
      nickname,
      Validator.required("This field is required")
    );
    this.formGroup = new FormGroup({
      nickname: this.nicknameControl
    });
  }

  public async backToHome(): Promise<void> {
    await this.router.navigate(["/"]);
    this.dialogRef.close();
  }

  public submitNickname(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {
      this.snackbarService.error("The form is invalid");
      return;
    }
    const { nickname } = form.value;
    localStorage.setItem("nickname", nickname);
    this.dialogRef.close(nickname);
  }
}
