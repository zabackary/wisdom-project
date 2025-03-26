import * as RAPIER from "@dimforge/rapier2d";
import ImageComponent from "../../../framework/components/ImageComponent";
import ScrollingContainer from "../../../framework/components/ScrollingContainer";
import TimeBasedAnimationController from "../../../framework/controllers/TimeBasedAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH, PIXELS_PER_METER } from "../../gameRoot";
import FadingTextComponent from "../../utils/FadingTextComponent";
import MessageComponent from "../../utils/MessageComponent";
import PretendCallbackAnimationController from "../../utils/PretendCallbackAnimationController";
import sequenceAnimations from "../../utils/sequenceAnimations";

export default function introScene(onComplete: () => void) {
  let scrimAnimation: TimeBasedAnimationController;
  let blackBackgroundAlpha = 1;
  let dotsAlpha = 0;
  const world = new RAPIER.World({
    x: 0.0,
    y: -9.81,
  });

  // Create a dynamic rigid-body.
  let redDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    CANVAS_WIDTH / 2 / PIXELS_PER_METER - 0.001,
    CANVAS_HEIGHT / 2 / -PIXELS_PER_METER - 0.6
  );
  let redBody = world.createRigidBody(redDesc);

  // Create a ball collider attached to the dynamic rigidBody.
  let redColliderDesc = RAPIER.ColliderDesc.ball(0.5).setActiveCollisionTypes(
    RAPIER.ActiveCollisionTypes.DEFAULT |
      RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED
  );
  let redCollider = world.createCollider(redColliderDesc, redBody);

  // create a blue dynamic rigid-body
  let blueDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    CANVAS_WIDTH / 2 / PIXELS_PER_METER + 0.001,
    CANVAS_HEIGHT / 2 / -PIXELS_PER_METER + 0.6
  );
  let blueBody = world.createRigidBody(blueDesc);

  let blueColliderDesc = RAPIER.ColliderDesc.ball(0.5).setActiveCollisionTypes(
    RAPIER.ActiveCollisionTypes.DEFAULT |
      RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED
  );
  let blueCollider = world.createCollider(blueColliderDesc, blueBody);

  // Add the ground and walls
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(
    CANVAS_WIDTH / PIXELS_PER_METER,
    0.1
  ).setTranslation(0, -CANVAS_HEIGHT / PIXELS_PER_METER);
  world.createCollider(groundColliderDesc);
  let leftWallColliderDesc = RAPIER.ColliderDesc.cuboid(
    0.1,
    CANVAS_HEIGHT / PIXELS_PER_METER
  ).setTranslation(0, 0);

  let rightWallColliderDesc = RAPIER.ColliderDesc.cuboid(
    0.1,
    CANVAS_HEIGHT / PIXELS_PER_METER
  ).setTranslation(CANVAS_WIDTH / PIXELS_PER_METER, 0);

  redBody.setEnabled(false);
  blueBody.setEnabled(false);

  world.createCollider(leftWallColliderDesc);
  world.createCollider(rightWallColliderDesc);

  const animations: (
    | TimeBasedAnimationController
    | MessageComponent
    | FadingTextComponent
  )[] = [
    new PretendCallbackAnimationController(() => {}, true),
    new FadingTextComponent("First, we start with black.", 4000),
    new FadingTextComponent(
      "Everything comes from nothing. With nothing.",
      4000
    ),
    new PretendCallbackAnimationController(() => {
      redBody.setEnabled(true);
      blueBody.setEnabled(true);
    }),
    new TimeBasedAnimationController(
      "sine",
      1000,
      1,
      0,
      undefined,
      undefined,
      -1
    ).observe((x) => {
      if (x !== -1) blackBackgroundAlpha = x;
    }),
    new FadingTextComponent("Yet, we still have differences.", 4000),
    new TimeBasedAnimationController("linear", 1000, 0, 0),
    (scrimAnimation = new TimeBasedAnimationController(
      "ease-in",
      2000,
      0,
      1
    ).onFinish(onComplete)),
  ];

  sequenceAnimations(animations);

  let container: ScrollingContainer;
  let redDot: ImageComponent;
  let blueDot: ImageComponent;

  return [
    (ctx: CanvasRenderingContext2D) => {
      world.step();
      redDot.setBounds({
        x: (redBody.translation().x - 0.5) * PIXELS_PER_METER,
        y: (redBody.translation().y + 0.5) * -PIXELS_PER_METER,
      });
      blueDot.setBounds({
        x: (blueBody.translation().x - 0.5) * PIXELS_PER_METER,
        y: (blueBody.translation().y + 0.5) * -PIXELS_PER_METER,
      });

      const oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = oldAlpha * blackBackgroundAlpha;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = oldAlpha;
    },
    (redDot = new ImageComponent("assets/shared/red-dot.svg", {
      x: (redBody.translation().x - 0.5) * PIXELS_PER_METER,
      y: (redBody.translation().y + 0.5) * -PIXELS_PER_METER,
      width: PIXELS_PER_METER * 1,
      height: PIXELS_PER_METER * 1,
    })),
    (blueDot = new ImageComponent("assets/shared/blue-dot.svg", {
      x: (blueBody.translation().x - 0.5) * PIXELS_PER_METER,
      y: (blueBody.translation().y + 0.5) * -PIXELS_PER_METER,
      width: PIXELS_PER_METER * 1,
      height: PIXELS_PER_METER * 1,
    })),
    ...animations.map((animation) =>
      animation instanceof TimeBasedAnimationController
        ? animation.listener()
        : animation
    ),
    (ctx: CanvasRenderingContext2D) => {
      const oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = oldAlpha * scrimAnimation.value;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = oldAlpha;
    },
    scrimAnimation.listener(),
  ];
}
