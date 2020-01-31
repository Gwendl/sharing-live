import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent, ConferenceComponent } from "../components";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  { path: "conference/:id", component: ConferenceComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
