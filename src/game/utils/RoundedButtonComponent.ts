import { Rect } from "../../framework/components/Component";
import Container from "../../framework/components/Container";
import LifecycleCallbackComponent from "../../framework/components/LifecycleCallbackComponent";
import TextComponent, {
  HorizontalAlignment,
  TextSettings,
  VerticalAlignment,
} from "../../framework/components/TextComponent";
import InterruptableAnimationController from "../../framework/controllers/InterruptableAnimationController";
import { MouseButton } from "../../framework/Game";

export default class RoundedButtonComponent extends Container {
  constructor(
    bounds: Rect,
    radius: number,
    fillColor: string,
    hoverColor: string,
    borderColor: string,
    borderWidth: number,
    onClick: () => void,
    labelText: string,
    textSettings: Partial<TextSettings> = {}
  ) {
    let hoverAnimation = new InterruptableAnimationController(
      "ease-in-out",
      200,
      0
    );
    const width = bounds.width - borderWidth * 2;
    const height = bounds.height - borderWidth * 2;
    const correctedRadius = Math.min(width / 2, height / 2, radius);
    super(
      [
        // Render the rounded rectangle
        (context: CanvasRenderingContext2D) => {
          context.beginPath();
          context.moveTo(borderWidth + correctedRadius, borderWidth);
          context.arcTo(
            width + borderWidth,
            borderWidth,
            width + borderWidth,
            height,
            correctedRadius
          );
          context.arcTo(
            width + borderWidth,
            height + borderWidth,
            borderWidth,
            height + borderWidth,
            correctedRadius
          );
          context.arcTo(
            borderWidth,
            height + borderWidth,
            borderWidth,
            borderWidth,
            correctedRadius
          );
          context.arcTo(
            borderWidth,
            borderWidth,
            width + borderWidth,
            borderWidth,
            correctedRadius
          );
          context.closePath();

          context.fillStyle = fillColor;
          context.fill();

          // Render the hover effect
          context.beginPath();
          context.moveTo(borderWidth + correctedRadius, borderWidth);
          context.arcTo(
            width + borderWidth,
            borderWidth,
            width + borderWidth,
            height,
            correctedRadius
          );
          context.arcTo(
            width + borderWidth,
            height + borderWidth,
            borderWidth,
            height + borderWidth,
            correctedRadius
          );
          context.arcTo(
            borderWidth,
            height + borderWidth,
            borderWidth,
            borderWidth,
            correctedRadius
          );
          context.arcTo(
            borderWidth,
            borderWidth,
            width + borderWidth,
            borderWidth,
            correctedRadius
          );
          context.closePath();

          const oldAlpha = context.globalAlpha;
          context.globalAlpha = oldAlpha * hoverAnimation.updateCallback();
          context.fillStyle = hoverColor;
          context.fill();
          context.globalAlpha = oldAlpha;

          if (borderWidth > 0) {
            context.lineWidth = borderWidth;
            context.strokeStyle = borderColor;
            context.stroke();
          }
        },
        // Add the label
        new TextComponent(
          labelText,
          {
            fontSize: 24,
            color: "#000",
            textAlign: HorizontalAlignment.Center,
            verticalAlign: VerticalAlignment.Middle,
            ...textSettings,
          },
          {
            x: 8,
            y: bounds.height / 2 - 12,
            width: bounds.width - 16,
            height: 24,
          }
        ),
        // Add a LifecycleCallbackComponent to handle clicks
        new LifecycleCallbackComponent(undefined, (updateInfo) => {
          const isWithinBounds =
            updateInfo.mouse.x >= 0 &&
            updateInfo.mouse.x <= bounds.width &&
            updateInfo.mouse.y >= 0 &&
            updateInfo.mouse.y <= bounds.height;

          const isWithinRoundedCorners = (() => {
            const { x, y } = updateInfo.mouse;
            const { width, height } = bounds;

            const isWithinCorner = (cornerX: number, cornerY: number) => {
              const dx = x - cornerX;
              const dy = y - cornerY;
              return dx * dx + dy * dy <= correctedRadius * correctedRadius;
            };

            if (x < correctedRadius && y < correctedRadius) {
              return isWithinCorner(correctedRadius, correctedRadius); // Top-left corner
            } else if (x > width - correctedRadius && y < correctedRadius) {
              return isWithinCorner(width - correctedRadius, correctedRadius); // Top-right corner
            } else if (x < correctedRadius && y > height - correctedRadius) {
              return isWithinCorner(correctedRadius, height - correctedRadius); // Bottom-left corner
            } else if (
              x > width - correctedRadius &&
              y > height - correctedRadius
            ) {
              return isWithinCorner(
                width - correctedRadius,
                height - correctedRadius
              ); // Bottom-right corner
            }

            return true; // Inside the rectangle excluding rounded corners
          })();

          if (isWithinBounds && isWithinRoundedCorners) {
            updateInfo.mouse.setCursor("pointer");
            if (hoverAnimation.currentTargetValue() !== 1) {
              hoverAnimation.animateTo(1);
            }
            if (updateInfo.mouse.clicked === MouseButton.Primary) onClick();
          } else {
            if (hoverAnimation.currentTargetValue() !== 0)
              hoverAnimation.animateTo(0);
          }
        }),
      ],
      bounds
    );
  }
}
