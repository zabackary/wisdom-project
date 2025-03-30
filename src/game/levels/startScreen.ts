import TextComponent, {
  HorizontalAlignment,
} from "../../framework/components/TextComponent";
import TimeBasedAnimationController from "../../framework/controllers/TimeBasedAnimationController";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../gameRoot";
import MessageComponent from "../utils/MessageComponent";
import RoundedButtonComponent from "../utils/RoundedButtonComponent";

// filepath: /home/zabackary/projects/wisdom-project/src/game/levels/startScreen.ts

export default function startScreen(onStart: () => void) {
  let aboutMessage = new MessageComponent(
    "About this project",
    "This project is written in TypeScript using HTML5 Canvas and a custom framework (reused from a project last year). It uses Rapier for physics simulations.\nThis project explores the themes of wisdom and meaninglessness in the problem of racial discrimination based on Proverbs and Ecclesiastes.",
    false
  );
  return [
    // Fade-in effect for the title
    new TextComponent(
      "hokma and hevel in racial discrimination",
      {
        fontSize: 40,
        textAlign: HorizontalAlignment.Center,
      },
      {
        x: 50,
        y: CANVAS_HEIGHT / 2 - 80,
        width: CANVAS_WIDTH - 100,
        height: 100,
      }
    ).addController(
      new TimeBasedAnimationController(
        "ease-in-out", // Easing curve
        1000, // Duration in milliseconds
        0, // Start opacity
        1, // End opacity
        true // Immediate start
      ),
      function (x) {
        this.setOpacity(x);
        this.setBounds({
          y: CANVAS_HEIGHT / 2 - 80 - (1 - x) * 20,
        });
      }
    ),
    // Start button
    new RoundedButtonComponent(
      {
        x: CANVAS_WIDTH / 2 - 100,
        y: CANVAS_HEIGHT / 2 - 25,
        width: 200,
        height: 50,
      },
      10, // radius
      "#eee", // fillColor
      "#bbb", // hoverColor
      "#000000", // borderColor
      0, // borderWidth
      () => {
        onStart();
      },
      "Start"
    ),
    new TextComponent(
      "created by zachary c · q3 2025 · caj wisdom 10/11",
      {
        fontSize: 18,
        textAlign: HorizontalAlignment.Center,
      },
      {
        x: 50,
        y: CANVAS_HEIGHT / 2 + 50,
        width: CANVAS_WIDTH - 100,
        height: 100,
      }
    ).addController(
      new TimeBasedAnimationController(
        "ease-in-out", // Easing curve
        2000, // Duration in milliseconds
        0, // Start opacity
        1 // End opacity
      ).startWithDelay(2000),
      function (x) {
        this.setOpacity(x);
      }
    ),
    // GitHub link at the bottom left
    new RoundedButtonComponent(
      {
        x: 10,
        y: CANVAS_HEIGHT - 40,
        width: 130,
        height: 30,
      },
      15, // radius
      "#fff", // fillColor
      "#bbb", // hoverColor
      "#000000", // borderColor
      1, // borderWidth
      () => {
        window.open("https://github.com/zabackary/wisdom-project", "_blank");
      },
      "project on github",
      {
        fontSize: 14,
      }
    ),
    new RoundedButtonComponent(
      {
        x: 150,
        y: CANVAS_HEIGHT - 40,
        width: 80,
        height: 30,
      },
      15, // radius
      "#fff", // fillColor
      "#bbb", // hoverColor
      "#000000", // borderColor
      1, // borderWidth
      () => {
        aboutMessage.show();
      },
      "about",
      {
        fontSize: 14,
      }
    ),
    new RoundedButtonComponent(
      {
        x: CANVAS_WIDTH - 150,
        y: CANVAS_HEIGHT - 40,
        width: 140,
        height: 30,
      },
      15, // radius
      "#fff", // fillColor
      "#bbb", // hoverColor
      "#000000", // borderColor
      1, // borderWidth
      () => {
        alert("Not implemented");
      },
      "connect audio files",
      {
        fontSize: 14,
      }
    ),
    aboutMessage,
  ];
}
