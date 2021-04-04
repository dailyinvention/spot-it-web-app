import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema'

export class card extends Schema {
  @type(['number'])
  symbolSet: number[]

  constructor(symbolSet: number[]) {
    super()
    this.symbolSet = symbolSet
  }
}

export class player extends Schema {
  @type('number')
  playerID: number

  @type('number')
  playerScore: number = 0

  @type('string')
  playerName: string

  @type('boolean')
  playerCardMatch?: boolean

  @type(card)
  playerCard?: card

  constructor (
    playerID: number,
    playerScore: number,
    playerName: string,
    playerCardMatch?: boolean,
    playerCard?: card
  ) {
    super()
    this.playerID = playerID
    this.playerName = playerName
    this.playerScore = playerScore
    this.playerCardMatch = playerCardMatch
    this.playerCard = playerCard
  }
}

export class tableState extends Schema {
  @type(card)
  drawnCard: card

  @type({ map: player })
  players: MapSchema<player>

  createPlayer(sessionId: string) {
    this.players = !this.players ? new MapSchema<player>() : this.players
    const playerNumber = this.players.size + 1
    this.players.set(sessionId, new player(playerNumber, 0, 'Player ' + playerNumber))
    return this.players.get(sessionId)
  }

  deletePlayer(sessionId: string) {
    this.players.delete(sessionId)
  }

  constructor(drawnCard?: card, players?: MapSchema<player>) {
    super()
    this.drawnCard = drawnCard 
    this.players = players
  }
}
