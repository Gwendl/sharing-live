import { NgModule } from "@angular/core";
import { ConferenceComponent } from "./conference.component";
import { StreamCardModule } from "../stream-card/stream-card.module";

@NgModule({
  declarations: [ConferenceComponent],
  imports: [StreamCardModule]
})
export class ConferenceModule {}
