import { Component, Input, Output, EventEmitter } from "@angular/core";
import { RemoteStream, LocalStream } from "src/app/models";
import { stringToRGBColor } from "../utils/string-to-color";

@Component({
  selector: "app-stream-card",
  templateUrl: "./stream-card.component.html",
  styleUrls: ["./stream-card.component.scss"]
})
export class StreamCardComponent {
  @Input()
  public inputStream: LocalStream & RemoteStream;
  @Output() public enableMicEmitter: EventEmitter<
    MediaStream
  > = new EventEmitter<MediaStream>();
  @Output() public disableMicEmitter: EventEmitter<
    MediaStream
  > = new EventEmitter<MediaStream>();
  @Output() public closeStreamEmitter: EventEmitter<
    MediaStream
  > = new EventEmitter<MediaStream>();
  public micMuted: boolean;
  constructor() {}

  public toogleMic(stream: MediaStream) {
    this.micMuted
      ? this.enableMicEmitter.emit(stream)
      : this.disableMicEmitter.emit(stream);
    this.micMuted = !this.micMuted;
  }

  public closeStream(stream: MediaStream) {
    this.closeStreamEmitter.emit(stream);
  }

  public stringToColor(nickname: string): string {
    return stringToRGBColor(nickname);
  }
}
