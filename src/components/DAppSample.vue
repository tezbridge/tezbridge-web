<template>
  <div>
    <div>{{source}}</div>
    <button @click="showSource">Show source address</button>
  </div>
</template>

<script>
// @flow

export default {
  data() {
    return {
      source: ''
    }
  },
  methods: {
    async showSource() {
      const tezbridge = window.tezbridge
      await tezbridge.ready()
      tezbridge.call({method: 'get_source'}).then(x => console.log(x))
      // tezbridge.call({method: 'sign', param: []}).then(x => console.log(x))
    }
  }
}
</script>

<style scoped>
  
</style>