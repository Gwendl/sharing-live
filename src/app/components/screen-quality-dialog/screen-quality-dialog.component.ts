import { Component } from "@angular/core";
import { MatDialogRef, MatButtonToggleChange } from "@angular/material";

@Component({
  selector: "app-screen-quality-dialog",
  templateUrl: "./screen-quality-dialog.component.html",
  styleUrls: ["./screen-quality-dialog.component.scss"],
})
export class ScreenQualityDialogComponent {
  constructor(private dialogRef: MatDialogRef<ScreenQualityDialogComponent>) {}

  public close(): void {
    this.dialogRef.close();
  }

  public onDesiredQualityChange(qualityChange: MatButtonToggleChange): void {
    this.dialogRef.close(qualityChange.value);
  }
}
