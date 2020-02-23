<template>
  <div>
    <div>
      Lease a funnel chain with
      <select>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      </select>
      relays
    </div>
    <button>Start</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import FunnelCell from './FunnelCell'

@Component({
  name: 'LeaseChain',
  components: { FunnelCell }
})
export default class LeaseChain extends Vue {

}
</script>

<style scoped>
</style>
