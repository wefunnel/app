<template>
  <div>
    <div style="margin-bottom: 2px;">
      Available Funnels
    </div>
    <div style="display: flex" v-for="funnel in $store.state.funnels">
      <FunnelCell :funnel="funnel" />
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
import Header from './components/Header.vue'
import FunnelCell from './components/FunnelCell.vue'

@Component({
  name: 'App',
  components: {
    FunnelCell, Header
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
