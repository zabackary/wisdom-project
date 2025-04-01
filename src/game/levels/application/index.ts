import TextComponent, {
  HorizontalAlignment,
  VerticalAlignment,
} from "../../../framework/components/TextComponent";
import TimeBasedAnimationController from "../../../framework/controllers/TimeBasedAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../gameRoot";
import FadingTextComponent from "../../utils/FadingTextComponent";
import PretendCallbackAnimationController, {
  PretendPromiseAnimationController,
} from "../../utils/PretendCallbackAnimationController";
import sequenceAnimations from "../../utils/sequenceAnimations";
import ContentBox from "./ContentBox";
import StickFigure from "./StickFigure";

export default function applicationScene(onComplete: () => void) {
  const mainStickFigure = new StickFigure("#000", 3, {
    x: -80,
    y: -200,
    width: 80,
    height: 200,
  });
  const scrimAnimation = new TimeBasedAnimationController(
    "ease-in",
    2000,
    0,
    1
  );
  const boxes = [
    // three boxes at the top in a row
    new ContentBox(
      "I should judge truthfully based on a person’s actions instead of their skin color.",
      {
        x: (CANVAS_WIDTH / 3) * 0 + 20,
        y: 20,
        width: CANVAS_WIDTH / 3 - 40,
        height: CANVAS_HEIGHT / 2 - 40,
      }
    ),
    new ContentBox(
      "I should be kind and show love to people no matter what I assume about them.",
      {
        x: (CANVAS_WIDTH / 3) * 1 + 20,
        y: 20,
        width: CANVAS_WIDTH / 3 - 40,
        height: CANVAS_HEIGHT / 2 - 40,
      }
    ),
    new ContentBox(
      "I should take time to reflect upon my biases instead of letting them unconsciously control me.",
      {
        x: (CANVAS_WIDTH / 3) * 2 + 20,
        y: 20,
        width: CANVAS_WIDTH / 3 - 40,
        height: CANVAS_HEIGHT / 2 - 40,
      }
    ),
  ];
  const conclusionText = new TextComponent(
    "And that is racial discrimination in the context of Wisdom.",
    {
      textAlign: HorizontalAlignment.Center,
      wrap: true,
      fontSize: 72,
      verticalAlign: VerticalAlignment.Middle,
    },
    {
      x: 80,
      y: 80,
      width: CANVAS_WIDTH - 160,
      height: 200,
    }
  ).setOpacity(0);
  const animations = [
    new PretendCallbackAnimationController(() => {}, true),
    new TimeBasedAnimationController("ease-in", 2000, 0, 1),
    new FadingTextComponent(
      "So what about me?",
      2000,
      undefined,
      "#000",
      "transparent"
    ),
    // Stick figure comes in from the left
    new TimeBasedAnimationController(
      "ease-out",
      1000,
      0,
      1
    ).observeWhileRunning((x) => {
      mainStickFigure.setRotation(Math.PI / 2);
      mainStickFigure.setBounds({
        x: -160 + 140 * x,
        y: CANVAS_HEIGHT / 2 - 100,
      });
    }),
    new FadingTextComponent("Yes, me.", 2000, undefined, "#000", "transparent"),
    // Goes out again
    new TimeBasedAnimationController("ease-in", 2000, 1, 0).observeWhileRunning(
      (x) => {
        mainStickFigure.setBounds({
          x: -160 + 140 * x,
          y: CANVAS_HEIGHT / 2 - 100,
        });
      }
    ),
    // Stick figure comes in from the bottom
    new TimeBasedAnimationController(
      "ease-out",
      2000,
      0,
      1
    ).observeWhileRunning((x) => {
      mainStickFigure.setRotation(0);
      mainStickFigure.setBounds({
        x: CANVAS_WIDTH / 2 - 40,
        y: CANVAS_HEIGHT - 20 - 220 * x,
      });
    }),
    new FadingTextComponent(
      "What can I do? And why?",
      2000,
      undefined,
      "#000",
      "transparent"
    ),
    new FadingTextComponent(
      "Well, personally, even though I am sometimes discriminated against in the US, I am also a discriminator in Japan where there is so little ethnic diversity. That is why it is important to me.",
      6000,
      undefined,
      "#000",
      "transparent"
    ),
    new PretendPromiseAnimationController(async () => {
      for (const box of boxes) {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 4000);
        });
        box.enter();
      }
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
      for (const box of boxes) {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 800);
        });
        box.exit();
      }
    }),
    new TimeBasedAnimationController("ease-in-out", 2000, 0, 1)
      .observeWhileRunning((x) => {
        conclusionText.setOpacity(x);
      })
      .onFinish(() => {
        setTimeout(() => {
          scrimAnimation.start();
        }, 3000);
        setTimeout(() => {
          onComplete();
        }, 6000);
      }),
  ];
  sequenceAnimations(animations);

  return [
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = "#888";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    },
    mainStickFigure,
    ...animations.map((animation) =>
      animation instanceof TimeBasedAnimationController
        ? animation.listener()
        : animation
    ),
    ...boxes,
    scrimAnimation.listener(),
    conclusionText,
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = "#000";
      ctx.globalAlpha = scrimAnimation.value;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = 1;
    },
  ];
}
