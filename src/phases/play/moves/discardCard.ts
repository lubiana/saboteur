import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {INVALID_MOVE} from "boardgame.io/core";
import {HandCard} from "../../../types/Cards";

const discardCard = (G: GameState, ctx: Ctx) => {
  const currentPlayer = Number(ctx.currentPlayer)
  const selectedCard = G.players[currentPlayer].selectedCard
  if (selectedCard) {

    const card: HandCard[] = G.players[currentPlayer].hand.splice(selectedCard, 1)
    G.players[currentPlayer].selectedCard = undefined
    G.discardPile.push(...card)

    const playerCard = G.drawPile.pop()
    if (playerCard) {
      G.players[currentPlayer].hand.push(playerCard)
    }
    ctx.events?.endTurn()
  } else {
    return INVALID_MOVE
  }
}

export default discardCard
