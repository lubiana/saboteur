export type ToolAction = "Block" | "Unblock";
export type MapAction = "Peek" | "Destroy";

export type MapTile = "Path" | "End" | "Start"
export type Action = ToolAction | MapAction
export type CardType = MapTile | "Action" | "Role";
export const tools = ["Pickaxe", "Cart", "Lamp"] as const
export type Tool = typeof tools[number]
export type Role = "Digger" | "Saboteur" | "?"
export type OpenSide = "Up" | "Down" | "Left" | "Right"

export type GoldAmount = 0 | 1 | 2 | 3

export type GameCard<T extends CardType> = {
  readonly type: T
}

export type RoleCard = GameCard<"Role"> & {
  readonly role: Role
}

type IMapTile<T extends MapTile> = GameCard<T> & {
  openSides: OpenSide[]
  readonly deadEnd: boolean
}

export type PathTile = IMapTile<"Path">
export type StartTile = IMapTile<"Start">
export type EndTile = IMapTile<"End"> & {
  readonly gold: boolean
  uncovered: boolean
}

type IActionCard<A extends Action> = GameCard<"Action"> & {
  readonly action: A
}

type IMapActionCard<A extends MapAction> = IActionCard<A>

export type BlockCard = IActionCard<"Block"> & {
  tool: Tool
}
export type UnblockCard = IActionCard<"Unblock"> & {
  tools: Tool[]
}

export type ToolActionCard = BlockCard | UnblockCard

export type PeekCard = IMapActionCard<"Peek">
export type DestroyCard = IMapActionCard<"Destroy">
export type MapActionCard = PeekCard | DestroyCard

export type ActionCard = ToolActionCard | PeekCard | DestroyCard

export type HandCard = ActionCard | PathTile
export type MapCard = StartTile | EndTile | PathTile
export type SabCard = HandCard | RoleCard | MapCard
