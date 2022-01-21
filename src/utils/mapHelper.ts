import { Map, MapItem, Slot } from '../types/Map'
import GameState from '../types/GameState'
import { Ctx } from "boardgame.io"
import Player from "../types/Player"
import { CardType, OpenSide, HandCard, PathTile, Action } from '../types/Cards'
import { slotForSide, getSelectedCard } from './cardHelper'

export interface mapBoundaries {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

const getBoundaries = (map: Map): mapBoundaries => ({
  minX: map.items.reduce((p: MapItem, c: MapItem) => (p.slot.x <= c.slot.x ? p : c)).slot.x,
  maxX: map.items.reduce((p: MapItem, c: MapItem) => (p.slot.x <= c.slot.x ? c : p)).slot.x,
  minY: map.items.reduce((p: MapItem, c: MapItem) => (p.slot.y <= c.slot.y ? p : c)).slot.y,
  maxY: map.items.reduce((p: MapItem, c: MapItem) => (p.slot.y <= c.slot.y ? c : p)).slot.y,
})

export const cardSelected = (G: GameState, ctx: Ctx, mapTile: boolean = false): boolean => {
  const player: Player = G.players[Number(ctx.currentPlayer)]
  if (player.selectedCard === undefined) {
    return false
  }
  return !(mapTile && getSelectedCardSides(G, ctx).length === 0);
}

const getMapItemIndex = (slot: Slot, map: MapItem[]): number => {
  return map.findIndex(item => item.slot.x === slot.x && item.slot.y === slot.y)
}

const getMapItem = (slot: Slot, map: MapItem[]): MapItem | undefined => {
  const index = getMapItemIndex(slot, map)
  if (index === -1) {
    return undefined
  }
  return map[index]
}

const getSelectedPathTile = (G: GameState, ctx: Ctx): PathTile | undefined => {
  const card = getSelectedCard(G, ctx)
  if (card === undefined) {
    return card
  }
  if ("openSides" in card) {
    return card
  }

  return undefined
}

const getSelectedCardSides = (G: GameState, ctx: Ctx): OpenSide[] => {
  const player: Player = G.players[Number(ctx.currentPlayer)]
  if (player.selectedCard === undefined) {
    return []
  }

  const card: HandCard = player.hand[player.selectedCard]
  if ("openSides" in card) {
    return card.openSides
  }

  return []
}

const getSiblings = (slot: Slot): [Slot, Slot, Slot, Slot] => {
  const {x, y} = slot
  return [
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
    { x: x - 1, y: y },
    { x: x + 1, y: y },
  ]
}

const hasSibling = (slot: Slot, items: MapItem[]): boolean => {
  return getSiblings(slot).some((slot: Slot) => !freeSlot(slot, items))
}

export const freeSlot = (slot: Slot, items: MapItem[]): boolean => {
  return !items.some((v: MapItem) => v.slot.x === slot.x && v.slot.y === slot.y)
}

export const canPlaceCard = (G: GameState, ctx: Ctx, slot: Slot): boolean => {
  if (!cardSelected(G, ctx, true)) {
    return false
  }
  if (!hasSibling(slot, G.map.items)) {
    return false
  }
  if (!freeSlot(slot, G.map.items)) {
    return false
  }

  const selectedCard = getSelectedPathTile(G, ctx)
  if (selectedCard === undefined) {
    return false
  }

  const cardToPlace: MapItem = {
    slot: slot,
    card: selectedCard,
  }

  const siblingCards = getSiblingCards(getSiblings(slot), G.map.items)

  const validSibling = (sibling: MapItem): boolean => {
    if ('uncovered' in sibling.card && !sibling.card.uncovered) {
      return true
    }
    return sibling.card.deadEnd
  }

  if (siblingCards.every(validSibling)) {
    return false
  }

  if (!pathToZero(slot, selectedCard.openSides, G.map.items, [])) {
    return false
  }

  return siblingCards.every((item) => {
    const place: compareItem = {
      sides: cardToPlace.card.openSides,
      slot: cardToPlace.slot,
    }
    const sibling: compareItem = {
      sides: item.card.openSides,
      slot: item.slot,
    }
    return cardCompatibility(place, sibling, true)
  })
}

export const pathToZero = (slot: Slot, sides: OpenSide[], map: MapItem[], prev: Slot[] = []): boolean => {
  if (slot.x === 0 && slot.y === 0) {
    return true
  }
  if (prev.some((v) => v.x === slot.x && v.y === slot.y)) {
    return false
  }
  prev.push(slot)

  const paths = sides
    .map((side) => {
      const resolvedSlot = slotForSide(slot, side)
      return {
        side: side,
        slot: resolvedSlot,
        mapItem: getMapItem(resolvedSlot, map),
      }
    })
    .filter((value) => {
      return value.mapItem !== undefined && !value.mapItem.card.deadEnd
    })

  return paths.some((path) => {
    if (path.mapItem === undefined) {
      return false
    }

    const compat = cardCompatibility({ slot: slot, sides: sides }, mapItemToCompareItem(path.mapItem), false)

    if (!compat) {
      return false
    }

    return pathToZero(path.slot, path.mapItem.card.openSides, map, prev)
  })
}

interface compareItem {
  slot: Slot
  sides: OpenSide[]
}

const mapItemToCompareItem = (item: MapItem): compareItem => {
  return { slot: item.slot, sides: item.card.openSides }
}

const cardCompatibility = (a: compareItem, b: compareItem, noneAllowed: boolean = true): boolean => {
  if (a.slot.x === b.slot.x) {
    if (a.slot.y > b.slot.y) {
      return checkSides(b.sides, a.sides, OpenSide.Down, OpenSide.Up, noneAllowed)
    }
    return checkSides(b.sides, a.sides, OpenSide.Up, OpenSide.Down, noneAllowed)
  }
  if (a.slot.y === b.slot.y) {
    if (a.slot.x > b.slot.x) {
      return checkSides(b.sides, a.sides, OpenSide.Right, OpenSide.Left, noneAllowed)
    }
    return checkSides(b.sides, a.sides, OpenSide.Left, OpenSide.Right, noneAllowed)
  }
  return false
}

const checkSides = (
  aSides: OpenSide[],
  bSides: OpenSide[],
  aReq: OpenSide,
  bReq: OpenSide,
  noneAllowed: boolean = true
): boolean => {
  const both = aSides.includes(aReq) && bSides.includes(bReq)
  const none = !aSides.includes(aReq) && !bSides.includes(bReq)
  return both || (none && noneAllowed)
}

const getSiblingCards = (siblings: Slot[], mapItems: MapItem[]): MapItem[] => {
  const returnItems: MapItem[] = []
  siblings.forEach((sibling) => {
    const matchedItem = mapItems.find((item) => item.slot.x === sibling.x && item.slot.y === sibling.y)
    if (matchedItem === undefined) {
      return
    }
    if (matchedItem.card.type === CardType.End && hasSibling(matchedItem.slot, mapItems)) {
      return
    }
    returnItems.push(matchedItem)
  })

  return returnItems
}

export const goldDiscovered = (G: GameState): boolean => {
  const goldCard: MapItem | undefined = G.map.items.find(v => v.card.type === CardType.End && 'gold' in v.card && v.card.gold === true)
  if (goldCard === undefined) {
    return false
  }
  return pathToZero(goldCard.slot, goldCard.card.openSides, G.map.items, [])
}

export const removeCardFromMap = (G: GameState, ctx: Ctx, slot: Slot): GameState => {
  const cardIndex = getMapItemIndex(slot, G.map.items)
  G.map.items.splice(cardIndex, 1)
  return G
}

export const canPeekCard = (G: GameState, ctx: Ctx, slot: Slot): boolean => {
  const selectedCard = getSelectedCard(G, ctx)
  if (selectedCard === undefined) {
    return false
  }
  if (selectedCard.type !== CardType.Action) {
    return false
  }
  if (selectedCard.action !== Action.Peek) {
    return false
  }
  const mapCard = getMapItem(slot, G.map.items)
  if (mapCard === undefined) {
    return false
  }

  return mapCard.card.type === CardType.End;
}

export const canDestroyCard = (G: GameState, ctx: Ctx, slot: Slot): boolean => {
  const selectedCard = getSelectedCard(G, ctx)
  if (selectedCard === undefined) {
    return false
  }
  if (selectedCard.type !== CardType.Action) {
    return false
  }
  if (selectedCard.action !== Action.Destroy) {
    return false
  }

  const mapCard = getMapItem(slot, G.map.items)
  if (mapCard === undefined) {
    return false
  }

  return mapCard.card.type === CardType.Path;
}

export default getBoundaries
