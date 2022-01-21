import React from "react"
import Drawer from "@material-ui/core/Drawer"
import Toolbar from "@material-ui/core/Toolbar"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { Ctx } from "boardgame.io"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Divider from "@material-ui/core/Divider"
import Player from "../types/Player"
import GameState from "../types/GameState"
import { Tool } from "../types/Cards"
import { cardSelected } from "../utils/mapHelper"
import { selectedBlock, selectedUnblock } from '../utils/cardHelper'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
)

interface PlayerListProps {
  G: GameState
  ctx: Ctx
  moves: any
}

const drawPileText = (amount: number): string => "Drawpile (" + amount + ")"

const discardPileText = (amount: number): string => "Discardpile (" + amount + ")"

const canClick = (G: GameState, ctx: Ctx, index: number): boolean => {
  return selectedBlock(G, ctx) || selectedUnblock(G, ctx)
}


const playerText = (player: Player): string => {
  let output: string = player.name
  const items = [
    { l: "P", b: Tool.Pickaxe },
    { l: "C", b: Tool.Cart },
    { l: "L", b: Tool.Lamp },
  ]

  items.forEach((item: any) => {
    const amount: number = player.blockers.filter((blocker: Tool) => blocker === item.b).length
    output = output.concat(` (${item.l}:${amount.toString()})`)
  })

  return output
}

const PlayerList: React.FC<PlayerListProps> = ({ G, ctx, moves }) => {
  const classes = useStyles()
  const playerClick = (G: GameState, ctx: Ctx, index: number) => {
    if (selectedBlock(G, ctx)) {
      moves.blockPlayer(index)
      return
    }
    if (selectedUnblock(G, ctx)) {
      moves.unBlockPlayer(index)
    }

  }

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          <ListItem key="drawpile">
            <ListItemText primary={drawPileText(G.drawPile.length)} />
          </ListItem>
          <ListItem
            key="discardpile"
            selected={cardSelected(G, ctx)}
            onClick={
              cardSelected(G, ctx)
                ? () => {
                  moves.discardCard(G, ctx)
                }
                : undefined
            }
          >
            <ListItemText primary={discardPileText(G.discardPile.length)} />
          </ListItem>
        </List>
        <List>
          <Divider />
          {G.players.map((player: Player, index: number) => (
            <ListItem
              key={index}
              selected={index === Number(ctx.currentPlayer) || canClick(G, ctx, index)}
              onClick={
                canClick(G, ctx, index)
                  ? () => { playerClick(G, ctx, index) }
                  : undefined
              }
            >
              <ListItemText primary={playerText(player)} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  )
}

export default PlayerList
