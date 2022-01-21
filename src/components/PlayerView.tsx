import React from "react"
import {HandCard} from "../types/Cards"
import Player from "../types/Player"
import SaboteurCard from "./SaboteurCard"
import {Grid} from "@mui/material";

interface RoleCardPickerProps {
  player: Player
  moves: any
}

const PlayerView: React.FC<RoleCardPickerProps> = ({ player, moves }) => (
  <div>
    <hr />
    <Grid container spacing={5} justifyContent="left">
      <Grid item key="roleCard">
        <SaboteurCard card={{ type: "Role", role: player.role || "Digger" }} />
      </Grid>
      {player.hand.map((card: HandCard, index: number) => (
        <Grid item key={index}>
          <SaboteurCard
            card={card}
            onClick={() => moves.selectCard(index)}
            elevation={player.selectedCard === index ? 5 : 1} />
        </Grid>
      ))}
    </Grid>
  </div>
)

export default PlayerView
