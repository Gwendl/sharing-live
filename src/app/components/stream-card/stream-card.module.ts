import { NgModule } from "@angular/core";
import { StreamCardComponent } from "./stream-card.component";
import {
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule
} from "@angular/material";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [StreamCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [StreamCardComponent]
})
export class StreamCardModule {}
