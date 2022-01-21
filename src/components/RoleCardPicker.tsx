import React from "react"
import Grid from "@material-ui/core/Grid"
import {RoleCard} from "../types/Cards"
import SaboteurCard from "./SaboteurCard"

interface RoleCardPickerProps {
  roleCards: RoleCard[]
  moves: any
}

const RoleCardPicker: React.FC<RoleCardPickerProps> = ({ roleCards, moves }) => (
  <Grid container spacing={5} justify="center">
    {roleCards.map((card: RoleCard, index: number) => (
      <Grid item key={index}>
        <SaboteurCard
          card={{ type: "Role", role: "?" }}
          onClick={() => {
            moves.pickRoleCard(index)
          }}
        />
      </Grid>
    ))}
  </Grid>
)

export default RoleCardPicker
