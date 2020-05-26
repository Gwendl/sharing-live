import { NgModule } from "@angular/core";
import { ConferenceComponent } from "./conference.component";
import { StreamCardModule } from "../stream-card/stream-card.module";
import { CommonModule } from "@angular/common";
import { ConferenceButtonsModule } from "../conference-buttons/conference-buttons.module";
import { MatDialogModule } from "@angular/material";
import { AddStreamDialogComponent } from "../add-stream-dialog/add-stream-dialog.component";
import { AddStreamDialogModule } from "../add-stream-dialog/add-stream-dialog.module";
import { AddNicknameDialogComponent } from "../add-nickname-dialog/add-nickname-dialog.component";
import { AddNicknameDialogModule } from "../add-nickname-dialog/add-nickname-dialog.module";
import { ScreenQualityDialogModule } from "../screen-quality-dialog/screen-quality-dialog.module";
import { ScreenQualityDialogComponent } from "../screen-quality-dialog/screen-quality-dialog.component";

@NgModule({
  declarations: [ConferenceComponent],
  imports: [
    CommonModule,
    StreamCardModule,
    ConferenceButtonsModule,
    MatDialogModule,
    AddStreamDialogModule,
    ScreenQualityDialogModule,
    AddNicknameDialogModule,
  ],
  entryComponents: [
    AddStreamDialogComponent,
    AddNicknameDialogComponent,
    ScreenQualityDialogComponent,
  ],
})
export class ConferenceModule {}
