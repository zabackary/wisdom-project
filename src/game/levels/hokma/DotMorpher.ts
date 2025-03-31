import { Rect } from "../../../framework/components/Component";
import Container from "../../../framework/components/Container";
import InterruptableAnimationController from "../../../framework/controllers/InterruptableAnimationController";
import TimeBasedAnimationController, {
  EASING_CURVES,
} from "../../../framework/controllers/TimeBasedAnimationController";

const DOT_RADIUS = 100;

export class DotMorpher extends Container {
  private animation: InterruptableAnimationController =
    new InterruptableAnimationController("ease-in-out", 5000, 0);
  private hueAnimation: TimeBasedAnimationController =
    new TimeBasedAnimationController("linear", 10000, 0, 360, true, true);
  private pulseAnimation: TimeBasedAnimationController =
    new TimeBasedAnimationController("linear", 2000, 0, 1, true, true);

  constructor(bounds: Rect, rectangleHeight: number) {
    super(
      [
        (ctx: CanvasRenderingContext2D) => {
          const pulse =
            1.0 +
            (this.pulseAnimation.value > 0.5
              ? EASING_CURVES["ease-in-out"](
                  (1 - this.pulseAnimation.value) * 2
                ) / 7
              : EASING_CURVES["ease-in-out"](this.pulseAnimation.value * 2) /
                7);
          const dotTop = bounds.height / 2 - DOT_RADIUS * pulse;
          const dotLeft = bounds.width / 2 - DOT_RADIUS * pulse;
          const dotWidth = DOT_RADIUS * pulse * 2;
          const dotHeight = DOT_RADIUS * pulse * 2;
          const dotBorderRadius = DOT_RADIUS * pulse;
          const rectTop = bounds.height - rectangleHeight;
          const rectLeft = 0;
          const rectWidth = bounds.width;
          const rectHeight = rectangleHeight;
          const rectBorderRadius = 0;

          const top = dotTop + (rectTop - dotTop) * this.animation.value;
          const left = dotLeft + (rectLeft - dotLeft) * this.animation.value;
          const width =
            dotWidth + (rectWidth - dotWidth) * this.animation.value;
          const height =
            dotHeight + (rectHeight - dotHeight) * this.animation.value;
          const borderRadius =
            dotBorderRadius +
            (rectBorderRadius - dotBorderRadius) * this.animation.value;
          const hue = this.hueAnimation.value;

          // Draw the rounded rectangle which will morph between circle and rect
          ctx.fillStyle = `hsl(${hue}, 50%, 50%)`;
          ctx.beginPath();
          ctx.arc(
            left + borderRadius,
            top + borderRadius,
            borderRadius,
            Math.PI,
            1.5 * Math.PI
          );
          ctx.lineTo(left + width - borderRadius, top);
          ctx.arc(
            left + width - borderRadius,
            top + borderRadius,
            borderRadius,
            1.5 * Math.PI,
            0
          );
          ctx.lineTo(left + width, top + height - borderRadius);
          ctx.arc(
            left + width - borderRadius,
            top + height - borderRadius,
            borderRadius,
            0,
            0.5 * Math.PI
          );
          ctx.lineTo(left + borderRadius, top + height);
          ctx.arc(
            left + borderRadius,
            top + height - borderRadius,
            borderRadius,
            0.5 * Math.PI,
            Math.PI
          );
          ctx.closePath();
          ctx.fill();
        },
      ],
      bounds
    );
    this.children.push(this.animation.listener());
    this.children.push(this.hueAnimation.listener());
    this.children.push(this.pulseAnimation.listener());
  }

  morphPlatform() {
    this.animation.animateTo(1);
  }

  morphDot() {
    this.animation.animateTo(0);
  }
}
