import * as RAPIER from "@dimforge/rapier2d";
import ImageComponent from "../../../framework/components/ImageComponent";
import LifecycleCallbackComponent from "../../../framework/components/LifecycleCallbackComponent";
import ScrollingContainer from "../../../framework/components/ScrollingContainer";
import TimeBasedAnimationController from "../../../framework/controllers/TimeBasedAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH, PIXELS_PER_METER } from "../../gameRoot";
import FadingTextComponent from "../../utils/FadingTextComponent";
import MessageComponent from "../../utils/MessageComponent";
import PretendCallbackAnimationController from "../../utils/PretendCallbackAnimationController";
import sequenceAnimations from "../../utils/sequenceAnimations";

export default function introScene(onComplete: () => void) {
  let scrimAnimation = new TimeBasedAnimationController(
    "ease-in",
    2000,
    0,
    1
  ).observe((x) => {
    thisIsText.setOpacity(1 - x);
  });
  let blackBackgroundAlpha = 1;
  let dotsAlpha = 0;
  let dotsGray = 1;
  const world = new RAPIER.World({
    x: 0.0,
    y: -9.81,
  });

  // Create a dynamic rigid-body.
  let redDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    960 / 2 / PIXELS_PER_METER - 0.001,
    720 / 2 / -PIXELS_PER_METER - 0.6
  );
  let redBody = world.createRigidBody(redDesc);

  // Create a ball collider attached to the dynamic rigidBody.
  let redColliderDesc = RAPIER.ColliderDesc.ball(0.5).setActiveCollisionTypes(
    RAPIER.ActiveCollisionTypes.DEFAULT |
      RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED
  );
  world.createCollider(redColliderDesc, redBody);

  // create a blue dynamic rigid-body
  let blueDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    960 / 2 / PIXELS_PER_METER + 0.001,
    720 / 2 / -PIXELS_PER_METER + 0.6
  );
  let blueBody = world.createRigidBody(blueDesc);

  let blueColliderDesc = RAPIER.ColliderDesc.ball(0.5)
    .setActiveCollisionTypes(
      RAPIER.ActiveCollisionTypes.DEFAULT |
        RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED
    )
    .setMass(5.0)
    .setRestitution(1.0);
  world.createCollider(blueColliderDesc, blueBody);

  redBody.setEnabled(false);
  blueBody.setEnabled(false);

  let leftFloor: RAPIER.Collider;
  const worldColliders: RAPIER.Collider[] = [
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        0.1,
        720 / PIXELS_PER_METER + 0.1
      ).setTranslation(960 / PIXELS_PER_METER + 0.1, 0)
    ),
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        960 / PIXELS_PER_METER / 2,
        0.1
      ).setTranslation(
        960 / PIXELS_PER_METER / 2,
        -720 / PIXELS_PER_METER - 0.1
      )
    ),
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(960 / PIXELS_PER_METER / 4, 0.1)
        .setTranslation(
          -960 / PIXELS_PER_METER / 8,
          (-720 / PIXELS_PER_METER) * 1.9
        )
        .setRotation(Math.PI / 8)
    ),
    // a box slightly below that made of three walls
    (leftFloor = world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        (960 / PIXELS_PER_METER) * 0.2,
        0.1
      ).setTranslation(
        -960 / PIXELS_PER_METER - (960 / PIXELS_PER_METER) * 0.2,
        (-720 / PIXELS_PER_METER) * 3.0
      )
    )),
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        (960 / PIXELS_PER_METER) * 0.2,
        0.1
      ).setTranslation(
        -960 / PIXELS_PER_METER + (960 / PIXELS_PER_METER) * 0.2,
        (-720 / PIXELS_PER_METER) * 3.0
      )
    ),
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        0.1,
        (720 / PIXELS_PER_METER) * 0.2
      ).setTranslation(-960 / PIXELS_PER_METER, (-720 / PIXELS_PER_METER) * 2.8)
    ),
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        0.1,
        (720 / PIXELS_PER_METER) * 0.2
      ).setTranslation(
        -960 / PIXELS_PER_METER - (960 / PIXELS_PER_METER) * 0.4,
        (-720 / PIXELS_PER_METER) * 2.8
      )
    ),
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        0.1,
        (720 / PIXELS_PER_METER) * 0.2
      ).setTranslation(
        -960 / PIXELS_PER_METER + (960 / PIXELS_PER_METER) * 0.4,
        (-720 / PIXELS_PER_METER) * 2.8
      )
    ),
  ];
  let colliderAlphas = 0.0;

  let thisIsText: FadingTextComponent;
  const growTextAnimation = new TimeBasedAnimationController(
    "ease-in",
    10000,
    32,
    80
  ).observeWhileRunning((x) => {
    thisIsText.fontSize = x;
  });

  const oldScroll = -(CANVAS_WIDTH - 960) / 2;

  const animations: (
    | TimeBasedAnimationController
    | MessageComponent
    | FadingTextComponent
  )[] = [
    new FadingTextComponent("First, we start with black.", 4000).withAudio(
      "2025-04-02 21-28-22.mp3"
    ),
    new FadingTextComponent(
      "Everything comes from nothing. With nothing.",
      5000
    ),
    new TimeBasedAnimationController("sine", 2000, 1, 0).observeWhileRunning(
      (x) => {
        blackBackgroundAlpha = x;
      }
    ),
    new TimeBasedAnimationController(
      "ease-in-out",
      3000,
      0,
      1
    ).observeWhileRunning((x) => {
      dotsAlpha = x;
    }),
    new FadingTextComponent("Yet, we still have differences.", 3000).withAudio(
      "2025-04-02 21-29-16.mp3"
    ),
    new TimeBasedAnimationController(
      "ease-in-out",
      3000,
      1,
      0
    ).observeWhileRunning((x) => {
      dotsGray = x;
    }),
    new FadingTextComponent(
      "Differences that God created us with.",
      2000
    ).withAudio("2025-04-02 21-29-37.mp3"),
    new PretendCallbackAnimationController(() => {
      redBody.setEnabled(true);
      blueBody.setEnabled(true);
    }),
    new TimeBasedAnimationController("linear", 2000, 0, 1),
    new TimeBasedAnimationController(
      "ease-in-out",
      3000,
      0,
      1
    ).observeWhileRunning((x) => {
      colliderAlphas = x;
      container.setZoom(1 - x * 0.7);
      const targetScroll = -2 * CANVAS_WIDTH;
      container.setScroll(oldScroll + (targetScroll - oldScroll) * x, 0);
    }),
    new FadingTextComponent(
      "And as we go about daily life, people and places express bias because of those differences.",
      8000
    ).withAudio("2025-04-02 21-31-25.mp3"),
    new TimeBasedAnimationController("linear", 3000, 0, 0),
    new FadingTextComponent(
      "In many places, judgments are made and biases are created because of these differences:",
      5000
    ).withAudio("2025-04-02 21-32-03.mp3"),
    new FadingTextComponent(
      "differences of simply perceived race or ethnicity.",
      5000
    ),
    new TimeBasedAnimationController("linear", 2000, 0, 0),
    new PretendCallbackAnimationController(() => {
      // make the left floor disappear
      world.removeCollider(leftFloor, true);
      worldColliders.splice(worldColliders.indexOf(leftFloor), 1);
    }),
    new TimeBasedAnimationController("linear", 2000, 0, 0),
    new PretendCallbackAnimationController(() => {
      growTextAnimation.start();
      setTimeout(() => {
        scrimAnimation.start();
      }, 5000);
    }),
    (thisIsText = new FadingTextComponent(
      "This is racial discrimination.",
      10000
    ).withAudio("2025-04-02 21-34-29.mp3")),
    new FadingTextComponent(
      "Like the slope causing the bouncing balls to bounce in different directions, unconscious and conscious judgments are made towards people because of their properties.",
      10000
    )
      .withAudio("2025-04-02 21-34-38.mp3")
      .onClose(() => {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }),
  ];

  sequenceAnimations(animations);

  let container: ScrollingContainer;
  let redDot: ImageComponent;
  let blueDot: ImageComponent;

  return [
    new LifecycleCallbackComponent(() => {
      world.step();
      redDot.setBounds({
        x: (redBody.translation().x - 0.5) * PIXELS_PER_METER,
        y: (redBody.translation().y + 0.5) * -PIXELS_PER_METER,
      });
      blueDot.setBounds({
        x: (blueBody.translation().x - 0.5) * PIXELS_PER_METER,
        y: (blueBody.translation().y + 0.5) * -PIXELS_PER_METER,
      });
    }),
    (ctx: CanvasRenderingContext2D) => {
      const oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = oldAlpha * blackBackgroundAlpha;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = oldAlpha;
    },
    (container = new ScrollingContainer(
      [
        (ctx: CanvasRenderingContext2D) => {
          ctx.globalAlpha = dotsAlpha;
          ctx.filter = `grayscale(${dotsGray * 100}%)`;
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
        (ctx: CanvasRenderingContext2D) => {
          ctx.globalAlpha = colliderAlphas;
          ctx.filter = "";
          for (const collider of worldColliders) {
            ctx.fillStyle = "#eee";
            const shape = collider.shape as RAPIER.Cuboid;
            ctx.save();
            ctx.translate(
              collider.translation().x * PIXELS_PER_METER,
              -collider.translation().y * PIXELS_PER_METER
            );
            ctx.rotate(-collider.rotation());
            ctx.translate(
              -collider.translation().x * PIXELS_PER_METER,
              collider.translation().y * PIXELS_PER_METER
            );
            ctx.fillRect(
              collider.translation().x * PIXELS_PER_METER -
                shape.halfExtents.x * PIXELS_PER_METER,
              -collider.translation().y * PIXELS_PER_METER -
                shape.halfExtents.y * PIXELS_PER_METER,
              shape.halfExtents.x * 2 * PIXELS_PER_METER,
              shape.halfExtents.y * 2 * PIXELS_PER_METER
            );
            ctx.restore();
          }
          ctx.globalAlpha = 1.0;
        },
      ],
      {
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }
    ).setScroll(oldScroll, 0)),
    (ctx: CanvasRenderingContext2D) => {
      const oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = oldAlpha * scrimAnimation.value;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = oldAlpha;
    },
    ...animations.map((animation) =>
      animation instanceof TimeBasedAnimationController
        ? animation.listener()
        : animation
    ),
    scrimAnimation.listener(),
    growTextAnimation.listener(),
  ];
}
