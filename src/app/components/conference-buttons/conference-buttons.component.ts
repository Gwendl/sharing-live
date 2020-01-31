import { Component } from "@angular/core";

@Component({
  selector: "app-conference-buttons",
  templateUrl: "./conference-buttons.component.html",
  styleUrls: ["./conference-buttons.component.scss"]
})
export class ConferenceButtonsComponent {
  public isMuted: boolean = false;

  public toggleMic() {
    this.isMuted = !this.isMuted;
  }
}
