import { NgModule } from "@angular/core";
import { AddNicknameDialogComponent } from "./add-nickname-dialog.component";
import { CommonModule } from "@angular/common";
import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [AddNicknameDialogComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AddNicknameDialogModule {}
