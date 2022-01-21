import {
  ActionCard,
  BlockCard,
  CardType,
  EndTile,
  HandCard,
  MapTile,
  mapTileTypes,
  PathTile,
  RoleCard,
  SabCard
} from "./Cards";

export const isActionCard = (card?: SabCard): card is ActionCard =>
    !!card && card.type === CardType.Action

export const isPathTile = (card?: SabCard): card is PathTile =>
    !!card && card.type === CardType.Path

export const isBlockCard = (card?: SabCard): card is BlockCard =>
    isActionCard(card) && 'blockItems' in card

export const isRoleCard = (card?: SabCard): card is RoleCard =>
    !!card && card.type === CardType.Role

export const isHandCard = (card?: SabCard): card is HandCard =>
    isActionCard(card) || isPathTile(card)

export const isMapTile = (card?: SabCard): card is MapTile =>
    !!card && mapTileTypes.includes(card.type)

export const isEndTile = (card?: SabCard): card is EndTile =>
    !!card && card.type === CardType.End
