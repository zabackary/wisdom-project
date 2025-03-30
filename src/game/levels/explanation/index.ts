import Container from "../../../framework/components/Container";
import TimeBasedAnimationController from "../../../framework/controllers/TimeBasedAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../gameRoot";
import FadingTextComponent from "../../utils/FadingTextComponent";
import MessageComponent from "../../utils/MessageComponent";
import PretendCallbackAnimationController, {
  PretendPromiseAnimationController,
} from "../../utils/PretendCallbackAnimationController";
import sequenceAnimations from "../../utils/sequenceAnimations";
import { DotsAnimation } from "./dotsAnimation";

export default function explanationScene(onComplete: () => void) {
  const dotsGridSize = Math.ceil(Math.sqrt(14000));
  let blackBackgroundAlpha = 1;

  const animations: (
    | TimeBasedAnimationController
    | MessageComponent
    | FadingTextComponent
  )[] = [
    new PretendCallbackAnimationController(() => {}, true),
    new FadingTextComponent(
      "In our world today, many people groups still lack the opportunity others may have.",
      4000
    ),
    new FadingTextComponent(
      "Worse yet, they are the subject of hate speech or violence.",
      4000
    ),
    new PretendCallbackAnimationController(() => {
      dotsAnimation.show();
      setTimeout(() => {
        dotsAnimation.start();
      }, 500);
    }),
    new FadingTextComponent(
      "In one year alone, the FBI recorded 14,000 victims of hate speech motivated by biases.",
      4000
    ),
    new PretendPromiseAnimationController(async () => {
      await dotsAnimation.setFocus(
        Math.floor(Math.random() * dotsGridSize),
        Math.floor(Math.random() * dotsGridSize)
      );
    }),
    new FadingTextComponent(
      "In Texas in 2020, a man attacked a family he believed was Chinese in a large store. He cut the father in the face and attacked his 2 and 6 year old children by slashing their face, yelling, “Get out of America!”",
      4000
    ),
    new FadingTextComponent(
      "He believed they were “from the country who started spreading that disease [coronavirus] around.”",
      4000
    ),
    new PretendPromiseAnimationController(async () => {
      await dotsAnimation.removeFocus();
      await dotsAnimation.setFocus(
        Math.floor(Math.random() * dotsGridSize),
        Math.floor(Math.random() * dotsGridSize)
      );
    }),
    new FadingTextComponent(
      "In Massachusetts, a man set fire to a church serving a mostly African American congregation.",
      4000
    ),
    new FadingTextComponent(
      "He was told on his phone to “eliminate all [black people].”",
      4000
    ),
    new PretendPromiseAnimationController(async () => {
      await dotsAnimation.removeFocus();
      await dotsAnimation.setFocus(
        Math.floor(Math.random() * dotsGridSize),
        Math.floor(Math.random() * dotsGridSize)
      );
    }),
    new FadingTextComponent(
      "In another case in Florida, a man was driving with his family when another man sideswiped his car while shouting racial slurs, telling police officers later that Black people needed to be kept “in their areas.”",
      4000
    ),
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
      6000
    ),
    new FadingTextComponent(
      "According to Human Rights Watch, while the US has laws prohibiting racial discrimination, Japan, on the other hand, has no such laws.",
      4000
    ).onClose(() => {
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
          dotsGridSize,
          dotsGridSize
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
