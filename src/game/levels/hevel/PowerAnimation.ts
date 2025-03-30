import * as RAPIER from "@dimforge/rapier2d";
import Container from "../../../framework/components/Container";
import LifecycleCallbackComponent from "../../../framework/components/LifecycleCallbackComponent";
import TimeBasedAnimationController, {
  EASING_CURVES,
} from "../../../framework/controllers/TimeBasedAnimationController";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PIXELS_PER_METER,
  RACE_ONE_COLOR,
  RACE_TWO_COLOR,
} from "../../gameRoot";

const DEFAULT_COLOR = "#666";
const CIRCLE_RADIUS = 0.2;
const CIRCLE_SPACING = 0.2;

/**
 * A component that uses Rapier to render a grid of circles (again) and a single different circle.
 */
export class PowerAnimation extends Container {
  private world: RAPIER.World;
  private colliderColorMap: Map<RAPIER.Collider, string> = new Map();
  private grayscaleAnimation: TimeBasedAnimationController =
    new TimeBasedAnimationController("ease-in-out", 2000, 0, 1);
  private theBall: RAPIER.RigidBody | null = null;

  constructor() {
    super([], {
      x: 0,
      y: 0,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });
    this.world = new RAPIER.World({
      x: 0.0,
      y: -9.81,
    });
    this.addChild(
      new LifecycleCallbackComponent(() => {
        this.world.step();
      })
    );
    this.addChild(this.grayscaleAnimation.listener());
    this.addChild((context: CanvasRenderingContext2D) => {
      context.filter = `grayscale(${this.grayscaleAnimation.value * 100}%)`;
      this.world.bodies.forEach((body) => {
        if (body.numColliders() === 0) return;
        const collider = body.collider(0);
        context.fillStyle =
          this.colliderColorMap.get(collider) || DEFAULT_COLOR;

        switch (collider.shape.type) {
          case RAPIER.ShapeType.Cuboid:
            const cuboid = collider.shape as RAPIER.Cuboid;
            context.save();
            context.translate(
              collider.translation().x * PIXELS_PER_METER,
              -collider.translation().y * PIXELS_PER_METER
            );
            context.rotate(-collider.rotation());
            context.translate(
              -collider.translation().x * PIXELS_PER_METER,
              collider.translation().y * PIXELS_PER_METER
            );
            context.fillRect(
              collider.translation().x * PIXELS_PER_METER -
                cuboid.halfExtents.x * PIXELS_PER_METER,
              -collider.translation().y * PIXELS_PER_METER -
                cuboid.halfExtents.y * PIXELS_PER_METER,
              cuboid.halfExtents.x * 2 * PIXELS_PER_METER,
              cuboid.halfExtents.y * 2 * PIXELS_PER_METER
            );
            context.restore();
            break;
          case RAPIER.ShapeType.Ball:
            const ball = collider.shape as RAPIER.Ball;
            context.beginPath();
            context.arc(
              collider.translation().x * PIXELS_PER_METER,
              -collider.translation().y * PIXELS_PER_METER,
              ball.radius * PIXELS_PER_METER,
              0,
              Math.PI * 2
            );
            context.fill();
            break;
          default:
            console.warn("Unsupported shape type:", collider.shape.type);
            break;
        }
      });
      context.filter = "none";
    });
  }

  private createCircle(
    x: number,
    y: number,
    radius: number,
    color: string = DEFAULT_COLOR
  ): RAPIER.RigidBody {
    let desc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, -y);
    const body = this.world.createRigidBody(desc);
    body.setEnabled(false);

