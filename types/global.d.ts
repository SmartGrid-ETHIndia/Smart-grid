// global.d.ts
interface Window {
    google: typeof google;
    openGoogleMaps: (lat: number, lng: number) => void;
  }
  