import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {INVALID_MOVE} from "boardgame.io/core";
import {CardType, HandCard} from "../../../types/Cards";
import {flipSide} from "../../../utils/cardHelper";

const flipCard = (G: GameState, ctx: Ctx) => {
    const currentPlayer = Number(ctx.currentPlayer)
    const selectedCard = G.players[currentPlayer].selectedCard
    if (selectedCard === undefined) {
        return INVALID_MOVE
    }

    const card: HandCard = G.players[currentPlayer].hand[selectedCard]
    if (card.type !== CardType.Path) {
        return INVALID_MOVE
    }

    card.openSides = card.openSides.map(v => flipSide(v))
}

export default flipCard

