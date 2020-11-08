import { Map, MapItem, Coordinate } from '../types/Map'
import GameState from '../types/GameState'
import { Ctx } from "boardgame.io"
import Player from "../types/Player"
import { CardType, OpenSide, HandCard, PathTile } from '../types/Cards'
import { coordForSide } from "./cardHelper"

export interface mapBounddaries {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

const getBoundaries = (map: Map): mapBounddaries => ({
  minX: map.items.reduce((p: MapItem, c: MapItem) => (p.coords.x <= c.coords.x ? p : c)).coords.x,
  maxX: map.items.reduce((p: MapItem, c: MapItem) => (p.coords.x <= c.coords.x ? c : p)).coords.x,
  minY: map.items.reduce((p: MapItem, c: MapItem) => (p.coords.y <= c.coords.y ? p : c)).coords.y,
  maxY: map.items.reduce((p: MapItem, c: MapItem) => (p.coords.y <= c.coords.y ? c : p)).coords.y,
})

export const cardSelected = (G: GameState, ctx: Ctx, mapTile: boolean = false): boolean => {
  const player: Player = G.players[Number(ctx.currentPlayer)]
  if (player.selectedCard === undefined) {
    return false
  }
  if (mapTile && getSelectedCardSides(G, ctx).length === 0) {
    return false
  }
  return true
}

const findMapItem = (coord: Coordinate, map: MapItem[]): MapItem | undefined => {
  return map.find((item) => item.coords.x === coord.x && item.coords.y === coord.y)
}

const getSelectedCard = (G: GameState, ctx: Ctx): PathTile | undefined => {
  const player: Player = G.players[Number(ctx.currentPlayer)]
  if (player.selectedCard === undefined) {
    return undefined
  }

  const card: HandCard = player.cards[player.selectedCard]
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

  const card: HandCard = player.cards[player.selectedCard]
  if ("openSides" in card) {
    return card.openSides
  }

  return []
}

const getSiblings = (x: number, y: number): [Coordinate, Coordinate, Coordinate, Coordinate] => {
  return [
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
    { x: x - 1, y: y },
    { x: x + 1, y: y },
  ]
}

const hasSibling = (x: number, y: number, items: MapItem[]): boolean => {
  return getSiblings(x, y).some((coord: Coordinate) => !freeCoordinate(coord.x, coord.y, items))
}

export const freeCoordinate = (x: number, y: number, items: MapItem[]): boolean => {
  return !items.some((v: MapItem) => v.coords.x === x && v.coords.y === y)
}

export const canPlaceCard = (G: GameState, ctx: Ctx, x: number, y: number): boolean => {
  if (!cardSelected(G, ctx, true)) {
    return false
  }
  if (!hasSibling(x, y, G.map.items)) {
    return false
  }
  if (!freeCoordinate(x, y, G.map.items)) {
    return false
  }

  const selectedCard = getSelectedCard(G, ctx)
  if (selectedCard === undefined) {
    return false
  }

  const cardToPlace: MapItem = {
    coords: {
      x: x,
      y: y,
    },
    card: selectedCard,
  }

  const siblingCards = getSiblingCards(getSiblings(x, y), G.map.items)

  if (siblingCards.every((sibling) => sibling.card.type === CardType.End || sibling.card.deadEnd === true)) {
    return false
  }

  if (!pathToZero({ x: x, y: y }, selectedCard.openSides, G.map.items, [])) {
    return false
  }

  return siblingCards.every((item) => {
    const place: compareItem = {
      sides: cardToPlace.card.openSides,
      coord: cardToPlace.coords,
    }
    const sibling: compareItem = {
      sides: item.card.openSides,
      coord: item.coords,
    }
    return cardCompatibility(place, sibling, true)
  })
}

const pathToZero = (coords: Coordinate, sides: OpenSide[], map: MapItem[], prev: Coordinate[] = []): boolean => {
  if (coords.x === 0 && coords.y === 0) {
    return true
  }
  if (prev.some((v) => v.x === coords.x && v.y === coords.y)) {
    return false
  }
  prev.push(coords)

  const paths = sides
    .map((side) => {
      const coord = coordForSide(coords, side)
      return {
        side: side,
        coord: coord,
        mapItem: findMapItem(coord, map),
      }
    })
    .filter((value) => {
      return value.mapItem !== undefined && !value.mapItem.card.deadEnd
    })

  return paths.some((path) => {
    if (path.mapItem === undefined) {
      return false
    }

    const compat = cardCompatibility({ coord: coords, sides: sides }, mapItemToCompareItem(path.mapItem), false)

    if (!compat) {
      return false
    }

    return pathToZero(path.coord, path.mapItem.card.openSides, map, prev)
  })
}

interface compareItem {
  coord: Coordinate
  sides: OpenSide[]
}

const mapItemToCompareItem = (item: MapItem): compareItem => {
  return { coord: item.coords, sides: item.card.openSides }
}

const cardCompatibility = (a: compareItem, b: compareItem, noneAllowed: boolean = true): boolean => {
  if (a.coord.x === b.coord.x) {
    if (a.coord.y > b.coord.y) {
      return checkSides(b.sides, a.sides, OpenSide.Down, OpenSide.Up, noneAllowed)
    }
    return checkSides(b.sides, a.sides, OpenSide.Up, OpenSide.Down, noneAllowed)
  }
  if (a.coord.y === b.coord.y) {
    if (a.coord.x > b.coord.x) {
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
  noneAllowd: boolean = true
): boolean => {
  const both = aSides.includes(aReq) && bSides.includes(bReq)
  const none = !aSides.includes(aReq) && !bSides.includes(bReq)
  return both || (none && noneAllowd)
}

const getSiblingCards = (siblings: Coordinate[], mapItems: MapItem[]): MapItem[] => {
  const returnItems: MapItem[] = []
  siblings.forEach((sibling) => {
    const matchedItem = mapItems.find((item) => item.coords.x === sibling.x && item.coords.y === sibling.y)
    if (matchedItem === undefined) {
      return
    }
    if (matchedItem.card.type === CardType.End && hasSibling(matchedItem.coords.x, matchedItem.coords.y, mapItems)) {
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
  return pathToZero(goldCard.coords, goldCard.card.openSides, G.map.items, [])
}

export default getBoundaries
