import Vue from 'vue'
import Vuex from 'vuex'
import {
  Funnel,
  listFunnels,
  leaseFunnel,
  freeFunnel,
  decryptData,
  publicKeyForUsername,
} from './funnels'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    ip: '',
    contractName: 'wefunnel5555',
    defaultPrivateKey: '5JqbA89QUhR6nkJX13cZxADNL4pca1FrABufUc3qcyhRRmgMRzp',
    username: 'seetheory333',
    publicKey: '',
    funnels: [] as Funnel[],
    activeChain: [] as Funnel[]
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
          const ownerKey = await publicKeyForUsername(funnel.username)
          funnel.funnel_uri = await decryptData(ownerKey, funnel.funnel_uri_enc)
          funnel.incoming_uri = await decryptData(ownerKey, funnel.incoming_uri_enc)
          funnel.outgoing_uri = await decryptData(ownerKey, funnel.outgoing_uri_enc)
          // const incoming = await decr
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
    },
  }
})

export default store
