import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConferenceService } from "src/app/services/conference.service";
import { RemoteStream, LocalStream } from "src/app/models";

@Component({
  templateUrl: "./conference.component.html",
  styleUrls: ["./conference.component.scss"]
})
export class ConferenceComponent {
  public localStream: MediaStream;
  public focusedStream: MediaStream;
  constructor(
    private router: ActivatedRoute,
    private conferenceService: ConferenceService
  ) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.localStream = stream;
        this.focusedStream = stream;
        this.conferenceService.addStream(stream);
      });
    console.log(this.router.snapshot.params.id);
  }

  public getLocalStreams(): LocalStream[] {
    return this.conferenceService.getLocalParticipant().localStreams;
  }

  public getRemoteStreams(): RemoteStream[] {
    return this.conferenceService.getLocalParticipant().remoteStreams;
  }

  public closeStream(stream: MediaStream): void {
    // close stream
    console.log("close stream", stream);
  }

  public hangupConference(): void {
    // hang conference
    console.log("hang conference");
  }

  public enableMic(stream: MediaStream): void {
    // enable microphone
    console.log("enable microphone", stream);
  }

  public disableMic(stream: MediaStream): void {
    // disable microphone
    console.log("disable microphone", stream);
  }

  public addStream() {}

  public addScreenShare() {}
}
