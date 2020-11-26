import { Role, HandCard, BlockItem } from "./Cards"
import { Coordinate } from './Map'

export default interface Player {
  name: string
  index: number
  gold: number
  role: Role | null
  cards: HandCard[]
  blockers: BlockItem[]
  selectedCard?: number
  peekedCoords: Coordinate[]
}

export const player1: Player = {
  name: "lubi",
  index: 0,
  gold: 0,
  role: null,
  cards: [],
  blockers: [],
  peekedCoords: [],
}
