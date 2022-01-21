import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {selected} from "../../../utils/cardHelper";
import {INVALID_MOVE} from "boardgame.io/core";
import {discardCard} from "./index";
import {isUnblockCard} from "../../../types/guards";

const unblockPlayer = (G: GameState, ctx: Ctx, playerId: number) => {
  const card = selected(G, ctx)

  if (isUnblockCard(card)) {
    const blockerIndex = G.players[playerId].blockers
      .findIndex(b => card.tools.includes(b))

    if (blockerIndex === -1) {
      return INVALID_MOVE
    }

    G.players[playerId].blockers.splice(blockerIndex, 1)
    discardCard(G, ctx)
  } else {
    return INVALID_MOVE
  }
}

export default unblockPlayer
