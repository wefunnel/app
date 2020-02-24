<template>
  <div class="outer">
    <div class="display: flex; flex-direction: column">
      <div class="username">
        Courtesy of {{route.owner}}
      </div>
      <div style="height:10px" />
      <div class="display: flex">
        {{route.rate}} tokens per hour
        <br />
        Connected for {{+new Date(+new Date() - (route.start_time * 1000)) / 1000}} seconds
      </div>
    </div>
    <div style="width: 30px" />
    <div class="display: flex; flex-direction: column">
      <div class="incomingUri">{{route.incoming_uri}}</div>
      <div>\/</div>
      <div class="outgoingUri">{{route.outgoing_uri}}</div>
      <div style="height: 10px;" />
      <div>Access at {{ route.funnel_uri }}</div>
    </div>
    <div>Route is active<button v-on:click="free(route)">Free</button></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Route } from '../stores/funnels'

@Component({
  name: 'RouteCell',
  props: ['route'],
})
export default class RouteCell extends Vue {
  route: Route

  async free(route: Route) {
    await this.$store.dispatch('freeRoute', route)
    await this.$store.dispatch('loadFunnels')
  }
}
</script>

<style scoped>
.outer {
  display: flex;
  margin: 2px;
  border: 1px solid black;
  padding: 2px;
}
.incomingUri {
  background-color: green;
  padding: 4px;
  border-radius: 4px;
  color: white;
}
.outgoingUri {
  background-color: green;
  padding: 4px;
  border-radius: 4px;
  color: white;
}
</style>
