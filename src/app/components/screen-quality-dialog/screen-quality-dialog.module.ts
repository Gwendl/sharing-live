import { NgModule } from "@angular/core";
import { ScreenQualityDialogComponent } from "./screen-quality-dialog.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [ScreenQualityDialogComponent],
  imports: [MatButtonToggleModule, MatIconModule, MatTooltipModule],
  exports: [],
  providers: [],
})
export class ScreenQualityDialogModule {}
