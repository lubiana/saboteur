export enum CardType {
  Action = "Action",
  End = "End",
  Gold = "Gold",
  Path = "Path",
  Role = "Role",
  Start = "Start",
}

export enum Action {
  Block = "Block",
  Unblock = "Unblock",
  Peek = "Peek",
  Destroy = "Destroy",
}

export enum BlockItem {
  Pickaxe = "Pickaxe",
  Cart = "Cart",
  Lamp = "Lamp",
}

export enum Role {
  Digger = "Digger",
  Saboteur = "Saboteur",
  Undecided = "?",
}

export enum OpenSide {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right",
}

export type GoldAmount = 0 | 1 | 2 | 3

export interface GameCard {
  type: CardType
}

export interface RoleCard extends GameCard {
  type: CardType.Role
  role: Role
}

export const mapTileTypes: readonly CardType[] =
    [CardType.Path, CardType.End, CardType.Start] as const

type MapTileType = typeof mapTileTypes[number];

export interface MapTile extends GameCard {
  type: MapTileType
  openSides: OpenSide[]
  deadEnd: boolean
}

export interface PathTile extends MapTile {
  type: CardType.Path
}

export interface EndTile extends MapTile {
  type: CardType.End
  gold: boolean
  uncovered: boolean
}

export interface ActionCard {
  type: CardType.Action
  action: Action
}

export interface BlockCard extends ActionCard {
  blockItems: BlockItem[]
}

export type HandCard = ActionCard | PathTile
export type SabCard = HandCard | RoleCard | MapTile
export type MapCard = PathTile | EndTile | MapTile
