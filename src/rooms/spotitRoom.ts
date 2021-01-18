import { Room, Client } from 'colyseus'
import * as Colyseus from 'colyseus.js'
import { tableState, player, card } from './schema/states'

export class spotit extends Room {

  onCreate (options: any) {
    // create new player array
    let playerArr = [new player(0, '', false, new card([])), new player(0, '', false, new card([]))]

    this.setState(new tableState(new card([]), playerArr))

    this.onMessage('type', (client, message) => {
      //
      // handle 'type' message
      //
    })

  }

  onJoin (client: Client, options: any) {
  }

  onLeave (client: Client, consented: boolean) {
  }

  onDispose() {
  }

}
