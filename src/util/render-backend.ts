import { RenderData } from "../components/render-component";
import { Bounds } from "./shape";
import { Assets } from "./assets";

export interface RenderBackendItem {
  x: number;
  y: number;
  width: number;
  height: number;
  render: RenderData;
}

export interface RenderBackend {
  add(data: RenderBackendItem): void;
  render(viewport: Bounds, buffer: HTMLCanvasElement): void;
  assets(): Assets;
}
