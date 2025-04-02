import InterruptableAnimationController from "../../../framework/controllers/InterruptableAnimationController";
import TimeBasedAnimationController from "../../../framework/controllers/TimeBasedAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../gameRoot";
import FadingTextComponent from "../../utils/FadingTextComponent";
import MessageComponent from "../../utils/MessageComponent";
import PretendCallbackAnimationController, {
  PretendPromiseAnimationController,
} from "../../utils/PretendCallbackAnimationController";
import sequenceAnimations from "../../utils/sequenceAnimations";
import { DotMorpher } from "./DotMorpher";
import { SupportedDots } from "./SupportedDots";

export default function hokmaScene(onComplete: () => void) {
  let backgroundAlpha = 1;
  let grayAlpha = 0;

  const supportedDotsFadeAnimation = new InterruptableAnimationController(
    "ease-in-out",
    2000,
    1
  );
  const supportedDots = new SupportedDots()
    .setOpacity(0)
    .addController(supportedDotsFadeAnimation, function (x) {
      this.setOpacity(x);
    });

  const dotFadeAnimation = new InterruptableAnimationController(
    "ease-in-out",
    2000,
    0
  );
  const dotMorpher = new DotMorpher(
    {
      x: 0,
      y: CANVAS_HEIGHT / 2 - 200,
      width: CANVAS_WIDTH,
      height: 400,
    },
    50
  )
    .setOpacity(0)
    .addController(dotFadeAnimation, function (x) {
      this.setOpacity(x);
    });

  const animations: (
    | TimeBasedAnimationController
    | MessageComponent
    | FadingTextComponent
  )[] = [
    new PretendCallbackAnimationController(() => {
      setTimeout(() => {
        dotFadeAnimation.animateTo(1);
      }, 2000);
    }, true),
    new FadingTextComponent(
      "That’s where wisdom, or hokma, comes in.",
      5000,
      undefined,
      "#000",
      "#fff"
    ).withAudio("2025-04-02 21-57-02.mp3"),
    new PretendCallbackAnimationController(() => {
      setTimeout(() => {
        dotMorpher.morphPlatform();
      }, 7000);
    }),
    new FadingTextComponent(
      "Instead of being an influence who stirs up conflict in their community in order to gain status over people unlike us, we can support others.",
      10000,
      undefined,
      "#000",
      "#fff",
      0
    )
      .withVerseReference("Proverbs 6:19 + Constable’s Notes")
      .withAudio("2025-04-02 21-57-11.mp3"),
    new PretendPromiseAnimationController(async () => {
      supportedDots.dropCircles(CANVAS_HEIGHT / 2 + 200 - 50, 30, 200);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 30 * 200 + 2000);
      });
    }),
    new FadingTextComponent(
      "Instead of holding hate against those who are different, we can use love –",
      5000,
      undefined,
      "#000",
      "#fff"
    ).withAudio("2025-04-02 21-58-37.mp3"),
    new FadingTextComponent(
      "we can love those who look different than us, and take steps to reduce the gaps we’ve caused in the past.",
      7000,
      undefined,
      "#000",
      "#fff"
    ),
    new PretendCallbackAnimationController(() => {
      supportedDotsFadeAnimation.animateTo(0);
    }),
    new PretendPromiseAnimationController(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    }),
    new PretendCallbackAnimationController(() => {
      dotMorpher.morphDot();
    }),
    new PretendPromiseAnimationController(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1500);
      });
    }),
    new FadingTextComponent(
      "Showing wisdom means being kind to those we’ve disadvantaged – because even if it’s meaningless in this world, “[the Lord] will reward [us] for what [we] have done.”",
      12000,
      undefined,
      "#000",
      "#fff"
    )
      .withVerseReference("Proverbs 19:17")
      .withAudio("2025-04-02 21-58-55.mp3"),
    new PretendPromiseAnimationController(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    }),
    new PretendCallbackAnimationController(() => {
      dotFadeAnimation.animateTo(0);
    }),
    new FadingTextComponent(
      "To be wise, we’re not called to judge with partiality, discriminating, but to judge truthfully.",
      8000,
      undefined,
      "#000",
      "#fff"
    )
      .withVerseReference("Proverbs 24:23")
      .withAudio("2025-04-02 21-59-13.mp3"),
    new TimeBasedAnimationController(
      "ease-in-out",
      2000,
      0,
      1
    ).observeWhileRunning((x) => {
      grayAlpha = x;
    }),
    new PretendCallbackAnimationController(() => {
      setTimeout(() => onComplete(), 500);
    }),
  ];

  sequenceAnimations(animations);

  return [
    (ctx: CanvasRenderingContext2D) => {
      const oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = oldAlpha * backgroundAlpha;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = oldAlpha;
    },
    (ctx: CanvasRenderingContext2D) => {
      const oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = oldAlpha * grayAlpha;
      ctx.fillStyle = "#888";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = oldAlpha;
    },
    supportedDots,
    dotMorpher,
    ...animations.map((animation) =>
      animation instanceof TimeBasedAnimationController
        ? animation.listener()
        : animation
    ),
  ];
}
