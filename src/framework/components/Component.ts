import Asset from "../Asset";
import { MouseButton } from "../Game";
import { Renderable } from "./FunctionComponent";

export interface UpdateInfo {
  mouse: {
    x: number;
    y: number;
    clicked?: MouseButton;
    setCursor: (cursor: string) => void;
  };
  keyboard: {
    pressedKey: string | null;
    pressingKeys: string[];
  };
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

let debug = false;

export function toggleDebug() {
  debug = !debug;
}

export async function translateBounds(
  context: CanvasRenderingContext2D,
  bounds: Rect,
  fn: () => Promise<void>,
  inverted: boolean = false,
  rotation: number = 0
) {
  context.save();
  context.translate(bounds.x, bounds.y);
  if (inverted) context.transform(-1, 0, 0, 1, bounds.width, 0);
  if (rotation !== 0) {
    context.translate(bounds.width / 2, bounds.height / 2);
    context.rotate(rotation);
    context.translate(-bounds.width / 2, -bounds.height / 2);
  }
  context.beginPath();
  context.rect(0, 0, bounds.width, bounds.height);
  context.clip();
  await fn();
  if (debug) {
    context.beginPath();
    context.rect(0, 0, bounds.width, bounds.height);
    context.strokeStyle = "red";
    context.lineWidth = 3;
    context.stroke();
  }
  context.restore();
}

export default abstract class Component {
  abstract get assets(): Asset[];
  abstract render(context: CanvasRenderingContext2D): Promise<void>;
  abstract update(updateInfo: UpdateInfo): void;
}

export type ComponentLike = Renderable | Renderable[];
