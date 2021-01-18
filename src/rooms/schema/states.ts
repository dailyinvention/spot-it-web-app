import { Schema, ArraySchema, type } from '@colyseus/schema'

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
  playerScore: number = 0

  @type('string')
  playerName?: string

  @type('boolean')
  playerCardMatch?: boolean

  @type(card)
  playerCard: card

  constructor (
    playerScore: number,
    playerName: string,
    playerCardMatch: boolean,
    playerCard: card
  ) {
    super()
    this.playerName = playerName
    this.playerScore = playerScore
    this.playerCardMatch = playerCardMatch
    this.playerCard = playerCard
  }
}

export class tableState extends Schema {
  @type(['number'])
  drawnCard: card

  @type(player)
  players: player[]

  constructor(drawnCard: card, players: player[]) {
    super()
    this.drawnCard = drawnCard 
    this.players = players
  }
}
