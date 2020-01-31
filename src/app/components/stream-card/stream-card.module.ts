import { NgModule } from "@angular/core";
import { StreamCardComponent } from "./stream-card.component";
import { MatCardModule, MatButtonModule } from "@angular/material";

@NgModule({
  declarations: [StreamCardComponent],
  imports: [MatCardModule, MatButtonModule],
  exports: [StreamCardComponent]
})
export class StreamCardModule {}
