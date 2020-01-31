import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./core/app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomeModule, SnackBarModule } from "./components";
import { SnackBarComponent } from "./components";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HomeModule,
    SnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SnackBarComponent]
})
export class AppModule {}
