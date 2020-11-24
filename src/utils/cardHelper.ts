import { Coordinate } from '../types/Map'
import { OpenSide, HandCard, CardType, BlockItem, Action } from '../types/Cards'
import GameState from '../types/GameState'
import { Ctx } from 'boardgame.io'
import Player from '../types/Player'

export const coordForSide = (coords: Coordinate, side: OpenSide): Coordinate => {
    if (side === OpenSide.Up) return { x: coords.x, y: coords.y - 1 }
    if (side === OpenSide.Down) return { x: coords.x, y: coords.y + 1 }
    if (side === OpenSide.Left) return { x: coords.x - 1, y: coords.y }
    if (side === OpenSide.Right) return { x: coords.x + 1, y: coords.y }
    throw (new Error('Invalid Input'))
}

export const flipSide = (side: OpenSide): OpenSide => {
    if (side === OpenSide.Up) return OpenSide.Down
    if (side === OpenSide.Down) return OpenSide.Up
    if (side === OpenSide.Left) return OpenSide.Right
    if (side === OpenSide.Right) return OpenSide.Left
    throw (new Error('Invalid Input'))
}

export const getSelectedCard = (G: GameState, ctx: Ctx): HandCard | undefined => {
    const player: Player = G.players[Number(ctx.currentPlayer)]
    if (player.selectedCard === undefined) {
        return undefined
    }

    return player.cards[player.selectedCard]
}

export const getSelectedCardType = (G: GameState, ctx: Ctx): CardType | undefined => {
    const card = getSelectedCard(G, ctx)
    if (card === undefined) {
        return undefined
    }
    return card.type
}

export const selectedBlock = (G: GameState, ctx: Ctx): boolean => {
    const card = getSelectedCard(G, ctx)
    return card !== undefined && card.type === CardType.Action && card.action === Action.Block
}

export const selectedUnblock = (G: GameState, ctx: Ctx): boolean => {
    const card = getSelectedCard(G, ctx)
    return card !== undefined && card.type === CardType.Action && card.action === Action.Unblock
}

export const selectedPeek = (G: GameState, ctx: Ctx): boolean => {
    const card = getSelectedCard(G, ctx)
    return card !== undefined && card.type === CardType.Action && card.action === Action.Peek
}

export const selectedDestroy = (G: GameState, ctx: Ctx): boolean => {
    const card = getSelectedCard(G, ctx)
    return card !== undefined && card.type === CardType.Action && card.action === Action.Destroy
}