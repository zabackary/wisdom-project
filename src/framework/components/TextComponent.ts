import { FONT } from "../../game/gameRoot";
import { Rect } from "./Component";
import Container from "./Container";

export enum HorizontalAlignment {
  Left = "left",
  Center = "center",
  Right = "right",
}

export enum VerticalAlignment {
  Top = "top",
  Middle = "middle",
  Bottom = "bottom",
}

export interface TextSettings {
  fontName: string;
  fontSize: number;
  color: string;
  verticalAlign: VerticalAlignment;
  textAlign: HorizontalAlignment;
  wrap: boolean;
}

/**
 * Wraps lines on a canvas, TS version of https://stackoverflow.com/a/16599668
 *
 * @param ctx canvas rendering context
 * @param text the text to wrap
 * @param maxWidth width at which to wrap at
 * @returns the text separated by lines and the total height of the lines
 */
function wrapCanvasLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): { lines: string[]; totalHeight: number } {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];
  let totalHeight = 0;

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      totalHeight +=
        ctx.measureText(currentLine).actualBoundingBoxAscent +
        ctx.measureText(currentLine).actualBoundingBoxDescent;
      currentLine = word;
    }
  }
  lines.push(currentLine);
  totalHeight +=
    ctx.measureText(currentLine).actualBoundingBoxAscent +
    ctx.measureText(currentLine).actualBoundingBoxDescent;
  return {
    lines,
    totalHeight,
  };
}

export default class TextComponent extends Container {
  protected settings: TextSettings;

  constructor(
    public text: string,
    settings: Partial<TextSettings> = {},
    bounds: Rect
  ) {
    super(
      [
        (context: CanvasRenderingContext2D) => {
          context.font = `${this.settings.fontSize}px ${this.settings.fontName}`;
          context.fillStyle = this.settings.color;
          const x =
            this.settings.textAlign === HorizontalAlignment.Center
              ? this.bounds.width / 2
              : this.settings.textAlign === HorizontalAlignment.Right
              ? this.bounds.width
              : 0;
          const y =
            this.settings.verticalAlign === VerticalAlignment.Middle
              ? this.bounds.height / 2
              : this.settings.verticalAlign === VerticalAlignment.Bottom
              ? this.bounds.height
              : 0;
          context.textAlign = this.settings.textAlign;
          context.textBaseline = this.settings.verticalAlign;
          if (this.settings.wrap) {
            const { lines, totalHeight } = wrapCanvasLines(
              context,
              this.text,
              this.bounds.width
            );
            lines.forEach((line, index) => {
              context.fillText(
                line,
                x,
                y - totalHeight / 2 + index * (totalHeight / (lines.length - 1))
              );
            });
          } else {
            context.fillText(this.text, x, y, this.bounds.width);
          }
        },
      ],
      bounds
    );
    this.settings = {
      fontName: FONT,
      fontSize: 16,
      color: "#000",
      verticalAlign: VerticalAlignment.Top,
      textAlign: HorizontalAlignment.Left,
      wrap: false,
      ...settings,
    };
  }
}
