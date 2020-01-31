import { RTCConnection } from "light-rtc";

export interface ParticipantConnection {
  connection: RTCConnection;
  id: string;
  nickname: string;
}
