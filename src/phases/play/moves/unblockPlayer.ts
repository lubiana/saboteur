import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {canUnblock, selected} from "../../../utils/cardHelper";
import {INVALID_MOVE} from "boardgame.io/core";
import {discardCard} from "./index";
import {isUnblockCard} from "../../../types/guards";
import {Tool} from "../../../types/Cards";

const unblockPlayer = (G: GameState, ctx: Ctx, playerId: number, tool: Tool) => {
  const player = G.players[playerId];
  const card = selected(G, ctx)

  if (isUnblockCard(card) && canUnblock(card, tool, player)) {
    player.blockers[tool] = false
    discardCard(G, ctx)
  } else {
    return INVALID_MOVE
  }
}

export default unblockPlayer
