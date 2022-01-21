import {
  ActionCard,
  BlockCard,
  DestroyCard,
  EndTile,
  HandCard,
  MapActionCard,
  MapCard,
  PathTile,
  PeekCard,
  RoleCard,
  SabCard,
  StartTile,
  ToolActionCard,
  UnblockCard
} from "./Cards";

// action

export const isActionCard = (card?: SabCard): card is ActionCard =>
  !!card && card.type === "Action"

export const isToolActionCard = (card?: SabCard): card is ToolActionCard =>
  isActionCard(card) && 'tools' in card

export const isBlockCard = (card?: SabCard): card is BlockCard =>
  isToolActionCard(card) && card.action === "Block"

export const isUnblockCard = (card?: SabCard): card is UnblockCard =>
  isToolActionCard(card) && card.action === "Unblock"

export const isMapActionCard = (card?: SabCard): card is MapActionCard =>
  isPeekCard(card) || isDestroyCard(card)

export const isPeekCard = (card?: SabCard): card is PeekCard =>
  isActionCard(card) && card.action === "Peek"

export const isDestroyCard = (card?: SabCard): card is DestroyCard =>
  isActionCard(card) && card.action === "Destroy"

// map

export const isStartTile = (card?: SabCard): card is StartTile =>
  !!card && card.type === "Start"

export const isEndTile = (card?: SabCard): card is EndTile =>
  !!card && card.type === "End"

export const isPathTile = (card?: SabCard): card is PathTile =>
  !!card && card.type === "Path"

export const isMapCard = (card?: SabCard): card is MapCard =>
  isStartTile(card) || isEndTile(card) || isPathTile(card)

// other

export const isRoleCard = (card?: SabCard): card is RoleCard =>
  !!card && card.type === "Role"

export const isHandCard = (card?: SabCard): card is HandCard =>
  isActionCard(card) || isPathTile(card)
