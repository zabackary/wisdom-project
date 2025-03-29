import { Match } from "../framework/components/conditionals";
import introScene from "./levels/intro";
import startScreen from "./levels/startScreen";

export const PIXEL_ART_SIZE = 6;
export const PIXELS_PER_METER = 32 * 6;
export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 720;
export const FONT = '"Titillium Web"';
export const PROSE_FONT = '"Newsreader"';

export default function gameRoot() {
  const level = "startScreen";
  let match: Match;
  return [
    (match = new Match(
      {
        startScreen: () =>
          startScreen(() => {
            match.set("intro");
          }),
        intro: () =>
          introScene(() => {
            // match.set("select");
          }),
      },
      level
    )),
  ];
}
