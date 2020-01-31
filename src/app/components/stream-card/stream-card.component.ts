import { Component, Input } from "@angular/core";

@Component({
  selector: "app-stream-card",
  templateUrl: "./stream-card.component.html",
  styleUrls: ["./stream-card.component.scss"]
})
export class StreamCardComponent {
  @Input()
  public stream: MediaStream;
  constructor() {}
}
