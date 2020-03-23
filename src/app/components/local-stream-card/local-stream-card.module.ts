import { NgModule } from "@angular/core";
import { LocalStreamCardComponent } from "./local-stream-card.component";
import {
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule
} from "@angular/material";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [LocalStreamCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [LocalStreamCardComponent]
})
export class LocalStreamCardModule {}
