import React from "react"
import { Ctx } from "boardgame.io"
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import CssBaseline from "@material-ui/core/CssBaseline"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import RoleCardPicker from "./RoleCardPicker"
import GameState from "../types/GameState"
import PlayerList from "./PlayerList"
import PlayerView from "./PlayerView"
import MapView from "./MapView"
import { Grid } from "@material-ui/core"
import { CardType } from '../types/Cards'
import SaboteurCard from "./SaboteurCard"

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
)
interface BoardProps {
  G: GameState
  ctx: Ctx
  moves: any
  playerID: any
}
const Board: React.FC<BoardProps> = ({ ctx, G, moves, playerID }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Clipped drawer {playerID}
          </Typography>
        </Toolbar>
      </AppBar>
      <PlayerList G={G} ctx={ctx} moves={moves} />
      <main className={classes.content}>
        <Toolbar />
        <div>
          {ctx.phase === "start" && <RoleCardPicker roleCards={G.roleCards} moves={moves} />}
          <Grid container spacing={2}>
            {G.drawPile.filter((card) => card.type === CardType.Path).map((item, index) => {
              return (
                <Grid item key={index}>
                  <SaboteurCard card={item} />
                </Grid>
              )
            })}
          </Grid>
          {G.map.items.length !== 0 && <MapView G={G} ctx={ctx} moves={moves} />}
          <PlayerView player={G.players[Number(ctx.currentPlayer)]} moves={moves} />
        </div>
      </main>
    </div>
  )
}

export default Board
