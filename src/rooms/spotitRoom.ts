import { Room, Client } from 'colyseus'
import * as Colyseus from 'colyseus.js'
import { tableState } from './schema/states'

export class spotit extends Room {

  onCreate (options: any) {
    // create new player array
    //let playerArr = [new player(0, '', false, new card([])), new player(0, '', false, new card([]))]

    this.setState(new tableState())

    this.onMessage('type', (client, message) => {

    })

  }

  onJoin (client: Client, options: any) {
    const player = this.state.createPlayer(client.sessionId)
    client.send('status', player)
  }

  onLeave (client: Client, consented: boolean) {
  }

  onDispose() {
  }

}
