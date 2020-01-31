import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { SnackType } from "src/app/models";
import { SnackBarComponent } from "../components/snack-bar/snack-bar.component";

@Injectable({
  providedIn: "root"
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public success(message: string, duration: number = 5000): void {
    this.create(message, SnackType.SUCCESS, duration);
  }

  public error(message: string, duration: number = 5000): void {
    this.create(message, SnackType.ERROR, duration);
  }

  private create(message: string, type: SnackType, duration: number): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration,
      verticalPosition: "top",
      data: message || "Undefined message",
      panelClass: [`wrapper-snackbar-${type}`, type]
    });
  }
}
