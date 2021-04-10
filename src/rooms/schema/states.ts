import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema'
import { isPrime } from '../../lib/helpers'

export class card extends Schema {
  @type(['number'])
  symbolSet: ArraySchema<number>

  constructor(symbolSet: ArraySchema<number>) {
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

  @type('boolean')
  isWinner?: boolean

  constructor (
    playerID: number,
    playerScore: number,
    playerName: string,
    playerCardMatch?: boolean,
    playerCard?: card,
    isWinner?: boolean
  ) {
    super()
    this.playerID = playerID
    this.playerName = playerName
    this.playerScore = playerScore
    this.playerCardMatch = playerCardMatch
    this.playerCard = playerCard
    this.isWinner = isWinner
  }
}

export class tableState extends Schema {
  @type(card)
  drawnCard: card

  @type({ map: player })
  players: MapSchema<player>

  @type([card])
  cardDeck: ArraySchema<card>

  createPlayer (sessionId: string) {
    this.players = !this.players ? new MapSchema<player>() : this.players
    const playerNumber = this.players.size + 1
    this.players.set(sessionId, new player(playerNumber, 0, 'Player ' + playerNumber))
    return this.players.get(sessionId)
  }

  deletePlayer (sessionId: string) {
    this.players.delete(sessionId)
  }

  getCards () {
    var N = 8 // number of symbols on each card
    var nC = 0 // progressive number of cards
    this.cardDeck = new ArraySchema<card>()

    // check if N is valid (it must be a prime number +1)
    if (!isPrime(N - 1)) {
      document.write('<pre>ERROR: N value (' + N + ') is not a prime number +1:')
      document.write(' some tests will fail.</pre>')
    }

    // Generate series from #01 to #N
    for (let i = 0; i <= N - 1; i++) {
      var s = new ArraySchema<number>()
      nC++
      s.push(1)
      for (let i2 = 1; i2 <= N - 1; i2++) {
        s.push(N - 1 + (N - 1) * (i - 1) + (i2 + 1))
      }
      this.cardDeck.push(new card(s))
    }

    // Generate series from #N+1 to #N+(N-1)*(N-1)
    for (let i = 1; i <= N - 1; i++) {
      for (let i2 = 1; i2 <= N - 1; i2++) {
        var s = new ArraySchema<number>()
        nC++
        s.push(i + 1)
        for (let i3 = 1; i3 <= N - 1; i3++) {
          s.push(
            N +
              1 +
              (N - 1) * (i3 - 1) +
              (((i - 1) * (i3 - 1) + (i2 - 1)) % (N - 1))
          )
        }
        this.cardDeck.push(new card(s))
      }
    }
  }

  shuffleDeck () {
    var currentIndex = this.cardDeck.length,
      temporaryValue,
      randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = this.cardDeck[currentIndex]
      this.cardDeck[currentIndex] = this.cardDeck[randomIndex]
      this.cardDeck[randomIndex] = temporaryValue
    }
  }

  assignCards () {
    let cardsToRemove = 0
    // if the first round draw all cards from the deck for main card and player cards
    if (this.cardDeck.length === 57) {
      this.drawnCard = this.cardDeck[0]
      this.cardDeck.shift()
      cardsToRemove++

      this.players.forEach(player => {
        player.playerCard = this.cardDeck[cardsToRemove]
        this.cardDeck.shift()
        cardsToRemove++
      })
    } else {
      // set card of winner of the last round to drawn card from last round
      let winner = this.getWinner(this.players)
      winner.playerCard = this.drawnCard

      // draw main card from the top
      this.drawnCard = this.cardDeck[0]
      this.cardDeck.shift()
      cardsToRemove++

      this.players.forEach(player => {
        if (winner.playerID !== player.playerID) {
          player.playerCard= this.cardDeck[cardsToRemove]
          this.cardDeck.shift()
          cardsToRemove++
        }
      })
    }
  }

  getWinner (players: MapSchema<player>): player {
    let winnerPlayer = null
    players.forEach(player => {
      if (player.isWinner) {
        winnerPlayer = player
      }
    })
    return winnerPlayer
  }

  constructor(drawnCard?: card, players?: MapSchema<player>, cardDeck?: ArraySchema<card>) {
    super()
    this.drawnCard = drawnCard 
    this.players = players
    this.cardDeck = cardDeck
  }
}
