import TimeBasedAnimationController from "../../framework/controllers/TimeBasedAnimationController";

export default class PretendCallbackAnimationController extends TimeBasedAnimationController {
  constructor(public callback: () => void, immediateStart: boolean = false) {
    super("linear", 0, 0, 0, immediateStart, undefined, -1);

    this.onFinish(callback);
  }
}

export class PretendPromiseAnimationController extends TimeBasedAnimationController {
  constructor(public callback: () => Promise<void>) {
    super("linear", 0, 0, 0, false, undefined, -1);
  }

  resolveCallbacks: (() => void)[] = [];
  onFinish(callback: () => void): this {
    this.resolveCallbacks.push(callback);
    return this;
  }

  private triggerCallbacks(): void {
    this.resolveCallbacks.forEach((callback) => callback());
    this.resolveCallbacks = [];
  }

  start(): this {
    this.callback().then(() => {
      this.triggerCallbacks();
    });
    return this;
  }
}
