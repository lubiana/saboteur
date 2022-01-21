export enum CardType {
  Action = "Action",
  End = "End",
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

export enum Tool {
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

export type GameCard<T extends CardType> = {
  readonly type: T
}

export type RoleCard = GameCard<CardType.Role> & {
  readonly role: Role
}

const mapTileTypes: readonly CardType[] =
  [CardType.Path, CardType.End, CardType.Start] as const
type MapTileType = typeof mapTileTypes[number];

type MapTile<T extends MapTileType> = GameCard<T> & {
  openSides: OpenSide[]
  readonly deadEnd: boolean
}

export type PathTile = MapTile<CardType.Path>
export type StartTile = MapTile<CardType.Start>
export type EndTile = MapTile<CardType.End> & {
  readonly gold: boolean
  uncovered: boolean
}

type IActionCard<A extends Action> = GameCard<CardType.Action> & {
  readonly action: A
}

export type ToolAction = Action.Block | Action.Unblock;

export type MapAction = Action.Peek | Action.Destroy;

type IToolCard<A extends ToolAction> = IActionCard<A> & {
  readonly tools: Tool[]
}

type IMapActionCard<A extends MapAction> = IActionCard<A>

export type BlockCard = IToolCard<Action.Block>
export type UnblockCard = IToolCard<Action.Unblock>
export type PeekCard = IMapActionCard<Action.Peek>
export type DestroyCard = IMapActionCard<Action.Destroy>

export type MapActionCard = PeekCard | DestroyCard
export type ToolActionCard = BlockCard | UnblockCard
export type ActionCard = ToolActionCard | PeekCard | DestroyCard
export type HandCard = ActionCard | PathTile
export type MapCard = StartTile | EndTile | PathTile
export type SabCard = HandCard | RoleCard | MapCard
