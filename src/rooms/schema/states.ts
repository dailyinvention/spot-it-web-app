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
  isWinner: boolean = false

  @type('boolean')
  isReady: boolean = false

  constructor (
    playerID: number,
    playerScore: number,
    playerName: string,
    isReady: boolean,
    isWinner: boolean,
    playerCardMatch?: boolean,
    playerCard?: card
  ) {
    super()
    this.playerID = playerID
    this.playerName = playerName
    this.playerScore = playerScore
    this.playerCardMatch = playerCardMatch
    this.playerCard = playerCard
    this.isWinner = isWinner
    this.isReady = isReady
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
    this.players.set(sessionId, new player(playerNumber, 0, 'Player ' + playerNumber, false, false))
    return this.players.get(sessionId)
  }

  deletePlayer (sessionId: string) {
    this.players.delete(sessionId)
  }

  playersReady (sessionId: string) {
    let playerObj = this.players.get(sessionId)
    console.log(JSON.stringify(playerObj))
    playerObj.isReady = true
    this.players.set(sessionId, playerObj)

    let allPlayersReady = true

    console.log(JSON.stringify(this.players))
    this.players.forEach((player: player) => {
      if (!player.isReady || this.players.size === 1) {
        allPlayersReady = false
      }
    })

    if (allPlayersReady) {
      this.assignCards()
    }
  }

  resetPlayerReadiness () {
    this.players.forEach((player) => {
      player.isReady = false
    })
  }

  resetPlayerScores () {
    this.players.forEach((player) => {
      player.playerScore = 0
    })
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

    // set card of winner of the last round to drawn card from last round
    let winner = this.getWinner(this.players)

    if (winner !== null) {
      winner.playerCard = this.drawnCard
      winner.isWinner = false
    }

    // draw main card from the top of the deck
    this.drawnCard = this.cardDeck[0]
    console.log(JSON.stringify(this.cardDeck[0]))
    this.cardDeck.shift()
    cardsToRemove++

    this.players.forEach(player => {
      // if player is not the winner, draw from the deck
      if (winner === null || winner.playerID !== player.playerID) {
        player.playerCard = this.cardDeck[cardsToRemove]
        this.cardDeck.shift()
        cardsToRemove++
      }
    })
  }

  checkCard (sessionId: string, cardNumber: number) {
    console.log('this.drawnCard.symbolSet: ' + JSON.stringify(this.drawnCard.symbolSet))
    console.log('cardNumber: ' + cardNumber)

    let winnerFound: boolean = false

    if (this.drawnCard.symbolSet.indexOf(cardNumber) !== -1) {
      this.players.forEach((player, key) => {
        if (key !== sessionId && player.isWinner) {
          winnerFound = true
        }  
      })
      console.log('winnerFound', winnerFound)
      if (!winnerFound) {
        let player = this.players.get(sessionId)
        player.isWinner = true
        player.playerScore++ 
        console.log('player', JSON.stringify(player))
        this.players.set(sessionId, player)
        this.resetPlayerReadiness()
      }
    }
  }

  getWinner (players: MapSchema<player>): player {
    let winnerPlayer = null
    console.log('players', JSON.stringify(players))
    players.forEach(player => {
      if (player.isWinner) {
        winnerPlayer = player
      }
    })
    console.log('winnerPlayer', winnerPlayer)
    return winnerPlayer
  }

  constructor(drawnCard?: card, players?: MapSchema<player>, cardDeck?: ArraySchema<card>) {
    super()
    this.drawnCard = drawnCard 
    this.players = players
    this.cardDeck = cardDeck
  }
}
