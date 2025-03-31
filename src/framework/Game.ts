import Component, {
  ComponentLike,
  toggleDebug,
  UpdateInfo,
} from "./components/Component";
import { normalizeComponent } from "./components/FunctionComponent";
import warpCtx from "./effects/warpCtx";

let globalWarp = 0;

export function setGlobalWarp(deg: number) {
  globalWarp = deg;
}

export enum MouseButton {
  Primary = 0,
  Secondary = 2,
  Middle = 1,
}

export default class Game {
  private context: CanvasRenderingContext2D;

  private mouseClickedEventQueue: MouseButton[] = [];
  private keyboardEventQueue: string[] = [];
  private pressingKeys: string[] = [];

  private mouseX: number = -1;
  private mouseY: number = -1;

  private rootComponent: Component;

  private scaleFactor: number = window.devicePixelRatio;

  constructor(private canvas: HTMLCanvasElement, rootComponent: ComponentLike) {
    this.rootComponent = normalizeComponent(rootComponent);
    canvas.width = canvas.offsetWidth * this.scaleFactor;
    canvas.height = canvas.offsetHeight * this.scaleFactor;
    this.context = canvas.getContext("2d")!;
  }

  registerHandlers() {
    const handleMouseEvent = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const button = e.button;
      this.mouseClickedEventQueue.push(button);
    };
    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    this.canvas.addEventListener("mouseup", handleMouseEvent);
    window.addEventListener("keydown", (e) => {
      this.keyboardEventQueue.push(e.key);
      if (!this.pressingKeys.includes(e.key)) this.pressingKeys.push(e.key);
    });
    window.addEventListener("keyup", (e) => {
      this.pressingKeys.splice(this.pressingKeys.indexOf(e.key), 1);
    });
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouseX = e.offsetX;
      this.mouseY = e.offsetY;
    });
  }

  async gameLoop() {
    this.context.reset();
    this.context.scale(this.scaleFactor, this.scaleFactor);
    this.context.fillStyle = "#fff";
    this.context.fillRect(
      0,
      0,
      this.canvas.width / this.scaleFactor,
      this.canvas.height / this.scaleFactor
    );
    this.context.imageSmoothingEnabled = false;
    this.canvas.style.cursor = "initial";
    const updateInfo: UpdateInfo = {
      mouse: {
        x: this.mouseX,
        y: this.mouseY,
        clicked: this.mouseClickedEventQueue.pop(),
        setCursor: (cursor: string) => {
          this.canvas.style.cursor = cursor;
        },
      },
      keyboard: {
        pressedKey: this.keyboardEventQueue.pop() ?? null,
        pressingKeys: this.pressingKeys,
      },
    };
    // for debugging
    if (updateInfo.mouse.clicked === MouseButton.Middle) {
      toggleDebug();
    }
    this.rootComponent.update(updateInfo);
    await this.rootComponent.render(this.context);
    if (globalWarp !== 0) {
      warpCtx(this.context, this.context.canvas.height / 2, globalWarp, 0, 0);
    }
  }

  async loadAssets(statusCallback: (fraction: number) => void = () => {}) {
    let loadedCount = 0;
    statusCallback(0);
    await Promise.all(
      this.rootComponent.assets.map(async (asset) => {
        await asset.load();
        loadedCount += 1;
        statusCallback(loadedCount / this.rootComponent.assets.length);
      })
    );
    statusCallback(1);
  }

  async start() {
    await this.loadAssets();
    console.info("all assets loaded, starting loop");
    this.registerHandlers();
    const loop = async () => {
      await this.gameLoop();
      window.requestAnimationFrame(loop);
    };
    loop();
  }
}
