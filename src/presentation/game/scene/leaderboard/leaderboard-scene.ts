import { Context } from "../../../context";
import { PixiScene } from "../pixi-scene";
import { PixiSceneManager } from "../pixi-scene-manager";
import * as PIXI from "pixi.js";
import { Observable, Subscription } from "rxjs";
import { LeaderboardEntry } from "../../../../data/leaderboard/leaderboard";

export class LeaderboardScene extends PixiScene {
  private div: HTMLElement;
  private querySubscription?: Subscription;
  private loadedEntries?: Array<LeaderboardEntry>;

  constructor(context: Context, manager: PixiSceneManager) {
    super(manager);
    this.div = document.createElement("div");
    this.draw(context);
  }

  async draw(context: Context) {
    const logoTexture = context.pixiAssetLoader.getResource("logo");
    const sprite = new PIXI.Sprite(logoTexture.texture);
    sprite.position.set(context.appSize.x * .5, context.appSize.x * .5 - 100);
    sprite.anchor.set(.5, .5);
    const whRatio = sprite.height / sprite.width;
    sprite.width = context.appSize.x * .7;
    sprite.height = sprite.width * whRatio;
    this.container.addChild(sprite);


    const html = `
    <div class="login-box">
      <h2>Leaderboard</h2>

      <div class="leaderboard-list">
        <table></table>
      </div>

      <button id="play-button">
        Play new game
      </button>
    </div>
    `;

    this.div.innerHTML = html;
    document.body.appendChild(this.div);

    const playButton = this.div.querySelector("#play-button");
    playButton?.addEventListener("click", _ => this.manager.goTo(2));

    const listElement = this.div.querySelector(".leaderboard-list");
    const tableElement = this.div.querySelector(".leaderboard-list table");
    if (!listElement || !tableElement)
      throw Error("missing leaderboard elements");

    const LOAD_STEP = 16;
    let loadNrOfEntries = LOAD_STEP;

    listElement.addEventListener("scroll", async _ => {

      if (listElement.scrollTop >= (listElement.scrollHeight - listElement.clientHeight - 10)) {
        
        if (loadNrOfEntries > (this.loadedEntries?.length || 0))
          return;

        loadNrOfEntries += LOAD_STEP;
        this.showList(context, loadNrOfEntries, tableElement);
      }
    });

    this.showList(context, loadNrOfEntries, tableElement);
  }

  async showList(context: Context, loadNrOfEntries: number, tableElement: Element) {

    this.querySubscription?.unsubscribe();

    const obs = await context.leaderboardRepo.listLeaderboard(null, loadNrOfEntries, "score", "desc");

    this.querySubscription = obs.subscribe(list => {

      this.loadedEntries = list;

      tableElement.innerHTML = `
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Score</th>
        <th>Time</th>
      </tr>
      `;

      let i = 0;
      list.forEach(entry => {
        tableElement.innerHTML += `
        
          <tr>
            <td>${++i}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${new Date(entry.time).toISOString().substr(11, 8)}</td>  // HH-MM-SS https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
          </tr>
        `;
      });
    });
  }

  async onDestroy(): Promise<void> {
    this.querySubscription?.unsubscribe();
    this.div?.remove();
  }
}
