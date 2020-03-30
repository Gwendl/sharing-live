import { NgModule } from "@angular/core";
import { RemoteStreamCardComponent } from "./remote-stream-card.component";
import {
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule
} from "@angular/material";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [RemoteStreamCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [RemoteStreamCardComponent]
})
export class RemoteStreamCardModule {}