    // Create a ball collider attached to the dynamic rigidBody.
    let colliderDesc = RAPIER.ColliderDesc.ball(radius);
    const collider = this.world.createCollider(colliderDesc, body);
    this.colliderColorMap.set(collider, color);
    return body;
  }

  private initializeWalls() {
    // Create walls around the canvas.
    const wallThickness = 0.1;
    const wallHeight = CANVAS_HEIGHT / PIXELS_PER_METER;
    const wallWidth = CANVAS_WIDTH / PIXELS_PER_METER;
    // Top wall
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        wallWidth / 2,
        wallThickness / 2
      ).setTranslation(wallWidth / 2, wallThickness / 2)
    );
    // Bottom wall
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        wallWidth / 2,
        wallThickness / 2
      ).setTranslation(wallWidth / 2, -wallHeight - wallThickness / 2)
    );
    // Left wall
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        wallThickness / 2,
        wallHeight / 2
      ).setTranslation(-wallThickness / 2, -wallHeight / 2)
    );
    // Right wall
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        wallThickness / 2,
        wallHeight / 2
      ).setTranslation(wallWidth + wallThickness / 2, -wallHeight / 2)
    );
  }

  initializeCircles() {
    // Create a nice grid of circles, with the center circle being the one that is different.
    // Base the number of circles on the CANVAS_WIDTH and CANVAS_HEIGHT.
    const numRows = Math.floor(
      CANVAS_HEIGHT / PIXELS_PER_METER / (CIRCLE_RADIUS * 2 + CIRCLE_SPACING)
    );
    const numCols = Math.floor(
      CANVAS_WIDTH / PIXELS_PER_METER / (CIRCLE_RADIUS * 2 + CIRCLE_SPACING)
    );
    const centerRow = Math.floor((numRows + 1) / 2);
    const centerCol = Math.floor((numCols + 1) / 2);
    // Calculate the offset to center the circles in the canvas.
    const offsetX =
      (CANVAS_WIDTH / PIXELS_PER_METER -
        numCols * (CIRCLE_RADIUS * 2 + CIRCLE_SPACING)) /
      2;
    const offsetY =
      (CANVAS_HEIGHT / PIXELS_PER_METER -
        numRows * (CIRCLE_RADIUS * 2 + CIRCLE_SPACING)) /
      2;
    // Create the circles in a grid. Skip the first row.
    for (let row = 1; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        setTimeout(() => {
          if (row === centerRow && col === centerCol) {
            this.theBall = this.createCircle(
              col * (CIRCLE_RADIUS * 2 + CIRCLE_SPACING) +
                offsetX +
                CIRCLE_RADIUS,
              row * (CIRCLE_RADIUS * 2 + CIRCLE_SPACING) +
                offsetY +
                CIRCLE_RADIUS,
              CIRCLE_RADIUS,
              RACE_ONE_COLOR
            );
          } else {
            this.createCircle(
              col * (CIRCLE_RADIUS * 2 + CIRCLE_SPACING) +
                offsetX +
                CIRCLE_RADIUS +
                (Math.random() - 0.5) / 20,
              row * (CIRCLE_RADIUS * 2 + CIRCLE_SPACING) +
                offsetY +
                CIRCLE_RADIUS +
                (Math.random() - 0.5) / 20,
              CIRCLE_RADIUS + (Math.random() - 0.5) / 100,
              Math.random() < 0.5 ? DEFAULT_COLOR : RACE_TWO_COLOR
            );
          }
        }, Math.random() * 1000);
      }
    }

    // Create the walls.
    this.initializeWalls();
  }

  animateTheBall() {
    return new Promise<void>((resolve) => {
      if (this.theBall) {
        const numRows = Math.floor(
          CANVAS_HEIGHT /
            PIXELS_PER_METER /
            (CIRCLE_RADIUS * 2 + CIRCLE_SPACING)
        );
        const offsetY =
          (CANVAS_HEIGHT / PIXELS_PER_METER -
            numRows * (CIRCLE_RADIUS * 2 + CIRCLE_SPACING)) /
          2;
        this.addChild(
          new TimeBasedAnimationController(
            "ease-in-out",
            2000,
            this.theBall.translation().y,
            -(offsetY + CIRCLE_RADIUS),
            true
          )
            .observeWhileRunning((y) => {
              this.theBall?.setTranslation(
                {
                  x: this.theBall.translation().x,
                  y,
                },
                true
              );
            })
            .onFinish(() => {
              resolve();
            })
            .listener()
        );
      } else {
        console.warn("attempting to animate the ball before initialization");
        resolve();
      }
    });
  }

  fadeToGrayscale() {
    return new Promise<void>((resolve) => {
      this.grayscaleAnimation.start().onFinish(() => {
        resolve();
      });
    });
  }

  async dropBalls() {
    this.world.bodies.forEach((body) => {
      body.setEnabled(true);
    });
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  async removeBalls(timeMs: number = 8000) {
    this.world.bodies.forEach((body) => {
      setTimeout(() => {
        this.world.removeRigidBody(body);
      }, EASING_CURVES["ease-out"](Math.random()) * timeMs);
    });
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeMs);
    });
  }
}
