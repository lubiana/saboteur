import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {INVALID_MOVE} from "boardgame.io/core";
import {selected} from "../../../utils/cardHelper";
import {isPathTile} from "../../../types/guards";
import {OpenSide} from "../../../types/Cards";

const flipCard = (G: GameState, ctx: Ctx) => {
  const card = selected(G, ctx)

  if (isPathTile(card)) {
    card.openSides = card.openSides.map(v => flipSide(v))
  } else {
    return INVALID_MOVE
  }
}

const flipSide = (side: OpenSide): OpenSide => {
  switch (side) {
    case OpenSide.Up: return OpenSide.Down
    case OpenSide.Down: return OpenSide.Up
    case OpenSide.Left: return OpenSide.Right
    case OpenSide.Right: return OpenSide.Left
  }
}

export default flipCard
