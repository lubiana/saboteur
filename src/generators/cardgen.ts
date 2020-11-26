import { MapTile } from "../types/Cards"
import { CardType, PathTile, OpenSide, Action, ActionCard, BlockItem, HandCard, EndTile } from "../types/Cards"

const pathTileGenerator = (amount: number, deadEnd: boolean, sides: OpenSide[]): PathTile[] => {
  const pathTiles: PathTile[] = []
  for (let index = 0; index < amount; index++) {
    pathTiles.push({
      type: CardType.Path,
      openSides: sides,
      deadEnd,
    })
  }
  return pathTiles
}

const actionCardGenerator = (amount: number, action: Action, blockItems: BlockItem[] = []): ActionCard[] => {
  const cards: ActionCard[] = []

  for (let index = 0; index < amount; index++) {
    const card: ActionCard = {
      type: CardType.Action,
      action,
    }
    if (blockItems.length > 0) {
      card.blockItems = blockItems
    }
    cards.push(card)
  }
  return cards
}

const actionCards = (): ActionCard[] => {
  const actionCards: ActionCard[] = []
  actionCards.push(...actionCardGenerator(6, Action.Peek))
  actionCards.push(...actionCardGenerator(3, Action.Destroy))
  actionCards.push(...actionCardGenerator(3, Action.Block, [BlockItem.Cart]))
  actionCards.push(...actionCardGenerator(3, Action.Block, [BlockItem.Lamp]))
  actionCards.push(...actionCardGenerator(3, Action.Block, [BlockItem.Pickaxe]))
  actionCards.push(...actionCardGenerator(2, Action.Unblock, [BlockItem.Cart]))
  actionCards.push(...actionCardGenerator(2, Action.Unblock, [BlockItem.Lamp]))
  actionCards.push(...actionCardGenerator(2, Action.Unblock, [BlockItem.Pickaxe]))
  actionCards.push(...actionCardGenerator(1, Action.Unblock, [BlockItem.Cart, BlockItem.Lamp]))
  actionCards.push(...actionCardGenerator(1, Action.Unblock, [BlockItem.Cart, BlockItem.Pickaxe]))
  actionCards.push(...actionCardGenerator(1, Action.Unblock, [BlockItem.Lamp, BlockItem.Pickaxe]))
  return actionCards
}

const pathTiles = (): PathTile[] => {
  const pathTiles: PathTile[] = []
  // deadEnds
  pathTiles.push(...pathTileGenerator(1, true, [OpenSide.Left, OpenSide.Up]))
  pathTiles.push(...pathTileGenerator(1, true, [OpenSide.Down, OpenSide.Up]))
  pathTiles.push(...pathTileGenerator(1, true, [OpenSide.Down, OpenSide.Left]))
  pathTiles.push(...pathTileGenerator(1, true, [OpenSide.Down, OpenSide.Left, OpenSide.Right, OpenSide.Up]))
  pathTiles.push(...pathTileGenerator(1, true, [OpenSide.Left]))
  pathTiles.push(...pathTileGenerator(1, true, [OpenSide.Down]))
  pathTiles.push(...pathTileGenerator(1, true, [OpenSide.Left, OpenSide.Right]))
  pathTiles.push(...pathTileGenerator(1, true, [OpenSide.Left, OpenSide.Right, OpenSide.Up]))
  pathTiles.push(...pathTileGenerator(1, true, [OpenSide.Left, OpenSide.Down, OpenSide.Up]))
  // normalPaths
  pathTiles.push(...pathTileGenerator(3, false, [OpenSide.Left, OpenSide.Right]))
  pathTiles.push(...pathTileGenerator(4, false, [OpenSide.Down, OpenSide.Up]))
  pathTiles.push(...pathTileGenerator(5, false, [OpenSide.Down, OpenSide.Left]))
  pathTiles.push(...pathTileGenerator(5, false, [OpenSide.Left, OpenSide.Up]))
  pathTiles.push(...pathTileGenerator(5, false, [OpenSide.Down, OpenSide.Up, OpenSide.Left]))
  pathTiles.push(...pathTileGenerator(5, false, [OpenSide.Down, OpenSide.Right, OpenSide.Left]))
  pathTiles.push(...pathTileGenerator(5, false, [OpenSide.Down, OpenSide.Right, OpenSide.Left, OpenSide.Up]))
  return pathTiles
}

export const generateCards = (): HandCard[] => {
  const cards: HandCard[] = []
  cards.push(...pathTiles(), ...actionCards())
  return cards
}

export const emptyCard = (): MapTile => {
  return {
    type: CardType.Path,
    openSides: [],
    deadEnd: false,
  }
}

export const endTiles = (): [EndTile, EndTile, EndTile] => [
  {
    type: CardType.End,
    gold: false,
    openSides: [OpenSide.Down, OpenSide.Right, OpenSide.Left, OpenSide.Up],
    deadEnd: false,
    uncovered: false,
  },
  {
    type: CardType.End,
    gold: false,
    openSides: [OpenSide.Down, OpenSide.Right, OpenSide.Left, OpenSide.Up],
    deadEnd: false,
    uncovered: false,
  },
  {
    type: CardType.End,
    gold: true,
    openSides: [OpenSide.Down, OpenSide.Right, OpenSide.Left, OpenSide.Up],
    deadEnd: false,
    uncovered: false,
  },
]
