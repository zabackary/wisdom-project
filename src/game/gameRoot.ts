import explanationScene from "./levels/explanation";
import introScene from "./levels/intro";
import startScreen from "./levels/startScreen";
import StateRecreationMatch from "./utils/StateRecreationMatch";

export const PIXEL_ART_SIZE = 6;
export const PIXELS_PER_METER = 32 * 6;
export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 720;
export const FONT = '"Titillium Web"';
export const PROSE_FONT = '"Newsreader"';

export default function gameRoot() {
  const level = "start";
  let match: StateRecreationMatch;
  return [
    (match = new StateRecreationMatch(
      {
        start: () =>
          startScreen(() => {
            match.set("explanation");
          }),
        intro: () =>
          introScene(() => {
            match.set("explanation");
          }),
        explanation: () =>
          explanationScene(() => {
            match.set("start");
          }),
      },
      level
    )),
  ];
}
