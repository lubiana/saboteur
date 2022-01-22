import React from "react"
import {Ctx} from "boardgame.io"
import Player from "../types/Player"
import GameState from "../types/GameState"
import {Tool, tools} from "../types/Cards"
import {cardSelected} from "../utils/mapHelper"
import {selected} from '../utils/cardHelper'
import {isBlockCard, isToolActionCard, isUnblockCard} from "../types/guards";
import {
  Avatar, Badge, Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Theme,
  Toolbar
} from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";

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

const canClick = (G: GameState, ctx: Ctx): boolean =>
  isToolActionCard(selected(G, ctx))

const PlayerList: React.FC<PlayerListProps> = ({G, ctx, moves}) => {
  const classes = useStyles()

  const onToolClick = (index: number, tool: Tool) => {
    const card = selected(G, ctx)
    if (isBlockCard(card)) {
      moves.blockPlayer(index, tool)
    } else if (isUnblockCard(card)) {
      moves.unblockPlayer(index, tool)
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
      <Toolbar/>
      <div className={classes.drawerContainer}>
        <List>
          <ListItem key="drawpile">
            <ListItemText primary={drawPileText(G.drawPile.length)}/>
          </ListItem>
          <Divider/>
          <ListItem
            key="discardpile"
            selected={cardSelected(G, ctx)}
            onClick={() => moves.discardCard(G, ctx)}
          >
            <ListItemText primary={discardPileText(G.discardPile.length)}/>
          </ListItem>
        </List>
        <List>
          {G.players.map((player: Player) => (
            <>
              <Divider/>
              <ListItem
                key={player.index}
                selected={canClick(G, ctx)}
              >
                {player.index === Number(ctx.currentPlayer) ? (
                  <ListItemAvatar>
                    <Badge color="primary" overlap="circular" variant="dot">
                      <Avatar>{player.name}</Avatar>
                    </Badge>
                  </ListItemAvatar>
                ) : (
                  <ListItemAvatar>
                    <Avatar>{player.name}</Avatar>
                  </ListItemAvatar>
                )}
                {tools.map(tool =>
                  <Chip
                    key={tool}
                    label={tool}
                    variant={player.blockers[tool] ? "filled" : "outlined"}
                    size="small"
                    onClick={() => onToolClick(player.index, tool)}
                  />
                )}
              </ListItem>
            </>
          ))}
        </List>
      </div>
    </Drawer>
  )
}

export default PlayerList
