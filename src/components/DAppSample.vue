<template>
  <div>
    <div>{{source}}</div>
    <div>{{op}}</div>
    <button @click="showSource">Show source address</button>
    <button @click="signOp">Sign op</button>
  </div>
</template>

<script>
// @flow

const tezbridge = window.tezbridge

export default {
  data() {
    return {
      source: '',
      op: {}
    }
  },
  methods: {
    async showSource() {
      await tezbridge.ready()
      this.source = await tezbridge.request({method: 'get_source'})
    },
    async signOp() {
      await tezbridge.ready()
      tezbridge.request({
        method: 'sign'
      })
      .then(x => this.op = x)
      .catch(error => this.op = error)
    }
  }
}
</script>

<style scoped>
  
</style>