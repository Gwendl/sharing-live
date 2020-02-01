import { NgModule } from "@angular/core";
import { ConferenceButtonsComponent } from "./conference-buttons.component";
import {
  MatIconModule,
  MatButtonModule,
  MatTooltipModule
} from "@angular/material";

@NgModule({
  declarations: [ConferenceButtonsComponent],
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  exports: [ConferenceButtonsComponent],
  providers: []
})
export class ConferenceButtonsModule {}
