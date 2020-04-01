import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-conference-buttons",
  templateUrl: "./conference-buttons.component.html",
  styleUrls: ["./conference-buttons.component.scss"]
})
export class ConferenceButtonsComponent {
  public displayedActions: boolean = false;
  public panelVisible: boolean = true;
  @Output() public hangupConferenceEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  @Output() public addStreamEmitter: EventEmitter<void> = new EventEmitter<
    void
  >();

  @Output() public addScreenShareEmitter: EventEmitter<void> = new EventEmitter<
    void
  >();

  @Output() public copyToClipBoardEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  @Output() public triggerVisibilityEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  @Output() public fullScreenEmitter: EventEmitter<void> = new EventEmitter<
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

  public copyToClipboardShareLink(): void {
    this.copyToClipBoardEmitter.emit();
  }

  public triggerVisibility(): void {
    this.panelVisible = !this.panelVisible;
    this.triggerVisibilityEmitter.emit();
  }

  public enterInFullScreen(): void {
    this.fullScreenEmitter.emit();
  }

  public triggerActions(): void {
    this.displayedActions = !this.displayedActions;
  }
}
