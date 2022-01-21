import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {INVALID_MOVE} from "boardgame.io/core";
import {flipSide, getSelectedCard} from "../../../utils/cardHelper";
import {isPathTile} from "../../../types/typeGuards";

const flipCard = (G: GameState, ctx: Ctx) => {
    const card = getSelectedCard(G, ctx)
    if (!isPathTile(card)) {
        return INVALID_MOVE
    }
    card.openSides = card.openSides.map(v => flipSide(v))
}

export default flipCard

