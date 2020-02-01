import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-conference-buttons",
  templateUrl: "./conference-buttons.component.html",
  styleUrls: ["./conference-buttons.component.scss"]
})
export class ConferenceButtonsComponent {
  @Output() public hangupConferenceEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  @Output() public addStreamEmitter: EventEmitter<void> = new EventEmitter<
    void
  >();

  @Output() public addScreenShareEmitter: EventEmitter<void> = new EventEmitter<
    void
  >();

  public hangupConference(): void {
    this.hangupConferenceEmitter.emit();
  }

  public addStream(): void {
    this.addStreamEmitter.emit();
  }

  public addScreenShare(): void {
    this.addScreenShareEmitter.emit();
  }
}
