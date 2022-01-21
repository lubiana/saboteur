import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {INVALID_MOVE} from "boardgame.io/core";
import {HandCard} from "../../../types/Cards";
import {endTurn} from "../../../utils/eventHelper";

const discardCard = (G: GameState, ctx: Ctx) => {
    const currentPlayer = Number(ctx.currentPlayer)
    const selectedCard = G.players[currentPlayer].selectedCard
    if (selectedCard === undefined) {
        return INVALID_MOVE
    }

    const card: HandCard[] = G.players[currentPlayer].hand.splice(selectedCard, 1)
    G.players[currentPlayer].selectedCard = undefined
    G.discardPile.push(...card)
    const playerCard = G.drawPile.pop()

    if (playerCard !== undefined) {
        G.players[currentPlayer].hand.push(playerCard)
    }
    endTurn(ctx)
}

export default discardCard
