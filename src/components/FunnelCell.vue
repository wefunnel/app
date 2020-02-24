<template>
  <div class="outer">
    <div class="display: flex; flex-direction: column">
      <div class="username">
        Offered by {{funnel.owner}}
      </div>
      <div style="height:10px" />
      <div class="display: flex">
        {{funnel.rate}} tokens per hour
      </div>
      <div class="display: flex">
        {{funnel.available_slots}}/{{funnel.total_slots}} slots open
      </div>
    </div>
    <div style="width: 30px;" />
    <div style="display: flex; flex-direction: column">
      <input ref="ipInput" type="text" placeholder="origin ip" v-model="incomingIp" />
      <input type="text" placeholder="target ip and port" v-model="outgoingUri" />
      <div style="height: 10px;" />
      <button v-on:click="lease(funnel)">Lease</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Funnel } from '../stores/funnels'
import net from 'net'

@Component({
  name: 'FunnelCell',
  props: ['funnel'],
})
export default class FunnelCell extends Vue {

  incomingIp: string = ''
  outgoingUri: string = ''

  async lease(funnel: Funnel) {
    const { incomingIp, outgoingUri } = this

    if (!net.isIP(incomingIp)) {
      alert('not an ip')
      return
    }
    await this.$store.dispatch('leaseFunnel', {
      funnel,
      incomingIp,
      outgoingUri
    })
    await this.$store.dispatch('loadFunnels')
  }

}
</script>

<style scoped>
.outer {
  display: flex;
  margin: 2px;
  border: 1px solid black;
  padding: 2px;
}
.incomingUri {
  background-color: green;
  padding: 4px;
  border-radius: 4px;
  color: white;
}
.outgoingUri {
  background-color: green;
  padding: 4px;
  border-radius: 4px;
  color: white;
}
</style>
