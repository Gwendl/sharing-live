import { LocalStream } from "./localStream";
import { RemoteStream } from "./remoteStream";
import { Participant } from "./participant";

export class LocalParticipant implements Participant {
  public localStreams: LocalStream[];
  public nickname: string;
  public muted: boolean;
  public screenSharingEnabled: boolean;
  public remoteStreams: RemoteStream[];

  constructor(nickName: string) {
    this.nickname = nickName;
    this.localStreams = [];
    this.remoteStreams = [];
    this.screenSharingEnabled = false;
    this.muted = false;
  }
}
