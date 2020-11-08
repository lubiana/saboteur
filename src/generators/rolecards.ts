import { CardType, Role, RoleCard } from "../types/Cards"

const generateRoles = (numPlayers: number): RoleCard[] => {
  const roles: RoleCard[] = []
  let saboteurs: number = 4
  let diggers: number = 0

  if (numPlayers < 10) {
    saboteurs = 3
  }
  if (numPlayers < 7) {
    saboteurs = 2
  }
  if (numPlayers < 5) {
    saboteurs = 1
  }

  diggers = numPlayers + 1 - saboteurs

  for (let i = 0; i < saboteurs; i++) {
    roles.push({
      type: CardType.Role,
      role: Role.Saboteur,
    })
  }

  for (let i = 0; i < diggers; i++) {
    roles.push({
      type: CardType.Role,
      role: Role.Digger,
    })
  }

  return roles
}

export default generateRoles
