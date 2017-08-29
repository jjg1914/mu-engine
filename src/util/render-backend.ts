import { RenderData } from "../components/render-component";
import { Bounds } from "./shape";

export interface RenderBackend {
  add(data: RenderData): void;
  render(viewport: Bounds): void;
}
