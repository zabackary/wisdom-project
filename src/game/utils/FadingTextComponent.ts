import { UpdateInfo } from "../../framework/components/Component";
import Container from "../../framework/components/Container";
import InterruptableAnimationController from "../../framework/controllers/InterruptableAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH, FONT } from "../gameRoot";
import { wrapCanvasLines } from "./MessageComponent";

export default class FadingTextComponent extends Container {
  private animationController: InterruptableAnimationController;

  public isShowing: boolean = false;

  constructor(
    title: string,
    private durationMs: number,
    public fontSize: number = 34,
    public textColor: string = "#fff",
    public backgroundColor: string = "#000",
    public backgroundAlpha: number = 0.3
  ) {
    const animationController = new InterruptableAnimationController(
      "ease-in-out",
      1000,
      0
    );
    const animatedContainer = new Container(
      [
        (ctx) => {
          ctx.fillStyle = this.textColor;
          ctx.font = `${this.fontSize}px ${FONT}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const lines = wrapCanvasLines(ctx, title, CANVAS_WIDTH - 40);
          lines.forEach((line, index) => {
            ctx.fillText(
              line,
              CANVAS_WIDTH / 2,
              CANVAS_HEIGHT / 2 + (index - lines.length / 2) * 40 + 20
            );
          });
        },
      ],
      {
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }
    );
    let alphaAnimation = 0;
    super(
      [
        (ctx) => {
          const oldAlpha = ctx.globalAlpha;
          ctx.globalAlpha = oldAlpha * this.backgroundAlpha * alphaAnimation;
          ctx.fillStyle = this.backgroundColor;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          ctx.globalAlpha = oldAlpha;
        },
        animatedContainer,
        animationController.listener(),
      ],
      {
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }
    );
    animationController.observe((value) => {
      animatedContainer.setBounds({
        x: 0,
        y: 30 * (1 - value),
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      });
      animatedContainer.setOpacity(value);
      alphaAnimation = value;
      animatedContainer.setDisableChildUpdates(value === 0);
    });
    this.animationController = animationController;
  }

  update(updateInfo: UpdateInfo): void {
    super.update(updateInfo);
    if (this.isShowing) {
      if (updateInfo.keyboard.pressedKey === "Escape") {
        this.hide();
      }
    }
  }

  show() {
    this.isShowing = true;
    this.animationController.animateTo(1);
    setTimeout(() => {
      this.hide();
    }, this.durationMs);
  }

  hide() {
    if (this.isShowing) {
      this.isShowing = false;
      this.animationController.animateTo(0);
      this.closeObservers.forEach((item) => item());
    }
  }

  toggle() {
    if (this.isShowing) {
      this.hide();
    } else {
      this.show();
    }
  }

  private closeObservers: (() => void)[] = [];
  onClose(callback: () => void): this {
    this.closeObservers.push(callback);
    return this;
  }
}
