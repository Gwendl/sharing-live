import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConferenceService } from "src/app/services/conference.service";

@Component({
  templateUrl: "./conference.component.html",
  styleUrls: ["./conference.component.scss"]
})
export class ConferenceComponent {
  public localStreams: MediaStream[];
  public remoteStreams: MediaStream[];
  public focusStream: MediaStream;
  constructor(
    private router: ActivatedRoute,
    private conferenceService: ConferenceService
  ) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.focusStream = stream;
        this.conferenceService.addStream(stream);
      });
    console.log(this.router.snapshot.params.id);
  }

  public getLocalStreams(): MediaStream[] {
    return this.conferenceService
      .getLocalParticipant()
      .localStreams.map(localStream => localStream.stream);
  }

  public getRemoteStreams(): MediaStream[] {
    return this.conferenceService
      .getLocalParticipant()
      .remoteStreams.map(remoteStream => remoteStream.stream);
  }
}
