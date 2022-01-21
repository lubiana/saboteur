import {
  Action,
  ActionCard,
  CardType,
  EndTile,
  HandCard,
  MapAction,
  MapActionCard,
  OpenSide,
  PathTile,
  Tool, ToolAction,
  ToolActionCard
} from "../types/Cards"

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

const mapActionCard = (amount: number, action: MapAction): MapActionCard[] => {
  const cards: MapActionCard[] = []

  for (let index = 0; index < amount; index++) {
    cards.push({
      type: CardType.Action,
      action,
    })
  }
  return cards
}

const toolActionCard = (amount: number, action: ToolAction, blockItems: Tool[] = []): ActionCard[] => {
  const cards: ToolActionCard[] = []

  for (let index = 0; index < amount; index++) {
    cards.push({
      type: CardType.Action,
      action,
      tools: blockItems
    })
  }
  return cards
}

const actionCards = (): ActionCard[] => {
  const actionCards: ActionCard[] = []
  actionCards.push(...mapActionCard(6, Action.Peek))
  actionCards.push(...mapActionCard(3, Action.Destroy))
  actionCards.push(...toolActionCard(3, Action.Block, [Tool.Cart]))
  actionCards.push(...toolActionCard(3, Action.Block, [Tool.Lamp]))
  actionCards.push(...toolActionCard(3, Action.Block, [Tool.Pickaxe]))
  actionCards.push(...toolActionCard(2, Action.Unblock, [Tool.Cart]))
  actionCards.push(...toolActionCard(2, Action.Unblock, [Tool.Lamp]))
  actionCards.push(...toolActionCard(2, Action.Unblock, [Tool.Pickaxe]))
  actionCards.push(...toolActionCard(1, Action.Unblock, [Tool.Cart, Tool.Lamp]))
  actionCards.push(...toolActionCard(1, Action.Unblock, [Tool.Cart, Tool.Pickaxe]))
  actionCards.push(...toolActionCard(1, Action.Unblock, [Tool.Lamp, Tool.Pickaxe]))
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

export const emptyCard = (): PathTile => {
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
