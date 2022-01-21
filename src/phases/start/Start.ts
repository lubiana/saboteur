import {pickRoleCard} from "./moves";
import {endIf, onBegin, onEnd} from "./hooks";

const Start = {
  start: true,
  next: "play",
  onBegin,
  onEnd,
  endIf,
  moves: {
    pickRoleCard,
  }
}

export default Start
