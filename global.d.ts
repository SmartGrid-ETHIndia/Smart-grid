export {};

declare global {
  interface Window {
    google: typeof google;
    openGoogleMaps: (lat: number, lng: number) => void;
  }
}
