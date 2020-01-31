import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatExpansionModule
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule
  ]
})
export class HomeModule {}
