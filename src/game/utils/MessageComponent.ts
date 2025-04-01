import { UpdateInfo } from "../../framework/components/Component";
import Container from "../../framework/components/Container";
import {
  HorizontalAlignment,
  VerticalAlignment,
} from "../../framework/components/TextComponent";
import InterruptableAnimationController from "../../framework/controllers/InterruptableAnimationController";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FONT,
  PIXEL_ART_SIZE,
  PROSE_FONT,
} from "../gameRoot";
import RoundedButtonComponent from "./RoundedButtonComponent";

const MESSAGE_WIDTH = 520;

/**
 * Wraps lines on a canvas, TS version of https://stackoverflow.com/a/16599668
 *
 * @param ctx canvas rendering context
 * @param text the text to wrap
 * @param maxWidth width at which to wrap at
 * @returns the text separated by lines
 */
export function wrapCanvasLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export default class MessageComponent extends Container {
  private animationController: InterruptableAnimationController;

  public isShowing: boolean = false;

  constructor(title: string, body: string, compact: boolean = false) {
    const animationController = new InterruptableAnimationController(
      "ease-in-out",
      1000,
      0
    );
    let checkContainer: Container;
    const animatedContainer = new Container(
      [
        (ctx) => {
          // rounded rectangle background (only top two corners, 40px radius)
          const BORDER_RADIUS = 40;
          const HORIZONTAL_INSET = CANVAS_WIDTH / 2 - MESSAGE_WIDTH / 2;
          const VERTICAL_INSET = 120;

          ctx.fillStyle = "#eee";
          ctx.beginPath();
          ctx.moveTo(HORIZONTAL_INSET, CANVAS_HEIGHT);
          ctx.lineTo(CANVAS_WIDTH - HORIZONTAL_INSET, CANVAS_HEIGHT);
          ctx.lineTo(
            CANVAS_WIDTH - HORIZONTAL_INSET,
            VERTICAL_INSET + BORDER_RADIUS
          );
          ctx.arc(
            CANVAS_WIDTH - HORIZONTAL_INSET - BORDER_RADIUS,
            VERTICAL_INSET + BORDER_RADIUS,
            BORDER_RADIUS,
            Math.PI * 0,
            Math.PI * 1.5,
            true
          );
          ctx.lineTo(HORIZONTAL_INSET + BORDER_RADIUS, VERTICAL_INSET);
          ctx.arc(
            HORIZONTAL_INSET + BORDER_RADIUS,
            VERTICAL_INSET + BORDER_RADIUS,
            BORDER_RADIUS,
            Math.PI * 1.5,
            Math.PI * 1.0,
            true
          );
          ctx.lineTo(HORIZONTAL_INSET, CANVAS_HEIGHT);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#333";
          ctx.font = `${compact ? 26 : 34}px ${FONT}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(
            title,
            CANVAS_WIDTH / 2,
            (compact ? 25 : 28) * PIXEL_ART_SIZE
          );

          ctx.fillStyle = "#666";
          ctx.font = `${compact ? 12 : 22}px ${PROSE_FONT}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          const paragraphLines = body
            .split("\n")
            .map((paragraph) =>
              wrapCanvasLines(ctx, paragraph, 70 * PIXEL_ART_SIZE)
            );
          let y = (compact ? 31 : 38) * PIXEL_ART_SIZE;
          for (const paragraph of paragraphLines) {
            for (const line of paragraph) {
              ctx.fillText(line, CANVAS_WIDTH / 2, y);
              y += compact ? 13 : 30;
            }
            y += compact ? 2 : 10;
          }
        },
      ],
      {
        x: 0,
        y: CANVAS_HEIGHT,
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
        (checkContainer = new Container(
          [
            new RoundedButtonComponent(
              {
                x: 0,
                y: 0,
                width: 120,
                height: 40,
              },
              999,
              "transparent",
              "#444",
              "#bbb",
              1,
              () => {
                this.hide();
              },
              "hide",
              {
                fontSize: 18,
                textAlign: HorizontalAlignment.Center,
                verticalAlign: VerticalAlignment.Middle,
                color: "#fff",
              }
            ),
          ],
          {
            x: CANVAS_WIDTH - 120 - 12,
            y: 12,
            width: 120,
            height: 40,
          }
        )),
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
        y: CANVAS_HEIGHT * (1 - value),
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      });
      backgroundAlpha = value * 0.8;
      checkContainer.setOpacity(value);
      animatedContainer.setDisableChildUpdates(value === 0);
      checkContainer.setDisableChildUpdates(value === 0);
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
