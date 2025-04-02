import TimeBasedAnimationController from "../../../framework/controllers/TimeBasedAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../gameRoot";
import FadingTextComponent from "../../utils/FadingTextComponent";
import MessageComponent from "../../utils/MessageComponent";
import PretendCallbackAnimationController, {
  PretendPromiseAnimationController,
} from "../../utils/PretendCallbackAnimationController";
import sequenceAnimations from "../../utils/sequenceAnimations";
import { PowerAnimation } from "./PowerAnimation";

export default function hevelScene(onComplete: () => void) {
  const powerAnimation = new PowerAnimation();
  let scrimAnimation = new TimeBasedAnimationController(
    "ease-in",
    2000,
    0,
    1
  ).onFinish(onComplete);

  const animations: (
    | TimeBasedAnimationController
    | MessageComponent
    | FadingTextComponent
  )[] = [
    new PretendCallbackAnimationController(() => {
      powerAnimation.initializeCircles();
    }, true),
    new FadingTextComponent("So why we do this?", 4000).withAudio(
      "2025-04-02 21-51-08.mp3"
    ),
    new FadingTextComponent("“Eliminate them. Keep them in their areas”", 4000),
    new PretendPromiseAnimationController(async () => {
      await powerAnimation.animateTheBall();
    }),
    new FadingTextComponent(
      "It's because we want status. We want power over other people unlike ourselves.",
      9000
    ).withAudio("2025-04-02 21-51-20.mp3"),
    new FadingTextComponent("Yet, it’s meaningless.", 3000),
    new PretendPromiseAnimationController(async () => {
      await powerAnimation.fadeToGrayscale();
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }),
    new FadingTextComponent(
      "We’re told that “Everyone comes naked from their mother’s womb, and as everyone comes, so they depart.”",
      8000,
      undefined,
      undefined,
      "transparent"
    )
      .withVerseReference("Ecclesiastes 5:15")
      .withAudio("2025-04-02 21-51-38.mp3"),
    new FadingTextComponent(
      "Wanting to be better than another race, or wanting to be superior – in the end, death will equalize everyone.",
      9000,
      undefined,
      undefined,
      "transparent"
    )
      .withVerseReference("Ecclesiastes 3:18-21")
      .withAudio("2025-04-02 21-51-51.mp3"),
    new FadingTextComponent(
      "Everyone, of every race, will eventually die. Everyone has a common destiny.",
      10000,
      undefined,
      undefined,
      "transparent"
    )
      .withVerseReference("Ecclesiastes 9:2")
      .withAudio("2025-04-02 21-52-06.mp3"),
    new PretendPromiseAnimationController(async () => {
      setTimeout(() => powerAnimation.dropBalls(), 9000);
    }),
    new FadingTextComponent(
      "Envious toiling in order to prove one’s racial superiority – desire to prove one is above others – is meaningless, as whatever status gained is transient and will fade away.",
      13000,
      undefined,
      undefined,
      "transparent"
    )
      .withVerseReference("Ecclesiastes 4:4 + Constable's Notes")
      .withAudio("2025-04-02 21-52-57.mp3"),
    new PretendPromiseAnimationController(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    }),
    new FadingTextComponent(
      "Discriminating against others to further one’s own interests and power will be erased by time —",
      8500,
      undefined,
      undefined,
      "transparent"
    ).withAudio("2025-04-02 21-53-26.mp3"),
    new PretendPromiseAnimationController(async () => {
      powerAnimation.removeBalls();
    }),
    new FadingTextComponent(
      "And death.",
      3000,
      undefined,
      undefined,
      "transparent"
    ).withAudio("2025-04-02 21-53-37.mp3"),
    new PretendPromiseAnimationController(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 5000);
      });
    }),
    new FadingTextComponent(
      "It’s hevel.",
      2000,
      undefined,
      undefined,
      "transparent"
    ).withAudio("2025-04-02 21-56-34.mp3"),
    new FadingTextComponent(
      "But if wanting status is meaningless, what should we do that isn’t?",
      6000,
      undefined,
      undefined,
      "transparent"
    ).onClose(() => {
      scrimAnimation.start();
      setTimeout(() => onComplete(), 2000);
    }),
  ];

  sequenceAnimations(animations);

  return [
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    },
    powerAnimation,
    (ctx: CanvasRenderingContext2D) => {
      const oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = oldAlpha * scrimAnimation.value;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = oldAlpha;
    },
    ...animations.map((animation) =>
      animation instanceof TimeBasedAnimationController
        ? animation.listener()
        : animation
    ),
    scrimAnimation.listener(),
  ];
}
