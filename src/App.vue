<template>
  <div>
    Hello world
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Api, JsonRpc, RpcError } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { TextEncoder, TextDecoder } from 'util'

@Component({
  name: 'App',
})
export default class App extends Vue {
  async mounted() {
    const defaultPrivateKey = '5KDs6nody8ZuxXio2ZPmiiSvJsNF5hmwZqAepDMj6VPqdqmmVrq'
    const signatureProvider = new JsSignatureProvider([defaultPrivateKey])
    const rpc = new JsonRpc('http://127.0.0.1:8888')
    const api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    })
    const result = await api.transact({
      actions: [{
        account: 'hello',
        name: 'hi',
        authorization: [{
          actor: 'chance',
          permission: 'active',
        }],
        data: {
          user: 'chance',
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    })
    console.log(result)
  }
}
</script>

<style>
#body {
  margin: 0px;
}
</style>
