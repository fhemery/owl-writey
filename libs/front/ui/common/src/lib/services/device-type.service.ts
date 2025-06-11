import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScreenResolutionService {
  deviceType = signal<Resolution>(this.getResolution());

  constructor() {
    window.addEventListener('resize', () => {
      this.deviceType.set(this.getResolution());
    });
  }

  getResolution(): Resolution {
    const width = window.innerWidth;
    return width < breakpoints[Resolution.Mobile]
      ? Resolution.Mobile
      : width < breakpoints[Resolution.Tablet]
      ? Resolution.Tablet
      : width < breakpoints[Resolution.Medium]
      ? Resolution.Medium
      : width < breakpoints[Resolution.Desktop]
      ? Resolution.Desktop
      : Resolution.WideScreen;
  }
}

export enum Resolution {
  Mobile = 'Mobile',
  Tablet = 'Tablet',
  Medium = 'Medium',
  Desktop = 'Desktop',
  WideScreen = 'Widescreen',
}

const breakpoints = {
  [Resolution.Mobile]: 480,
  [Resolution.Tablet]: 768,
  [Resolution.Medium]: 1200,
  [Resolution.Desktop]: 1920,
};
