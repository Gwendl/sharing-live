import { NgModule } from "@angular/core";
import { ConferenceComponent } from "./conference.component";
import { StreamCardModule } from "../stream-card/stream-card.module";
import { CommonModule } from "@angular/common";
import { ConferenceButtonsModule } from "../conference-buttons/conference-buttons.module";

@NgModule({
  declarations: [ConferenceComponent],
  imports: [CommonModule, StreamCardModule, ConferenceButtonsModule]
})
export class ConferenceModule {}
