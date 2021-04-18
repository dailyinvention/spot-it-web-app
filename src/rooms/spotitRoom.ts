import { Room, Client } from 'colyseus'
import * as Colyseus from 'colyseus.js'
import { tableState } from './schema/states'

export class spotit extends Room {

  onCreate (options: any) {
    this.setState(new tableState())
    this.state.getCards()
    this.state.shuffleDeck()

    this.onMessage('ready', (client) => {
      this.state.playersReady(client.sessionId)
    })

    this.onMessage('clicked', (client, data) => {
      console.log('client: ' + JSON.stringify(client))
      this.state.checkCard(client.sessionId, data)
    })

    this.onMessage('new_game', (client) => {
      this.state.resetPlayerReadiness()
      this.state.getCards()
      this.state.shuffleDeck()
    })
  }

  onJoin (client: Client, options: any) {
    const player = this.state.createPlayer(client.sessionId)
    client.send('status', player)
  }

  onLeave (client: Client, consented: boolean) {
      this.state.deletePlayer(client.sessionId)
  }

  onDispose() {
  }

}
