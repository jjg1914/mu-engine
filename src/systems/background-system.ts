import { Event } from "../engine/render";

export default function RenderSystem(event: Event): void {
  event.ctx.fillStyle = "#282828";
  event.ctx.strokeStyle = "#279CC3";
  event.ctx.fillRect(0, 0, event.width, event.height);

  let offset = (event.width % 32) / 2;

  for (let i = offset; i < event.width; i += 32) {
    event.ctx.beginPath();
    event.ctx.moveTo(i, 0);
    event.ctx.lineTo(i, event.height);
    event.ctx.stroke();
  }

  for (let i = 16; i < event.height; i += 32) {
    event.ctx.beginPath();
    event.ctx.moveTo(0, i);
    event.ctx.lineTo(event.width, i);
    event.ctx.stroke();
  }
}
