import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {selected} from "../../../utils/cardHelper";
import {INVALID_MOVE} from "boardgame.io/core";
import {discardCard} from "./index";
import {isBlockCard} from "../../../types/guards";

const blockPlayer = (G: GameState, ctx: Ctx, playerId: number) => {
  const player = G.players[playerId];
  const card = selected(G, ctx)

  if (isBlockCard(card) && !player.blockers[card.tool]) {
    player.blockers[card.tool] = true
    discardCard(G, ctx)
  } else {
    return INVALID_MOVE
  }
}

export default blockPlayer
