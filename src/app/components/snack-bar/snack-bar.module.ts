import { NgModule } from "@angular/core";
import { SnackBarComponent } from "./snack-bar.component";
import { MatSnackBarModule } from "@angular/material";
import { SnackBarService } from "src/app/services";

@NgModule({
  declarations: [SnackBarComponent],
  providers: [SnackBarService],
  imports: [MatSnackBarModule]
})
export class SnackBarModule {}
