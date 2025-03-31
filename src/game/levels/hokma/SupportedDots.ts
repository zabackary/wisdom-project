import * as RAPIER from "@dimforge/rapier2d";
import Container from "../../../framework/components/Container";
import LifecycleCallbackComponent from "../../../framework/components/LifecycleCallbackComponent";
import TimeBasedAnimationController from "../../../framework/controllers/TimeBasedAnimationController";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PIXELS_PER_METER,
  RACE_ONE_COLOR,
  RACE_TWO_COLOR,
} from "../../gameRoot";

const DEFAULT_COLOR = "#666";
const CIRCLE_RADIUS = 0.2;

/**
 * A component that uses Rapier to randomly drop circles.
 */
export class SupportedDots extends Container {
  private world: RAPIER.World;
  private colliderColorMap: Map<RAPIER.Collider, string> = new Map();
  private grayscaleAnimation: TimeBasedAnimationController =
    new TimeBasedAnimationController("ease-in-out", 2000, 0, 1);

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

    // Create a ball collider attached to the dynamic rigidBody.
    let colliderDesc = RAPIER.ColliderDesc.ball(radius);
    const collider = this.world.createCollider(colliderDesc, body);
    this.colliderColorMap.set(collider, color);
    return body;
  }

  private initializeWalls(bottomWallTopCoord: number) {
    // Create walls around the canvas.
    const wallThickness = 0.1;
    const wallHeight = CANVAS_HEIGHT / PIXELS_PER_METER;
    const wallWidth = CANVAS_WIDTH / PIXELS_PER_METER;
    // Bottom wall
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        wallWidth / 2,
        wallThickness / 2
      ).setTranslation(wallWidth / 2, -bottomWallTopCoord - wallThickness / 2)
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

  dropCircles(
    bottomWallTopCoord: number,
    numBalls: number,
    ballDelayMs: number
  ) {
    // Create the walls.
    this.initializeWalls(bottomWallTopCoord / PIXELS_PER_METER);

    // Drop the circles.
    for (let i = 0; i < numBalls; i++) {
      setTimeout(() => {
        const radius = CIRCLE_RADIUS + (Math.random() - 0.5) / 100;
        this.createCircle(
          radius +
            Math.random() * (CANVAS_WIDTH / PIXELS_PER_METER - radius * 2),
          -radius,
          radius,
          Math.random() < 0.5 ? RACE_ONE_COLOR : RACE_TWO_COLOR
        );
      }, i * ballDelayMs);
    }
  }
}
