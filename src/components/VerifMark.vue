<template>
  <div class="mark-wrapper">
    <div class="line" :style="{background: prop.bg, width: prop.width}" v-for="prop in bar"></div>
  </div>
</template>

<script>
// @flow

declare var TBC : any

import blake from 'blakejs'

import storage from '../libs/storage'

export default {
  data() {
    return {
      settings: storage.settings,
      bar: []
    }
  },
  mounted() {
    this.bar = this.genColor()
  },
  watch: {
    'settings.verif_mark'() {
      this.bar = this.genColor()
    }
  },
  methods: {
    genColor() : Array<Object> {
      const raw = TBC.codec.fromHex(storage.settings.verif_mark)

      const value = blake.blake2b(raw, null, 18)
      const h1 = parseInt(value[0] * 1.4)
      const h2 = parseInt(value[value.length - 1] * 1.4)
      return Array.from(value).slice(1, -1).map((x, index) => {
        return {
          bg: `hsl(${index > 8 ? h2 : h1}, ${x % 80}%, ${x % 60 + 30}%)`,
          width: `${x % 3 + 1}px`
        }
      })
    }
  }
}
</script>

<style scoped>
div.mark-wrapper {display: inline-block; vertical-align: text-bottom;}
.line {display: inline-block; height: 18px; }
</style>