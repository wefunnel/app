<template>
  <div class="outer">
    <div class="display: flex; flex-direction: column">
      <div class="username">
        Offered by {{funnel.username}}
      </div>
      <div style="height:10px" />
      <div class="display: flex">
        Rate: {{funnel.rate}} tokens per hour
      </div>
    </div>
    <div style="width: 30px;" />
    <div v-if="funnel.active" style="display: flex; flex-direction: column; align-items: center">
      <div>Funnel is leased <button v-on:click="free(funnel)">Free</button></div>
      <div style="height: 10px;" />
      <div class="incomingUri">{{funnel.incoming_uri}}</div>
      <div>\/</div>
      <div class="outgoingUri">{{funnel.outgoing_uri}}</div>
      <div style="height: 10px;" />
      <div>Access at {{ funnel.funnel_uri }}</div>
    </div>
    <div v-if="!funnel.active" style="display: flex; flex-direction: column">
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

  async free(funnel: Funnel) {
    await this.$store.dispatch('freeFunnel', { funnel })
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
