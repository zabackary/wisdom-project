import { Rect } from "../../../framework/components/Component";
import Container from "../../../framework/components/Container";

export default class StickFigure extends Container {
  constructor(color: string, lineWidth: number, rect: Rect) {
    super(
      [
        (ctx: CanvasRenderingContext2D) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          // Draw a stick figure like this scaled by the bounds
          //   O
          //  /|\
          //  / \
          ctx.beginPath();
          ctx.arc(
            rect.width / 2,
            rect.height / 10 + lineWidth,
            rect.height / 10,
            0,
            Math.PI * 2
          );
          // Body
          ctx.moveTo(rect.width / 2, rect.height / 5 + lineWidth);
          ctx.lineTo(rect.width / 2, rect.height * 0.7);
          // Left leg
          ctx.lineTo(rect.width / 10, rect.height);
          // Right leg
          ctx.moveTo(rect.width / 2, rect.height * 0.7);
          ctx.lineTo(rect.width - rect.width / 10, rect.height);
          // Left arm
          ctx.moveTo(rect.width / 2, rect.height * 0.4);
          ctx.lineTo(0, rect.height * 0.6);
          // Right arm
          ctx.moveTo(rect.width / 2, rect.height * 0.4);
          ctx.lineTo(rect.width, rect.height * 0.6);
          ctx.stroke();
          ctx.closePath();
        },
      ],
      rect
    );
  }
}
