import { RemoteStream } from "./remoteStream";

export interface Participant {
  nickname: string;
  muted: boolean;
  screenSharingEnabled: boolean;
}
