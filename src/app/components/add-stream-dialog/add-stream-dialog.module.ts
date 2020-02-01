import { NgModule } from "@angular/core";
import { AddStreamDialogComponent } from "./add-stream-dialog.component";
import {
  MatFormFieldModule,
  MatButtonModule,
  MatSelectModule
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [AddStreamDialogComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule
  ],
  exports: []
})
export class AddStreamDialogModule {}
