import Container from "../../../framework/components/Container";
import TimeBasedAnimationController from "../../../framework/controllers/TimeBasedAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../gameRoot";
import FadingTextComponent from "../../utils/FadingTextComponent";
import MessageComponent from "../../utils/MessageComponent";
import PretendCallbackAnimationController, {
  PretendPromiseAnimationController,
} from "../../utils/PretendCallbackAnimationController";
import sequenceAnimations from "../../utils/sequenceAnimations";
import { DotsAnimation } from "./DotsAnimation";

export default function explanationScene(onComplete: () => void) {
  const totalDots = 14000;
  const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
  const dotsGridSizeY = Math.ceil(Math.sqrt(totalDots / aspectRatio));
  const dotsGridSizeX = Math.ceil(dotsGridSizeY * aspectRatio);
  let blackBackgroundAlpha = 1;

  const animations: (
    | TimeBasedAnimationController
    | MessageComponent
    | FadingTextComponent
  )[] = [
    new PretendCallbackAnimationController(() => {}, true),
    new FadingTextComponent(
      "In our world today, many people groups still lack the opportunity others may have.",
      6500
    ).withAudio("2025-04-02 21-41-30.mp3"),
    new FadingTextComponent(
      "Worse yet, they are the subject of hate speech or violence.",
      5000
    ).withAudio("2025-04-02 21-42-07.mp3"),
    new PretendCallbackAnimationController(() => {
      dotsAnimation.show();
      setTimeout(() => {
        dotsAnimation.start();
      }, 1500);
    }),
    new FadingTextComponent(
      "In one year alone, the FBI recorded 14,000 victims of hate speech motivated by biases.",
      7000
    )
      .withVerseReference("U.S. Dept. of Justice | Hate Crime Statistics")
      .withAudio("2025-04-02 21-43-26.mp3"),
    new PretendPromiseAnimationController(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      await dotsAnimation.setFocus(
        Math.floor(Math.random() * dotsGridSizeX),
        Math.floor(Math.random() * dotsGridSizeY)
      );
    }),
    new FadingTextComponent(
      "In Texas in 2020, a man attacked a family he believed was Chinese in a large store. He cut the father in the face and attacked his 2 and 6 year old children by slashing their face, yelling, “Get out of America!”",
      16000
    )
      .withVerseReference("U.S. Dept. of Justice | Hate Crime State Data")
      .withAudio("2025-04-02 21-48-10.mp3"),
    new FadingTextComponent(
      "He believed they were “from the country who started spreading that disease [coronavirus] around.”",
      7000
    ).withAudio("2025-04-02 21-48-57.mp3"),
    new PretendPromiseAnimationController(async () => {
      await dotsAnimation.removeFocus();
      await dotsAnimation.setFocus(
        Math.floor(Math.random() * dotsGridSizeX),
        Math.floor(Math.random() * dotsGridSizeY)
      );
    }),
    new FadingTextComponent(
      "In Massachusetts, a man set fire to a church serving a mostly African American congregation.",
      7000
    )
      .withVerseReference("U.S. Dept. of Justice | Hate Crime State Data")
      .withAudio("2025-04-02 21-49-11.mp3"),
    new FadingTextComponent(
      "He was told on his phone to “eliminate all [black people].”",
      5000
    ).withAudio("2025-04-02 21-49-21.mp3"),
    new PretendPromiseAnimationController(async () => {
      await dotsAnimation.removeFocus();
      await dotsAnimation.setFocus(
        Math.floor(Math.random() * dotsGridSizeX),
        Math.floor(Math.random() * dotsGridSizeY)
      );
    }),
    new FadingTextComponent(
      "In another case in Florida, a man was driving with his family when another man sideswiped his car while shouting racial slurs, telling police officers later that Black people needed to be kept “in their areas.”",
      14000
    )
      .withVerseReference("U.S. Dept. of Justice | Hate Crime State Data")
      .withAudio("2025-04-02 21-49-50.mp3"),
    new PretendPromiseAnimationController(async () => {
      await dotsAnimation.removeFocus();
    }),
    new PretendPromiseAnimationController(async () => {
      dotsAnimation.hide();
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }),
    new FadingTextComponent(
      "These are only three of thousands upon thousands of recorded incidents in the United States alone. And the problem isn’t unique to the US.",
      10000
    ).withAudio("2025-04-02 21-50-29.mp3"),
    new FadingTextComponent(
      "While the US has laws prohibiting racial discrimination, Japan, on the other hand, has no such laws.",
      8000
    )
      .withAudio("2025-04-02 21-50-44.mp3")
      .withVerseReference("Human Rights Watch")
      .onClose(() => {
        setTimeout(() => onComplete(), 500);
      }),
  ];

  sequenceAnimations(animations);

  let dotsAnimation: DotsAnimation;

  return [
    (ctx: CanvasRenderingContext2D) => {
      const oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = oldAlpha * blackBackgroundAlpha;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = oldAlpha;
    },
    new Container(
      [
        (dotsAnimation = new DotsAnimation(
          80,
          20,
          "#999",
          dotsGridSizeY,
          dotsGridSizeX
        )),
      ],
      {
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }
    ),
    ...animations.map((animation) =>
      animation instanceof TimeBasedAnimationController
        ? animation.listener()
        : animation
    ),
  ];
}
