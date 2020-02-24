<template>
  <div style="display: flex; flex-direction: row">
    <div style="display: flex; flex-direction: column">
      <div style="display: flex; justify-content: space-between;">
        <div style="margin-bottom: 2px;">
          Available Funnels
        </div>
        <div style="flex: 1" />
        <div>
          Visible IP: {{$store.state.ip}}
        </div>
      </div>
      <div style="display: flex; flex-direction: column">
        <FunnelCell v-for="funnel in $store.state.funnels":funnel="funnel" />
      </div>
    </div>
    <div style="width: 10px" />
    <div style="background-color: black; height: 80vh; width: 1px" />
    <div style="width: 10px" />
    <BuildFunnel />
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
import Header from './components/Header.vue'
import FunnelCell from './components/FunnelCell.vue'
import BuildFunnel from './components/BuildFunnel'

@Component({
  name: 'App',
  components: {
    FunnelCell, Header, BuildFunnel 
  },
})
export default class App extends Vue {

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
