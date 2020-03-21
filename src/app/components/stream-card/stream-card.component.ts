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
  @Input() public isFocused: boolean;
  @Output() public enableMicEmitter: EventEmitter<
    MediaStream
  > = new EventEmitter<MediaStream>();
  @Output() public disableMicEmitter: EventEmitter<
    MediaStream
  > = new EventEmitter<MediaStream>();
  @Output() public closeStreamEmitter: EventEmitter<string> = new EventEmitter<
    string
  >();
  @Output() public focusStreamEmitter: EventEmitter<
    MediaStream
  > = new EventEmitter<MediaStream>();
  public micMuted: boolean;

  public toogleMic(): void {
    this.micMuted
      ? this.enableMicEmitter.emit(this.inputStream.stream)
      : this.disableMicEmitter.emit(this.inputStream.stream);
    this.micMuted = !this.micMuted;
  }

  public closeStream(): void {
    this.closeStreamEmitter.emit(this.inputStream.id);
  }

  public focusVideo(): void {
    this.focusStreamEmitter.emit(this.inputStream.stream);
  }

  public stringToColor(nickname: string): string {
    return stringToRGBColor(nickname);
  }

  public hasVideo() : boolean {
    return this.inputStream.stream && this.inputStream.stream.getVideoTracks().length > 0;
  }

  public isLocalStream() : boolean {
    return this.inputStream.nickname === undefined;
  }
}
