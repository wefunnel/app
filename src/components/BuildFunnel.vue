<template>
  <div>
    <div>
      Lease a funnel with
      <select v-model="relayCount">
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      </select>
      relays
    </div>
    <input type="text" v-model="targetUri" />
    <button v-on:click="beginBuilding()">Start</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import FunnelCell from './FunnelCell'
import {
  decryptData,
  leaseFunnel,
  listOwnedRelays,
  listAvailableFunnels
} from '../stores/funnels'
import _ from 'lodash'

@Component({
  name: 'BuildChain',
  components: { FunnelCell }
})
export default class LeaseChain extends Vue {
  relayCount: string = '2'
  // Example connecting to pia vpn server
  targetUri: string = '172.98.67.83:502'

  async beginBuilding() {
    const addresses = [
      this.$store.state.ip,
    ]
    try {
      const relays = await listAvailableFunnels()
      const ownedRelays = await listOwnedRelays()
      const ownedRelayNames = _.map(ownedRelays, 'username')
      for (let i = 0; i < +this.relayCount; i++) {
        const availableRelays = _.filter(relays, (relay) => {
          return ownedRelayNames.indexOf(relay.username) === -1
        })
        // Try the first, maybe user random logic in the future
        const index = _.random(0, availableRelays.length)
        const relay = availableRelays[index]
        await leaseFunnel(relay.username, addresses[i])
        console.log('Funnel leased, awaiting handshake')
        await funnelConfirm(relay.username)
        ownedRelayNames.push(relay.username)
        const ip = await decryptData(ownerKey, funnel.funnel_uri_enc)
        addresses.push(ip)
        // Find next relay
        console.log(i)
      }
    } catch (err) {
      alert('Error building a relay')
    }
  }
}
</script>

<style scoped>
</style>
