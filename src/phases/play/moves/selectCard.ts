import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {CardType} from "../../../types/Cards";
import {INVALID_MOVE} from "boardgame.io/core";
import {flipCard} from "./index";
import Player from "../../../types/Player";

const isPathCardSelected = (player: Player, index: number) =>
    index === player.selectedCard && player.hand[index].type === CardType.Path;

const selectCard = (G: GameState, ctx: Ctx, index: number) => {
    const currentPlayer = Number(ctx.currentPlayer)
    if (isPathCardSelected(G.players[currentPlayer], index)) {
        flipCard(G, ctx)
        return
    }
    if (index in G.players[currentPlayer].hand) {
        G.players[currentPlayer].selectedCard = index
        return
    }
    return INVALID_MOVE
}

export default selectCard
