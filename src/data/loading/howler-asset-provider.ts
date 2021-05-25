import { AssetProvider } from "./asset-provider";
import { Howl } from "howler";

export class HowlerAssetProvider implements AssetProvider<Howl> {
  readonly _paths: Map<string, string>;
  private _resources: Map<string, Howl>;
  private _progres = 0;
  _loader!: PIXI.Loader;

  public get resources(): Map<string, Howl> {
    return this._resources;
  }

  public get progress(): number {
    return this._progres;
  }

  constructor(paths: Map<string, string>) {
    this._paths = paths;
    this._resources = new Map<string, Howl>();
  }

  async load(): Promise<void> {
    const sounds = new Map<string, Howl>();
    this._paths.forEach((value: string, key: string) => {
      if (sounds.has(key)) return;
      sounds.set(key, new Howl({ src: value }));
    });
    this._resources = sounds;
  }

  public getResource(resourceName: string) {
    const resource = this.resources.get(resourceName);
    if (!resource)
      throw new Error("HowlerAssetProvider.getResource(): " + resourceName + " is not loaded in loader");
    
    return resource;
  }
}
