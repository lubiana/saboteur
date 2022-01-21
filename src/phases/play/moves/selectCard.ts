import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {INVALID_MOVE} from "boardgame.io/core";
import {flipCard} from "./index";
import {isPathTile} from "../../../types/guards";

const selectCard = (G: GameState, ctx: Ctx, index: number) => {
  let player = G.players[Number(ctx.currentPlayer)];

  if (index === player.selectedCard && isPathTile(player.hand[index])) {
    flipCard(G, ctx)
  } else if (index in player.hand) {
    player.selectedCard = index
  } else {
    return INVALID_MOVE
  }
}

export default selectCard
