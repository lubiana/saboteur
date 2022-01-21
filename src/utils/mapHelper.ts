import {Map, MapItem, Slot} from '../types/Map'
import GameState from '../types/GameState'
import {Ctx} from "boardgame.io"
import Player from "../types/Player"
import {OpenSide} from '../types/Cards'
import {selected} from './cardHelper'
import {isDestroyCard, isEndTile, isMapCard, isPathTile, isPeekCard} from "../types/guards";

export interface MapBoundaries {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export const getBoundaries = (map: Map): MapBoundaries => ({
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

const getSelectedCardSides = (G: GameState, ctx: Ctx): OpenSide[] => {
  const card = selected(G, ctx)
  return isMapCard(card) ? card.openSides : []
}

const getSiblings = (slot: Slot): [Slot, Slot, Slot, Slot] => {
  const {x, y} = slot
  return [
    {x: x, y: y - 1},
    {x: x, y: y + 1},
    {x: x - 1, y: y},
    {x: x + 1, y: y},
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

  const card = selected(G, ctx)
  if (!isPathTile(card)) {
    return false
  }

  const siblingCards = getSiblingCards(getSiblings(slot), G.map.items)

  const validSibling = (sibling: MapItem): boolean => {
    if (isEndTile(sibling.card) && !sibling.card.uncovered) {
      return true
    }
    return sibling.card.deadEnd
  }

  if (siblingCards.every(validSibling)) {
    return false
  }

  if (!pathToZero(slot, card.openSides, G.map.items, [])) {
    return false
  }

  const place: CompareItem = {
    slot: slot,
    sides: card.openSides,
  }

  return siblingCards
    .map(mapItemToCompareItem)
    .every((sibling) => compatible(place, sibling, true))
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
    .filter((value) => value.mapItem && !value.mapItem.card.deadEnd)

  return paths.some((path) => {
    if (path.mapItem === undefined) {
      return false
    }

    if (!compatible({slot: slot, sides: sides}, mapItemToCompareItem(path.mapItem), false)) {
      return false
    }

    return pathToZero(path.slot, path.mapItem.card.openSides, map, prev)
  })
}

const slotForSide = (slot: Slot, side: OpenSide): Slot => {
  switch (side) {
    case OpenSide.Up: return { x: slot.x, y: slot.y - 1 }
    case OpenSide.Down: return { x: slot.x, y: slot.y + 1 }
    case OpenSide.Left: return { x: slot.x - 1, y: slot.y }
    case OpenSide.Right: return { x: slot.x + 1, y: slot.y }
  }
}

interface CompareItem {
  slot: Slot
  sides: OpenSide[]
}

const mapItemToCompareItem = (item: MapItem): CompareItem => {
  return {slot: item.slot, sides: item.card.openSides}
}

const compatible = (a: CompareItem, b: CompareItem, noneAllowed: boolean = true): boolean => {
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
    if (isEndTile(matchedItem.card) && hasSibling(matchedItem.slot, mapItems)) {
      return
    }
    returnItems.push(matchedItem)
  })

  return returnItems
}

export const goldDiscovered = (G: GameState): boolean => {
  const gold = G.map.items.find(v => isEndTile(v.card) && v.card.gold)
  return !!gold && pathToZero(gold.slot, gold.card.openSides, G.map.items, [])
}

export const removeCardFromMap = (G: GameState, ctx: Ctx, slot: Slot) => {
  const cardIndex = getMapItemIndex(slot, G.map.items)
  G.map.items.splice(cardIndex, 1)
}

export const canPeekCard = (G: GameState, ctx: Ctx, slot: Slot): boolean =>
  isPeekCard(selected(G, ctx)) && isEndTile(getMapItem(slot, G.map.items)?.card)

export const canDestroyCard = (G: GameState, ctx: Ctx, slot: Slot): boolean =>
  isDestroyCard(selected(G, ctx)) && isPathTile(getMapItem(slot, G.map.items)?.card)
