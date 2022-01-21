import React from "react"
import Paper from "@material-ui/core/Paper"
import {Tool, SabCard} from "../types/Cards"
import MapTileCanvas from "./MapTileCanvas"
import {isToolActionCard, isMapCard, isRoleCard, isMapActionCard} from "../types/guards";

interface SaboteurCardProps {
  card: SabCard
  onClick?: () => void
  elevation?: number
}

const cardDisplay = (card: SabCard) => {
  if (isMapCard(card)) {
    return <MapTileCanvas card={card}/>
  } else if (isToolActionCard(card)) {
    return (
      <div>
        <span>{card.action}</span>
        <ul>
          {card.tools.map((item: Tool, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    )
  } else if (isMapActionCard(card)) {
    return <span>{card.action}</span>
  } else if (isRoleCard(card)) {
    return <span>{card.role}</span>
  }
}

const SaboteurCard: React.FC<SaboteurCardProps> = ({card, onClick, elevation}) => (
  <Paper onClick={onClick} elevation={elevation ? elevation : 0}>
    <div style={{width: "50px", height: "70px"}}>{cardDisplay(card)}</div>
  </Paper>
)

export default SaboteurCard
