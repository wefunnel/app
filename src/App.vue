<template>
  <div>
    Available Funnels
    <div style="display: flex" v-for="funnel in $store.state.funnels">
      <div style="display: flex">
        {{funnel.username}}
      </div>
      <div style="display: flex; flex-direction: column" v-if="funnel.active">
        <div>Funnel is leased <button v-on:click="free(funnel)">Free</button></div>
        <div>Access at {{ funnel.funnel_uri }}</div>
      </div>
      <div style="display: flex" v-if="!funnel.active">
        <input ref="ipInput" type="text" placeholder="origin ip" v-model="incomingIp" />
        <input type="text" placeholder="target ip and port" v-model="outgoingUri" />
        <button v-on:click="lease(funnel)">Lease</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Api, JsonRpc, RpcError } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { TextEncoder, TextDecoder } from 'util'
import { Funnel } from './stores/funnels'
import net from 'net'
import { mapState } from 'vuex'

@Component({
  name: 'App',
  computed: {
    incomingIp: {
      get () {
        return this.$store.state.ipField || this.$store.state.ip
      },
      set (value) {
        this.$store.commit('updateIpField', value)
      }
    }
  }
})
export default class App extends Vue {

  incomingIp: string
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

  async mounted() {
    await this.$store.dispatch('loadFunnels')
  }
}
</script>

<style>
#body {
  margin: 0px;
}
</style>
