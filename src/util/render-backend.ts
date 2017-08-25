import { PositionEntity } from "./shape";
import { RenderData } from "../components/render-component";
import { Bounds } from "./shape";

export interface RenderEntity extends PositionEntity {
  render: RenderData;
}

export interface RenderBackend {
  add(entity: RenderEntity): void;
  render(viewport: Bounds): void;
}
