import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {INVALID_MOVE} from "boardgame.io/core";
import {endTurn} from "../../../utils/eventHelper";
import {Slot} from "../../../types/Map";
import {isPathTile} from "../../../types/guards";
import {selected} from "../../../utils/cardHelper";

const placeCard = (G: GameState, ctx: Ctx, slot: Slot) => {
  const player = G.players[Number(ctx.currentPlayer)];
  const card = selected(G, ctx)

  let isBlocked = Object.values(player.blockers)
    .some(tool => tool)

  if (!isBlocked && isPathTile(card)) {
    player.hand.splice(player.selectedCard!!, 1)

    player.selectedCard = undefined
    G.map.items.push({card, slot})

    const playerCard = G.drawPile.pop()
    if (playerCard !== undefined) {
      player.hand.push(playerCard)
    }

    endTurn(ctx)
  } else {
    return INVALID_MOVE
  }
}

export default placeCard
