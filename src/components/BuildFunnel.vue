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
    <div v-for="route of $store.state.routes">
      {{route.incoming_uri}} -> {{route.outgoingUri}}
    </div>
    <input type="text" v-model="targetUri" />
    <button v-on:click="beginBuilding()">Start</button>
    <RouteCell v-for="route of $store.state.routes" :route="route" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import FunnelCell from './FunnelCell'
import RouteCell from './RouteCell'
import {
  decryptData,
  leaseFunnel,
  listOwnedRoutes,
  listAvailableFunnels,
  funnelConfirm,
  publicKeyForUsername
} from '../stores/funnels'
import _ from 'lodash'

@Component({
  name: 'BuildChain',
  components: { FunnelCell, RouteCell }
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
      const routes = await listAvailableFunnels()
      const ownedRoutes = await listOwnedRoutes()
      const routeOwnerNames = _.map(ownedRoutes, 'owner')
      for (let i = 0; i < +this.relayCount; i++) {
        const availableRoutes = _.filter(routes, (route) => {
          return routeOwnerNames.indexOf(route.owner) === -1
        })
        if (availableRoutes.length === 0) {
          alert('Not enough funnels available')
          break
        }
        const index = _.random(0, availableRoutes.length - 1)
        const route = availableRoutes[index]
        await leaseFunnel(route.owner, addresses[i])
        console.log('Funnel leased, awaiting handshake')
        await new Promise(r => setTimeout(r, 3000))
        await funnelConfirm(route.owner)
        routeOwnerNames.push(route.owner)
        const ownerKey = await publicKeyForUsername(route.owner)
        const ip = await decryptData(ownerKey, route.funnel_uri_enc)
        addresses.push(ip)
        // Find next relay
        console.log(i)
      }
    } catch (err) {
      console.log(err)
      alert('Error building a relay')
    }
  }
}
</script>

<style scoped>
</style>
