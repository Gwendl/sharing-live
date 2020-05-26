import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class RTCConfigurationService {
  private stunTurnUri: string;
  private turnUsername: string;
  private turnPassword: string;

  public setRTCConfiguration(
    stunTurnUri: string,
    turnUsername: string,
    turnPassword: string
  ): void {
    this.stunTurnUri = stunTurnUri;
    this.turnUsername = turnUsername;
    this.turnPassword = turnPassword;
    const RTCConfiguration = {
      stunTurnUri: this.stunTurnUri,
      turnUsername: this.turnUsername,
      turnPassword: this.turnPassword,
    };
    localStorage.setItem("RTCConfiguration", JSON.stringify(RTCConfiguration));
  }

  public getRTCConfiguration(): {
    stunTurnUri: string;
    turnUsername: string;
    turnPassword: string;
  } {
    const RTCConfiguration: {
      stunTurnUri: string;
      turnUsername: string;
      turnPassword: string;
    } = JSON.parse(localStorage.getItem("RTCConfiguration"));
    return RTCConfiguration;
  }
}
