import { Howl, Howler } from "howler";
import { AssetRepository } from "../../../data/loading/asset-repository";

export class AudioManager {
  private _howlResources: Map<string, Howl>;

  constructor() {
    Howler.usingWebAudio = true;
    Howler.autoSuspend = false;
    this._howlResources = new Map<string, Howl>();
  }

  public async loadSounds(howlerAssetRepo: AssetRepository<Howl>) {
    await howlerAssetRepo.load();
    this._howlResources = howlerAssetRepo.resources();
  }

  public playSound(query: string): void {
    if (!this._howlResources.has(query)) return;
    this._howlResources.get(query)?.play();
  }

  public loopSound(query: string, loop = true): void {
    if (!this._howlResources.has(query)) return;
    this._howlResources.get(query)?.loop(loop);
  }

  public stopSound(query: string): void {
    if (!this._howlResources.has(query)) return;
    this._howlResources.get(query)?.stop();
  }

  public pauseSound(query: string): void {
    if (!this._howlResources.has(query)) return;
    this._howlResources.get(query)?.pause();
  }

  public muteSound(query: string): void {
    if (!this._howlResources.has(query)) return;
    this._howlResources.get(query)?.mute();
  }
}
