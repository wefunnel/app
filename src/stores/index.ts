import Vue from 'vue'
import Vuex from 'vuex'
import {
  Funnel,
  Route,
  listFunnels,
  leaseFunnel,
  freeRoute,
  decryptData,
  publicKeyForUsername,
  listOwnedRoutes,
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
    activeChain: [] as Funnel[],
    routes: [] as Route[]
  },
  mutations: {
    updateIpField: (state: any, value: string) => {
      state.ipField = value
    }
  },
  actions: {
    loadFunnels: async ({ state }: any) => {
      state.funnels = await listFunnels()
    },
    loadRoutes: async ({ state }: any) => {
      const _routes: Route[] = await listOwnedRoutes()
      state.routes = await Promise.all(_routes.map(async (route) => {
        const ownerKey = await publicKeyForUsername(route.owner)
        if (route.funnel_uri_enc) {
          route.funnel_uri = await decryptData(ownerKey, route.funnel_uri_enc)
        }
        if (route.incoming_uri_enc) {
          route.incoming_uri = await decryptData(ownerKey, route.incoming_uri_enc)
        }
        if (route.outgoing_uri_enc) {
          route.outgoing_uri = await decryptData(ownerKey, route.outgoing_uri_enc)
        }
        return route
      }))
    },
    leaseFunnel: async ({ state, dispatch }: any, { funnel, incomingIp, outgoingUri }: any) => {
      await leaseFunnel(funnel.owner, incomingIp, outgoingUri)
      setTimeout(() => {
        dispatch('loadFunnels')
      }, 10000)
    },
    freeRoute: async ({}, route: any) => {
      await freeRoute(route.owner)
    },
  }
})

export default store
