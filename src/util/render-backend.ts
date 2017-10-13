import { RenderData } from "../components/render-component";
import { Bounds } from "./shape";

export interface RenderBackendItem {
  x: number;
  y: number;
  width: number;
  height: number;
  render: RenderData;
}

export interface RenderBackend {
  add(data: RenderBackendItem): void;
  render(viewport: Bounds): void;
}
