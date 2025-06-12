import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScreenResolutionService {
  resolution = signal<Resolution>(this.getResolution());

  constructor() {
    window.addEventListener('resize', () => {
      this.resolution.set(this.getResolution());
    });
  }

  getResolution(): Resolution {
    const width = window.innerWidth;
    const resolution =
      width < breakpoints[Resolution.Mobile]
        ? Resolution.Mobile
        : width < breakpoints[Resolution.Tablet]
        ? Resolution.Tablet
        : width < breakpoints[Resolution.Medium]
        ? Resolution.Medium
        : width < breakpoints[Resolution.Desktop]
        ? Resolution.Desktop
        : Resolution.WideScreen;
    return resolution;
  }

  isBiggerThan(resolution: Resolution): boolean {
    return (
      Object.keys(Resolution).indexOf(this.resolution()) >
      Object.keys(Resolution).indexOf(resolution)
    );
  }

  isSmallerOrEqualTo(resolution: Resolution): boolean {
    return (
      Object.keys(Resolution).indexOf(this.resolution()) <=
      Object.keys(Resolution).indexOf(resolution)
    );
  }
}

export enum Resolution {
  Mobile = 'Mobile',
  Tablet = 'Tablet',
  Medium = 'Medium',
  Desktop = 'Desktop',
  WideScreen = 'WideScreen',
}

const breakpoints = {
  [Resolution.Mobile]: 480,
  [Resolution.Tablet]: 768,
  [Resolution.Medium]: 1200,
  [Resolution.Desktop]: 1920,
};
