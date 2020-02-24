import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import axios from 'axios'
import store from './stores'

axios('https://external-ip.now.sh')
  .then(({ data }) => store.state.ip = data.ip)

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
