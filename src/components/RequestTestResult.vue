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
              <span>{{lang.requests.test_desc.status}}:</span> 
              <span :class="{status: true, applied: metadata.result.status === 'applied'}">
                {{metadata.result.status}}
              </span>
            </div>
            <div v-if="metadata.result.storage">{{lang.requests.test_desc.storage}}: {{metadata.result.storage}}</div>
            <div ref="storage_diff" class="storage-diff"></div>
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
import Vue from 'vue'
import lang from '../langs'

import { tz2r } from '../libs/util'

const renderer = Misualizer.getGraphRenderer()

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

        this.metadata_lst = x.operation_contents.map((op, index) => {
          const op_updates = op.metadata.balance_updates
          const result_updates = op.metadata.operation_result.balance_updates || []

          const contract = x.contract_contents[index]
          const storage = op.metadata.operation_result.storage
          let storage_diff_graph = null
          try {
            storage_diff_graph = storage && contract 
              ? renderer.renderDiff(Misualizer.diff(contract.script.code[1].args[0], contract.script.storage, storage))
              : null
          } catch (e) {
            console.log(e)
          }

          const items = {
            kind: op.kind,
            destination: op.destination,
            result: op.metadata.operation_result,
            storage,
            storage_diff_graph,
            big_map_diff: op.metadata.operation_result.big_map_diff,
            changes: op_updates.concat(result_updates).map(x => this.extractChange(x))
          }
          return items
        })

        Vue.nextTick(() => {
          this.metadata_lst.forEach((x, i) => {
            if (!x.storage_diff_graph) return false

            this.$refs.storage_diff[i].appendChild(x.storage_diff_graph)
          })
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
* { vertical-align: middle; word-break: break-word; line-height: 1rem; font-family: consolas, Menlo, monospace, TZ;}
.metadata {display: block; margin: 8px 0}
.status {color: #bd1d1d}
.applied {color: #27bd1d}
.title { font-weight: 700}
.changes {margin-left: 8px}
.warning { color: #999; font-size: 0.7rem;}
.storage-diff {max-width: 480px; font-family: Consolas, Menlo, monospace; font-size: 0.8rem;}
</style>