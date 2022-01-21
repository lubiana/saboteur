import {HandCard} from '../types/Cards'
import GameState from '../types/GameState'
import {Ctx} from 'boardgame.io'
import Player from '../types/Player'

export const selected = (G: GameState, ctx: Ctx): HandCard | undefined => {
    const player: Player = G.players[Number(ctx.currentPlayer)]
    if (player.selectedCard === undefined) {
        return undefined
    }
    return player.hand[player.selectedCard]
}
