<template>
  <div v-if="contents">
    <div v-if="error">
      {{error}}
    </div>
    <div v-else>
      <div>Fee: {{fee}}</div>
      <div class="metadata-lst">
        <div class="metadata" :key="i" v-for="(metadata, i) in metadata_lst">
          <div :key="j" v-for="(item, j) in metadata">
            {{item}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { tz2r } from '../libs/util'

export default {
  props: ['contents'],
  data() {
    return {
      error: '',
      fee: 0,
      metadata_lst: []
    }
  },
  watch: {
    contents(x) {
      if (!x) return;
      if (typeof x === 'string') {
        this.error = x
      } else {
        this.fee = x.fee
        this.metadata_lst = x.operation_contents.map(op => {
          const items = []
          op.metadata.balance_updates.forEach(x => items.push(this.extractChange(x)))
          op.metadata.operation_result.balance_updates.forEach(x => items.push(this.extractChange(x)))
          return items
        })
      }
    }
  },
  methods: {
    extractChange(item) {
      const result = {
        t: '',
        change: '0ꜩ',
        source: ''
      }

      result.change = tz2r(item.change) + 'ꜩ'
      result.source = item.contract || item.delegate
      result.t = item.category

      return `${result.source} ${result.change[0] === '-' ? '' : '+'}${result.change}` + (result.t ? `(${result.t})` : '')
    }
  }
}
</script>

<style scoped>
* { word-break: break-word; line-height: 1rem; font-family: consolas, Menlo, monospace, TZ;}
.metadata {display: block; margin: 8px 0}
</style>