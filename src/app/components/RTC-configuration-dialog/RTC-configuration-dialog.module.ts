import { NgModule } from "@angular/core";
import { RTCConfigurationDialogComponent } from "./RTC-configuration-dialog.component";
import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [RTCConfigurationDialogComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  exports: [],
  providers: [],
})
export class RTCConfigurationDialogModule {}
