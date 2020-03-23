import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material";
import { ConferenceComponent } from "./conference.component";
import { RemoteStreamCardModule } from "../remote-stream-card/remote-stream-card.module";
import { LocalStreamCardModule } from "../local-stream-card/local-stream-card.module";
import { ConferenceButtonsModule } from "../conference-buttons/conference-buttons.module";
import { AddStreamDialogModule } from "../add-stream-dialog/add-stream-dialog.module";
import { AddNicknameDialogModule } from "../add-nickname-dialog/add-nickname-dialog.module";
import { AddStreamDialogComponent } from "../add-stream-dialog/add-stream-dialog.component";
import { AddNicknameDialogComponent } from "../add-nickname-dialog/add-nickname-dialog.component";

@NgModule({
  declarations: [ConferenceComponent],
  imports: [
    CommonModule,
    RemoteStreamCardModule,
    LocalStreamCardModule,
    ConferenceButtonsModule,
    MatDialogModule,
    AddStreamDialogModule,
    AddNicknameDialogModule
  ],
  entryComponents: [AddStreamDialogComponent, AddNicknameDialogComponent]
})
export class ConferenceModule {}
