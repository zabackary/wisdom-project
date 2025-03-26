import TimeBasedAnimationController from "../../framework/controllers/TimeBasedAnimationController";

export default class PretendCallbackAnimationController extends TimeBasedAnimationController {
  constructor(public callback: () => void, immediateStart: boolean = false) {
    super("linear", 0, 0, 0, immediateStart, undefined, -1);

    this.onFinish(callback);
  }
}
