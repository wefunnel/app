import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import FunnelStore from './stores/funnels'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    funnels: FunnelStore,
  },
})

const v = new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
