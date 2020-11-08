import React from "react"
import Paper from "@material-ui/core/Paper"
import { CardType, SabCard, BlockItem } from "../types/Cards"
import MapTileCanvas from "./MapTileCanvas"

interface SaboteurCardProps {
  card: SabCard
  onClick?: () => any
  elevation?: number
}

const cardDisplay = (card: SabCard) => {
  if (card.type === CardType.Path || card.type === CardType.End || card.type === CardType.Start) {
    return <MapTileCanvas card={card} />
  }
  if (card.type === CardType.Action && card.blockItems === undefined) {
    return <span>{card.action}</span>
  }
  if (card.type === CardType.Action && card.blockItems !== undefined) {
    return (
      <div>
        <span>{card.action}</span>
        <ul>
          {card.blockItems.map((item: BlockItem, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }
  if (card.type === CardType.Role) {
    return <span>{card.role}</span>
  }
}

const SaboteurCard: React.FC<SaboteurCardProps> = ({ card, onClick, elevation }) => (
  <Paper onClick={onClick} elevation={elevation ? elevation : 0}>
    <div style={{ width: "50px", height: "70px" }}>{cardDisplay(card)}</div>
  </Paper>
)

export default SaboteurCard
