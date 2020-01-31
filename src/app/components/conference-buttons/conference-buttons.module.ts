import { NgModule } from "@angular/core";
import { ConferenceButtonsComponent } from "./conference-buttons.component";
import {
  MatIconModule,
  MatButtonModule,
  MatTooltipModule
} from "@angular/material";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [ConferenceButtonsComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  exports: [ConferenceButtonsComponent],
  providers: []
})
export class ConferenceButtonsModule {}
