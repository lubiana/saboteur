import React from "react"
import {SabCard, Tool} from "../types/Cards"
import MapTileCanvas from "./MapTileCanvas"
import {isBlockCard, isMapActionCard, isMapCard, isRoleCard, isUnblockCard} from "../types/guards";
import {Paper} from "@mui/material";

interface SaboteurCardProps {
  card: SabCard
  onClick?: () => void
  elevation?: number
}

const cardDisplay = (card: SabCard) => {
  if (isMapCard(card)) {
    return <MapTileCanvas card={card}/>
  } else if (isBlockCard(card)) {
    return (
      <div>
        <strong>{card.action}</strong>
        <div>{card.tool}</div>
      </div>
    )
  } else if (isUnblockCard(card)) {
    return (
      <div>
        <strong>{card.action}</strong>
        {card.tools.map((item: Tool) => <div key={item}>{item}</div>)}
      </div>
    )
  } else if (isMapActionCard(card)) {
    return <strong>{card.action}</strong>
  } else if (isRoleCard(card)) {
    return <strong>{card.role}</strong>
  }
}

const SaboteurCard: React.FC<SaboteurCardProps> = ({card, onClick, elevation = 0}) => (
  <Paper onClick={onClick} elevation={elevation}>
    <div style={{width: "50px", height: "70px"}}>{cardDisplay(card)}</div>
  </Paper>
)

export default SaboteurCard
