import React from "react"
import Grid from "@material-ui/core/Grid"
import { Role, HandCard, CardType } from "../types/Cards"
import Player from "../types/Player"
import SaboteurCard from "./SaboteurCard"

interface RoleCardPickerProps {
  player: Player
  moves: any
}

const elevation = (player: Player, index: number): number => {
  if (player.selectedCard === undefined) {
    return 1
  }
  if (player.selectedCard === index) {
    return 12
  }
  return 1
}

const PlayerView: React.FC<RoleCardPickerProps> = ({ player, moves }) => (
  <div>
    <hr />
    <Grid container spacing={5} justify="center">
      <Grid item key="roleCard">
        <SaboteurCard card={{ type: CardType.Role, role: player.role || Role.Digger }} />
      </Grid>
      {player.hand.map((card: HandCard, index: number) => (
        <Grid item key={index}>
          <SaboteurCard card={card} onClick={() => moves.selectCard(index)} elevation={elevation(player, index)} />
        </Grid>
      ))}
    </Grid>
  </div>
)

export default PlayerView
