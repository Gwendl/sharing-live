import { NgModule } from "@angular/core";
import { ConferenceComponent } from "./conference.component";
import { StreamCardModule } from "../stream-card/stream-card.module";
import { MatButtonModule } from "@angular/material";

@NgModule({
  declarations: [ConferenceComponent],
  imports: [StreamCardModule, MatButtonModule]
})
export class ConferenceModule {}
