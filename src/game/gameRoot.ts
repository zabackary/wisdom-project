import explanationScene from "./levels/explanation";
import hevelScene from "./levels/hevel";
import introScene from "./levels/intro";
import startScreen from "./levels/startScreen";
import StateRecreationMatch from "./utils/StateRecreationMatch";

export const PIXEL_ART_SIZE = 6;
export const PIXELS_PER_METER = 32 * 6;
export const CANVAS_WIDTH = BUILD_WIDTH;
export const CANVAS_HEIGHT = BUILD_HEIGHT;
export const FONT = '"Titillium Web"';
export const PROSE_FONT = '"Newsreader"';
export const RACE_ONE_COLOR = "#FF0000";
export const RACE_TWO_COLOR = "#6666FF";

export default function gameRoot() {
  const level = "start";
  let match: StateRecreationMatch;
  return [
    (match = new StateRecreationMatch(
      {
        start: () =>
          startScreen(() => {
            match.set("intro");
          }),
        intro: () =>
          introScene(() => {
            match.set("explanation");
          }),
        explanation: () =>
          explanationScene(() => {
            match.set("hevel");
          }),
        hevel: () =>
          hevelScene(() => {
            match.set("start");
          }),
      },
      level
    )),
  ];
}
