import { Injectable } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

export enum ScreenSize {
  MOBILE = "mobile",
  TABLET = "tablet",
  WEB = "web"
}

@Injectable({
  providedIn: "root"
})
export class LayoutService {
  public screenSize: ScreenSize = ScreenSize.WEB;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.updateLayoutType();
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .subscribe(res => {
        this.updateLayoutType();
      });
  }

  private updateLayoutType(): void {
    if (
      this.breakpointObserver.isMatched([Breakpoints.Small, Breakpoints.XSmall])
    )
      this.screenSize = ScreenSize.MOBILE;
    if (this.breakpointObserver.isMatched([Breakpoints.Medium]))
      this.screenSize = ScreenSize.TABLET;
    if (
      this.breakpointObserver.isMatched([Breakpoints.Large, Breakpoints.XLarge])
    )
      this.screenSize = ScreenSize.WEB;
  }

  public isMobile(): boolean {
    return this.screenSize === ScreenSize.MOBILE;
  }
}
