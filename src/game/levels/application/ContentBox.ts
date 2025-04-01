import Container from "../../../framework/components/Container";
import TextComponent, {
  HorizontalAlignment,
  VerticalAlignment,
} from "../../../framework/components/TextComponent";
import InterruptableAnimationController from "../../../framework/controllers/InterruptableAnimationController";

export default class ContentBox extends Container {
  private animation = new InterruptableAnimationController("ease-out", 1000, 0);

  constructor(
    content: string,
    rect: { x: number; y: number; width: number; height: number }
  ) {
    let text: TextComponent;
    super(
      [
        (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(rect.width / 2, rect.height / 2);
          ctx.scale(this.animation.value, this.animation.value);
          ctx.translate(-rect.width / 2, -rect.height / 2);
          const borderWidth = 20;
          const width = rect.width - borderWidth * 2;
          const height = rect.height - borderWidth * 2;
          const correctedRadius = Math.min(width / 2, height / 2, 20);
          const fillColor = "#fff";
          ctx.beginPath();
          ctx.moveTo(borderWidth + correctedRadius, borderWidth);
          ctx.arcTo(
            width + borderWidth,
            borderWidth,
            width + borderWidth,
            height,
            correctedRadius
          );
          ctx.arcTo(
            width + borderWidth,
            height + borderWidth,
            borderWidth,
            height + borderWidth,
            correctedRadius
          );
          ctx.arcTo(
            borderWidth,
            height + borderWidth,
            borderWidth,
            borderWidth,
            correctedRadius
          );
          ctx.arcTo(
            borderWidth,
            borderWidth,
            width + borderWidth,
            borderWidth,
            correctedRadius
          );
          ctx.closePath();

          ctx.fillStyle = fillColor;
          ctx.fill();
        },
        (text = new TextComponent(
          content,
          {
            textAlign: HorizontalAlignment.Center,
            wrap: true,
            verticalAlign: VerticalAlignment.Middle,
            fontSize: 32,
            color: "#000",
          },
          {
            x: 30,
            y: 30,
            width: rect.width - 60,
            height: rect.height - 60,
          }
        ).setOpacity(0)),
        (ctx: CanvasRenderingContext2D) => {
          ctx.restore();
        },
      ],
      rect
    );
    this.addChild(this.animation.listener());
    this.animation.observe((x) => {
      text.setOpacity(x);
    });
  }

  enter() {
    this.animation.animateTo(1);
  }

  exit() {
    this.animation.animateTo(0);
  }
}
