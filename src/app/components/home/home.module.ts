import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";
import { RTCConfigurationDialogModule } from "../RTC-configuration-dialog/RTC-configuration-dialog.module";
import { RTCConfigurationDialogComponent } from "../RTC-configuration-dialog/RTC-configuration-dialog.component";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    RTCConfigurationDialogModule,
  ],
  entryComponents: [RTCConfigurationDialogComponent],
})
export class HomeModule {}
