import React from "react"
import Paper from "@material-ui/core/Paper"
import {BlockItem, SabCard} from "../types/Cards"
import MapTileCanvas from "./MapTileCanvas"
import {isActionCard, isBlockCard, isMapTile, isRoleCard} from "../types/guards";

interface SaboteurCardProps {
  card: SabCard
  onClick?: () => any
  elevation?: number
}

const cardDisplay = (card: SabCard) => {
  if (isMapTile(card)) {
    return <MapTileCanvas card={card}/>
  }
  if (isActionCard(card)) {
    if (isBlockCard(card)) {
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
    } else {
      return <span>{card.action}</span>
    }
  }
  if (isRoleCard(card)) {
    return <span>{card.role}</span>
  }
}

const SaboteurCard: React.FC<SaboteurCardProps> = ({card, onClick, elevation}) => (
  <Paper onClick={onClick} elevation={elevation ? elevation : 0}>
    <div style={{width: "50px", height: "70px"}}>{cardDisplay(card)}</div>
  </Paper>
)

export default SaboteurCard
