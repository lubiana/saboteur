import React from "react"
import { Ctx } from "boardgame.io"
import RoleCardPicker from "./RoleCardPicker"
import GameState from "../types/GameState"
import PlayerList from "./PlayerList"
import PlayerView from "./PlayerView"
import MapView from "./MapView"
import {AppBar, CssBaseline, Theme, Toolbar, Typography} from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
          {G.map.items.length !== 0 && <MapView G={G} ctx={ctx} moves={moves} />}
          <PlayerView player={G.players[Number(ctx.currentPlayer)]} moves={moves} />
        </div>
      </main>
    </div>
  )
}

export default Board
