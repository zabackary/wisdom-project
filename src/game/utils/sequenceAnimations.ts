import TimeBasedAnimationController from "../../framework/controllers/TimeBasedAnimationController";
import FadingTextComponent from "../utils/FadingTextComponent";
import MessageComponent from "../utils/MessageComponent";

type Animation =
  | TimeBasedAnimationController
  | MessageComponent
  | FadingTextComponent;

export default function sequenceAnimations(animations: Animation[]) {
  animations.forEach((animation, i) => {
    if (i > 0) {
      const startCurrent = () => {
        if (animation instanceof TimeBasedAnimationController) {
          animation.start();
        } else {
          setTimeout(() => animation.show(), 0);
        }
      };
      const previous = animations[i - 1];
      if (previous instanceof TimeBasedAnimationController) {
        previous.onFinish(() => {
          startCurrent();
        });
      } else {
        previous.onClose(() => {
          startCurrent();
        });
      }
    }
  });
}
