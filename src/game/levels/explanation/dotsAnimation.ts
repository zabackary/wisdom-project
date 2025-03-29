import Container from "../../../framework/components/Container";
import ScrollingContainer from "../../../framework/components/ScrollingContainer";
import InterruptableAnimationController from "../../../framework/controllers/InterruptableAnimationController";
import TimeBasedAnimationController from "../../../framework/controllers/TimeBasedAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../gameRoot";

/**
 * A component that contains a grid of circles (dots) that zoom out into a large grid.
 * It is optimized for performance to draw hundreds of thousands of dots.
 */
export class DotsAnimation extends Container {
  private scaleAnimation: TimeBasedAnimationController;
  private rippleAnimation: TimeBasedAnimationController;
  private focusAnimation: TimeBasedAnimationController;
  private alphaAnimation: InterruptableAnimationController =
    new InterruptableAnimationController("ease-in-out", 1000, 0);
  private focusTargetX?: number;
  private focusTargetY?: number;
  private focusHue: number = 0;

  constructor(
    dotSize: number,
    dotSpacing: number,
    color: string,
    numRows: number,
    numCols: number
  ) {
    let container: ScrollingContainer;
    const targetScale = CANVAS_WIDTH / (numCols * (dotSize + dotSpacing));
    super(
      [
        (container = new ScrollingContainer(
          [
            (ctx: CanvasRenderingContext2D) => {
              const oldAlpha = ctx.globalAlpha;
              for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {
                  ctx.fillStyle = color;
                  const x = col * (dotSize + dotSpacing) + dotSize / 2;
                  const y = row * (dotSize + dotSpacing) + dotSize / 2;

                  ctx.globalAlpha =
                    oldAlpha *
                    Math.min(
                      Math.max(
                        this.rippleAnimation.value -
                          Math.sqrt(
                            (row * row + col * col) / (numRows * numCols)
                          ),
                        0
                      ),
                      1
                    );
                  ctx.beginPath();
                  ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
                  ctx.fill();

                  if (this.focusTargetX === col && this.focusTargetY === row) {
                    ctx.fillStyle = `hsl(${this.focusHue}, 100%, 50%)`;
                    ctx.globalAlpha = oldAlpha * this.focusAnimation.value;
                    ctx.beginPath();
                    ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                  }
                }
              }
              ctx.globalAlpha = oldAlpha;
            },
          ],
          {
            x: 0,
            y: 0,
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
          }
        )),
      ],
      {
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }
    );
    this.scaleAnimation = new TimeBasedAnimationController(
      "ease-in-out",
      2000,
      1,
      targetScale
    );
    this.rippleAnimation = new TimeBasedAnimationController(
      "ease-in",
      3000,
      0.5,
      2
    );
    this.children.push(this.scaleAnimation.listener());
    this.children.push(this.rippleAnimation.listener());
    this.scaleAnimation.observeWhileRunning((x) => {
      container.setZoom(x);
    });
    this.focusAnimation = new TimeBasedAnimationController(
      "ease-in-out",
      5000,
      0,
      1
    );
    this.focusAnimation.observeWhileRunning((x) => {
      if (this.focusTargetX !== undefined && this.focusTargetY !== undefined) {
        const finalScale = CANVAS_WIDTH / (dotSize + dotSpacing) / 5;
        const zoom = targetScale + (finalScale - targetScale) * x;

        // Calculate the scroll offsets to center the dot
        const targetX =
          -CANVAS_WIDTH / 2 / zoom +
          dotSize / 2 +
          (this.focusTargetX * (dotSize + dotSpacing)) / (zoom / finalScale);
        const targetY =
          -CANVAS_HEIGHT / 2 / zoom +
          dotSize / 2 +
          (this.focusTargetY * (dotSize + dotSpacing)) / (zoom / finalScale);

        // Calculate the scroll offsets to center the dot
        const offsetX = targetX * x;
        const offsetY = targetY * x;

        container.setScroll(offsetX, offsetY);
        container.setZoom(zoom);
      }
    });
    this.children.push(this.focusAnimation.listener());
    this.children.push(this.alphaAnimation.listener());
    this.alphaAnimation.observe((x) => {
      container.setOpacity(x);
    });
  }

  start() {
    this.scaleAnimation.start();
    this.rippleAnimation.start();
  }

  show() {
    this.alphaAnimation.animateTo(1);
  }

  hide() {
    this.alphaAnimation.animateTo(0);
  }

  removeFocus() {
    return new Promise<void>((resolve) => {
      this.focusAnimation.resetCallbacks();
      this.focusAnimation.rangeMin = 1;
      this.focusAnimation.rangeMax = 0;
      this.focusAnimation.start();
      this.focusAnimation.onFinish(() => {
        resolve();
      });
    });
  }

  setFocus(x: number, y: number) {
    return new Promise<void>((resolve) => {
      this.focusAnimation.resetCallbacks();
      this.focusHue = Math.floor(Math.random() * 360);
      this.alphaAnimation.animateTo(1);
      this.focusTargetX = x;
      this.focusTargetY = y;
      this.focusAnimation.rangeMin = 0;
      this.focusAnimation.rangeMax = 1;
      this.focusAnimation.value = 0;
      this.focusAnimation.start();
      this.focusAnimation.onFinish(() => {
        resolve();
      });
    });
  }
}
