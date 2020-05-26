import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { FormControl, FormGroup, Validator } from "src/app/models";
import { RTCConfigurationService } from "src/app/services/rtc-configuration.service";
import { SnackBarService } from "src/app/services";

@Component({
  selector: "app-rtc-configuration-dialog",
  templateUrl: "./RTC-configuration-dialog.component.html",
  styleUrls: ["./RTC-configuration-dialog.component.scss"],
})
export class RTCConfigurationDialogComponent {
  public stunTurnUriControl: FormControl;
  public turnUsernameControl: FormControl;
  public turnPasswordControl: FormControl;
  public formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<RTCConfigurationDialogComponent>,
    private rtcConfigurationService: RTCConfigurationService,
    private snackbarService: SnackBarService
  ) {
    const RTCConfiguration = this.rtcConfigurationService.getRTCConfiguration();
    this.stunTurnUriControl = new FormControl(
      (RTCConfiguration && RTCConfiguration.stunTurnUri) || "",
      Validator.required("This field is required")
    );
    this.turnUsernameControl = new FormControl(
      (RTCConfiguration && RTCConfiguration.turnUsername) || ""
    );
    this.turnPasswordControl = new FormControl(
      (RTCConfiguration && RTCConfiguration.turnPassword) || ""
    );
    this.formGroup = new FormGroup({
      stunTurnUri: this.stunTurnUriControl,
      turnUsername: this.turnUsernameControl,
      turnPassword: this.turnPasswordControl,
    });
  }

  public submitRTCConfiguration(formGroup: FormGroup) {
    if (formGroup.invalid) {
      this.snackbarService.error("The form is invalid");
      return;
    }
    const { stunTurnUri, turnUsername, turnPassword } = formGroup.value;
    this.rtcConfigurationService.setRTCConfiguration(
      stunTurnUri,
      turnUsername,
      turnPassword
    );
    this.dialogRef.close({ stunTurnUri, turnPassword, turnUsername });
  }

  public close() {
    this.dialogRef.close();
  }
}
