import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import axios from 'axios'
import { Funnel, listFunnels, leaseFunnel, freeFunnel, decryptFunnelUri } from './stores/funnels'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    ip: '',
    contractName: 'wefunnel3333',
    defaultPrivateKey: '5JqbA89QUhR6nkJX13cZxADNL4pca1FrABufUc3qcyhRRmgMRzp',
    username: 'seetheory333',
    publicKey: '',
    funnels: [] as Funnel[],
  },
  mutations: {
    updateIpField: (state: any, value: string) => {
      state.ipField = value
    }
  },
  actions: {
    loadFunnels: async ({ state }: any) => {
      const _funnels: Funnel[] = await listFunnels()
      const funnels = await Promise.all(_funnels.map(async (funnel) => {
        if (funnel.client === state.username && funnel.funnel_uri_enc) {
          const uri = await decryptFunnelUri(funnel.username, funnel.funnel_uri_enc)
          funnel.funnel_uri = uri
        }
        return funnel
      }))
      state.funnels = funnels
    },
    leaseFunnel: async ({ state, dispatch }: any, { funnel, incomingIp, outgoingUri }: any) => {
      await leaseFunnel(funnel.username, incomingIp, outgoingUri)
      setTimeout(() => {
        dispatch('loadFunnels')
      }, 10000)
    },
    freeFunnel: async ({}, { funnel }: any) => {
      await freeFunnel(funnel.username)
    }
  }
})

axios('https://external-ip.now.sh')
  .then(({ data }) => store.state.ip = data.ip)

const v = new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
