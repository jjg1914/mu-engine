import { Assets } from "../util/assets";
import { Stage } from "../util/stage";

export interface StageData {
  name: string;
  assets: Assets;
  stage: Stage;
  gravity: number;
}

export class StageComponent implements StageData {
  name: string;
  assets: Assets;
  stage: Stage;
  gravity: number;

  constructor(options?: Partial<StageData>) {
    this.name = "";
    this.assets = new Assets();
    this.stage = new Stage(0, 0);
    this.gravity = 0;

    Object.assign(this, options);
  }
}
