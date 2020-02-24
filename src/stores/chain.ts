import { listAvailableFunnels } from './funnels'
import _ from 'lodash'
import store from '.'

export async function findRelay() {
  // Find a relay connection that can be purchased
  const relays = await listAvailableFunnels()

  const relay = _.random(relays)
}
