import {HandCard} from '../types/Cards'
import GameState from '../types/GameState'
import {Ctx} from 'boardgame.io'
import Player from '../types/Player'

export const selected = (G: GameState, ctx: Ctx): HandCard | undefined => {
    const player: Player = current(G, ctx)
    if (player.selectedCard === undefined) {
        return undefined
    }
    return player.hand[player.selectedCard]
}

export const isBlocked = (G: GameState, ctx: Ctx): boolean =>
  Object.values(current(G, ctx).blockers).some(t => t)

export const current = (G: GameState, ctx: Ctx): Player =>
  G.players[Number(ctx.currentPlayer)]
