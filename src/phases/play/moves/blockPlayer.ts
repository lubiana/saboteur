import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {selected} from "../../../utils/cardHelper";
import {INVALID_MOVE} from "boardgame.io/core";
import {discardCard} from "./index";
import {isBlockCard} from "../../../types/guards";

const blockPlayer = (G: GameState, ctx: Ctx, playerId: number) => {
  const card = selected(G, ctx)

  if (isBlockCard(card)) {
    G.players[playerId].blockers.push(card.tools[0])
    discardCard(G, ctx)
  } else {
    return INVALID_MOVE
  }
}

export default blockPlayer
