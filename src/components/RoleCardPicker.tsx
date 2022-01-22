import React from "react"
import {RoleCard} from "../types/Cards"
import SaboteurCard from "./SaboteurCard"
import {Grid} from "@mui/material";

interface RoleCardPickerProps {
  roleCards: RoleCard[]
  moves: any
}

const RoleCardPicker: React.FC<RoleCardPickerProps> = ({ roleCards, moves }) => (
  <Grid container spacing={5} justifyContent="center">
    {roleCards.map((card: RoleCard, index: number) => (
      <Grid item key={index}>
        <SaboteurCard
          elevation={1}
          card={{ type: "Role", role: "?" }}
          onClick={() => moves.pickRoleCard(index)}
        />
      </Grid>
    ))}
  </Grid>
)

export default RoleCardPicker
