import { HOMEPAGE_PRIMARY_READY_EVENT } from "./constants";

export { HOMEPAGE_PRIMARY_READY_EVENT };

let homepagePrimaryReadySignaled = false;

export function signalHomepagePrimaryReady(): void {
  if (homepagePrimaryReadySignaled || typeof window === "undefined") return;
  homepagePrimaryReadySignaled = true;
  window.dispatchEvent(new CustomEvent(HOMEPAGE_PRIMARY_READY_EVENT));
}

export function isHomepagePrimaryReadySignaled(): boolean {
  return homepagePrimaryReadySignaled;
}

export function resetHomepagePrimaryReadySignal(): void {
  homepagePrimaryReadySignaled = false;
}
