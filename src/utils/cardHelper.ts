import {Slot} from '../types/Map'
import {Action, HandCard, OpenSide} from '../types/Cards'
import GameState from '../types/GameState'
import {Ctx} from 'boardgame.io'
import Player from '../types/Player'
import {isActionCard, isBlockCard} from "../types/typeGuards";

export const slotForSide = (slot: Slot, side: OpenSide): Slot => {
    switch (side) {
        case OpenSide.Up: return { x: slot.x, y: slot.y - 1 }
        case OpenSide.Down: return { x: slot.x, y: slot.y + 1 }
        case OpenSide.Left: return { x: slot.x - 1, y: slot.y }
        case OpenSide.Right: return { x: slot.x + 1, y: slot.y }
    }
}

export const flipSide = (side: OpenSide): OpenSide => {
    switch (side) {
        case OpenSide.Up: return OpenSide.Down
        case OpenSide.Down: return OpenSide.Up
        case OpenSide.Left: return OpenSide.Right
        case OpenSide.Right: return OpenSide.Left
    }
}

export const getSelectedCard = (G: GameState, ctx: Ctx): HandCard | undefined => {
    const player: Player = G.players[Number(ctx.currentPlayer)]
    if (player.selectedCard === undefined) {
        return undefined
    }
    return player.hand[player.selectedCard]
}

export const selectedBlock = (G: GameState, ctx: Ctx): boolean => {
    const card = getSelectedCard(G, ctx)
    return isBlockCard(card) && card.action === Action.Block
}

export const selectedUnblock = (G: GameState, ctx: Ctx): boolean => {
    const card = getSelectedCard(G, ctx)
    return isBlockCard(card) && card.action === Action.Unblock
}

export const selectedPeek = (G: GameState, ctx: Ctx): boolean => {
    const card = getSelectedCard(G, ctx)
    return isActionCard(card) && card.action === Action.Peek
}

export const selectedDestroy = (G: GameState, ctx: Ctx): boolean => {
    const card = getSelectedCard(G, ctx)
    return isActionCard(card) && card.action === Action.Destroy
}
