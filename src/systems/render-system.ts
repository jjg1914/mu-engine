import { RenderEntity } from "../util/render-backend";
import { RenderEventData } from "../events/render-event";

export function RenderSystem(entity: RenderEntity): void {
  entity.on("render", (event: RenderEventData) => {
    event.backend.add(entity);
  });
}
