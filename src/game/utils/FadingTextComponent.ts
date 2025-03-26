import { UpdateInfo } from "../../framework/components/Component";
import Container from "../../framework/components/Container";
import InterruptableAnimationController from "../../framework/controllers/InterruptableAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH, FONT } from "../gameRoot";

export default class FadingTextComponent extends Container {
  private animationController: InterruptableAnimationController;

  public isShowing: boolean = false;

  constructor(title: string, private durationMs: number) {
    const animationController = new InterruptableAnimationController(
      "ease-in-out",
      1000,
      0
    );
    let checkContainer: Container;
    const animatedContainer = new Container(
      [
        (ctx) => {
          ctx.fillStyle = "#fff";
          ctx.font = `34px ${FONT}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        },
      ],
      {
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }
    );
    let backgroundAlpha = 0;
    super(
      [
        (ctx) => {
          const oldAlpha = ctx.globalAlpha;
          ctx.globalAlpha = oldAlpha * backgroundAlpha;
          ctx.fillStyle = "#000";
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
      backgroundAlpha = value * 0.3;
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
