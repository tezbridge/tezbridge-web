<template>
  <div v-if="contents" class="contents-wrapper selectable">
    <div v-if="error">
      {{error}}
    </div>
    <div v-else>
      <div class="metadata-lst">
        <div class="metadata" :key="i" v-for="(metadata, i) in metadata_lst">
          <div class="title">{{lang.requests.operation}} #{{i + 1}}</div>
          <div class="metadata-info">
            <div>
              {{lang.requests.op_desc.kind}}: {{metadata.kind}}
            </div>
            <div>
              {{lang.requests.test_desc.status}}: 
              <span :class="{status: true, applied: metadata.result.status === 'applied'}">
                {{metadata.result.status}}
              </span>
            </div>
            <div v-if="metadata.result.storage">{{lang.requests.test_desc.storage}}: {{metadata.result.storage}}</div>
            <div v-if="metadata.result.big_map_diff">{{lang.requests.test_desc.big_map_diff}}: {{metadata.result.big_map_diff}}</div>
            <div v-if="metadata.changes.length">{{lang.requests.test_desc.changes}}:</div>
            <div :key="j" v-for="(item, j) in metadata.changes" class="changes">
              {{item}}
            </div>
          </div>
        </div>
      </div>
      <div>{{lang.requests.test_desc.total_fee}}: {{tz2r(fee)}}ꜩ</div>
      <div class="warning">* {{lang.requests.test_desc.warning}}</div>
    </div>
  </div>
</template>

<script>
import lang from '../langs'

import { tz2r } from '../libs/util'

export default {
  props: ['contents'],
  data() {
    return {
      lang,
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
          const op_updates = op.metadata.balance_updates
          const result_updates = op.metadata.operation_result.balance_updates || []

          const items = {
            kind: op.kind,
            destination: op.destination,
            result: op.metadata.operation_result,
            storage: op.metadata.operation_result.storage,
            big_map_diff: op.metadata.operation_result.big_map_diff,
            changes: op_updates.concat(result_updates).map(x => this.extractChange(x))
          }
          return items
        })
      }
    }
  },
  methods: {
    tz2r,
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
.contents-wrapper {
  background: #f8f8f8;
  color: #555;
  padding: 0 4px 4px;
}
* { word-break: break-word; line-height: 1rem; font-family: consolas, Menlo, monospace, TZ;}
.metadata {display: block; margin: 8px 0}
.status {color: #bd1d1d}
.applied {color: #27bd1d}
.title { font-weight: 700}
.changes {margin-left: 8px}
.warning { color: #999; font-size: 0.7rem;}
</style>