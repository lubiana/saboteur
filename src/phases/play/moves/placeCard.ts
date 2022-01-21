import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {INVALID_MOVE} from "boardgame.io/core";
import {CardType, HandCard} from "../../../types/Cards";
import {endTurn} from "../../../utils/eventHelper";
import {Slot} from "../../../types/Map";

const placeCard = (G: GameState, ctx: Ctx, slot: Slot) => {
    const currentPlayer = Number(ctx.currentPlayer)
    const selectedCard = G.players[currentPlayer].selectedCard
    if (selectedCard === undefined) {
        return INVALID_MOVE
    }
    if (G.players[currentPlayer].blockers.length > 0) {
        return INVALID_MOVE
    }

    if (G.players[currentPlayer].hand[selectedCard].type !== CardType.Path) {
        return INVALID_MOVE
    }
    const card: HandCard[] = G.players[currentPlayer].hand.splice(selectedCard, 1)

    if (card[0].type !== CardType.Path) {
        return INVALID_MOVE
    }
    G.players[currentPlayer].selectedCard = undefined
    G.map.items.push({card: card[0], slot: slot})
    const playerCard = G.drawPile.pop()
    if (playerCard !== undefined) {
        G.players[currentPlayer].hand.push(playerCard)
    }
    endTurn(ctx)
}

export default placeCard
