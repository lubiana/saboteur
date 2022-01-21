import {
  ActionCard,
  EndTile,
  HandCard,
  MapAction,
  MapActionCard,
  OpenSide,
  PathTile,
  SabCard,
  Tool
} from "../types/Cards"

const repeat = <T extends SabCard>(amount: number, card: T): T[] => {
  const cards: T[] = []
  for (let index = 0; index < amount; index++) {
    cards.push({...card})
  }
  return cards
}

const pathCard = (amount: number, deadEnd: boolean, sides: OpenSide[]): PathTile[] =>
  repeat(amount, {type: "Path", openSides: sides, deadEnd})

const mapActionCard = (amount: number, action: MapAction): MapActionCard[] =>
  repeat(amount, {type: "Action", action})

const unblockActionCard = (amount: number, tools: Tool[]): ActionCard[] =>
  repeat(amount, {type: "Action", action: "Unblock", tools})

const blockActionCard = (amount: number, tool: Tool): ActionCard[] =>
  repeat(amount, {type: "Action", action: "Block", tool})

const actionCards = (): ActionCard[] => {
  const actionCards: ActionCard[] = []
  actionCards.push(...mapActionCard(6, "Peek"))
  actionCards.push(...mapActionCard(3, "Destroy"))
  actionCards.push(...blockActionCard(3, "Cart"))
  actionCards.push(...blockActionCard(3, "Lamp"))
  actionCards.push(...blockActionCard(3, "Pickaxe"))
  actionCards.push(...unblockActionCard(2, ["Cart"]))
  actionCards.push(...unblockActionCard(2, ["Lamp"]))
  actionCards.push(...unblockActionCard(2, ["Pickaxe"]))
  actionCards.push(...unblockActionCard(1, ["Cart", "Lamp"]))
  actionCards.push(...unblockActionCard(1, ["Cart", "Pickaxe"]))
  actionCards.push(...unblockActionCard(1, ["Lamp", "Pickaxe"]))
  return actionCards
}

const pathTiles = (): PathTile[] => {
  const pathTiles: PathTile[] = []
  // deadEnds
  pathTiles.push(...pathCard(1, true, ["Left", "Up"]))
  pathTiles.push(...pathCard(1, true, ["Down", "Up"]))
  pathTiles.push(...pathCard(1, true, ["Down", "Left"]))
  pathTiles.push(...pathCard(1, true, ["Down", "Left", "Right", "Up"]))
  pathTiles.push(...pathCard(1, true, ["Left"]))
  pathTiles.push(...pathCard(1, true, ["Down"]))
  pathTiles.push(...pathCard(1, true, ["Left", "Right"]))
  pathTiles.push(...pathCard(1, true, ["Left", "Right", "Up"]))
  pathTiles.push(...pathCard(1, true, ["Left", "Down", "Up"]))
  // normalPaths
  pathTiles.push(...pathCard(3, false, ["Left", "Right"]))
  pathTiles.push(...pathCard(4, false, ["Down", "Up"]))
  pathTiles.push(...pathCard(5, false, ["Down", "Left"]))
  pathTiles.push(...pathCard(5, false, ["Left", "Up"]))
  pathTiles.push(...pathCard(5, false, ["Down", "Up", "Left"]))
  pathTiles.push(...pathCard(5, false, ["Down", "Right", "Left"]))
  pathTiles.push(...pathCard(5, false, ["Down", "Right", "Left", "Up"]))
  return pathTiles
}

export const generateCards = (): HandCard[] => {
  const cards: HandCard[] = []
  cards.push(...pathTiles(), ...actionCards())
  return cards
}

export const emptyCard = (): PathTile => {
  return {
    type: "Path",
    openSides: [],
    deadEnd: false,
  }
}

export const endTiles = (): [EndTile, EndTile, EndTile] => [
  {
    type: "End",
    gold: false,
    openSides: ["Down", "Right", "Left", "Up"],
    deadEnd: false,
    uncovered: false,
  },
  {
    type: "End",
    gold: false,
    openSides: ["Down", "Right", "Left", "Up"],
    deadEnd: false,
    uncovered: false,
  },
  {
    type: "End",
    gold: true,
    openSides: ["Down", "Right", "Left", "Up"],
    deadEnd: false,
    uncovered: false,
  },
]
