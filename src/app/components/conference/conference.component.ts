import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  templateUrl: "./conference.component.html",
  styleUrls: ["./conference.component.scss"]
})
export class ConferenceComponent {
  constructor(private router: ActivatedRoute) {
    console.log(this.router.snapshot.params.id);
  }
}
