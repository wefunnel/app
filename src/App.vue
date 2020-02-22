<template>
  <div>
    Available Funnels
    <div style="display: flex" v-for="funnel in $store.state.funnels.funnels">
      <div style="display: flex">
        {{funnel.username}}
      </div>
      <div style="display: flex" v-if="funnel.active">
        Funnel is leased
      </div>
      <div style="display: flex" v-if="!funnel.active">
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

@Component({
  name: 'App',
})
export default class App extends Vue {
  async lease(funnel: Funnel) {
    await this.$store.dispatch('leaseFunnel', funnel)
    await this.$store.dispatch('loadFunnels')
  }

  async mounted() {
    await this.$store.dispatch('loadFunnels')
    // const contractName = 'wefunnel2222'
    // const defaultPrivateKey = '5KDs6nody8ZuxXio2ZPmiiSvJsNF5hmwZqAepDMj6VPqdqmmVrq'
    // const signatureProvider = new JsSignatureProvider([defaultPrivateKey])
    // const rpc = new JsonRpc('http://127.0.0.1:8888')
    // const api = new Api({
    //   rpc,
    //   signatureProvider,
    //   textDecoder: new TextDecoder(),
    //   textEncoder: new TextEncoder(),
    // })
    // const [ rows ] = await rpc.get_table_rows({
    //   json: true,
    //   code: contractName,
    //   scope: contractName,
    //   table: 'funnels',
    //   limit: 20,
    // })
    // this.$data.funnels = rows
    // const result = await api.transact({
    //   actions: [{
    //     account: 'wefunnel2222',
    //     name: '',
    //     authorization: [{
    //       actor: 'chance',
    //       permission: 'active',
    //     }],
    //     data: {
    //       user: 'chance',
    //     }
    //   }]
    // }, {
    //   blocksBehind: 3,
    //   expireSeconds: 30,
    // })
    // console.log(result)
  }
}
</script>

<style>
#body {
  margin: 0px;
}
</style>
