<template>
  <div>
    <table v-if="!keyData.error">
      <tbody>
        <tr v-if="keyData.encrypted">
          <th class="left">{{lang.key.encrypted}}</th>
          <td>
            <span class="d-inline-block text-truncate">
              {{keyData.encrypted}}
            </span>
          </td>
        </tr>
        <tr>
          <th class="left">{{lang.key.pkh}}</th>
          <td>
            <span class="d-inline-block text-truncate">
              {{keyData.pkh}}
            </span>
          </td>
        </tr>
        <tr>
          <th class="left">{{lang.key.pk}}</th>
          <td>
            <span class="d-inline-block text-truncate">
              {{keyData.pk}}
            </span>
          </td>
        </tr>
        <tr v-if="keyData.seed">
          <th class="left">{{lang.key.seed}}</th>
          <td>
            <span class="d-inline-block text-truncate">
              {{keyData.seed}}
            </span>
          </td>
        </tr>
        <tr>
          <th class="left">{{lang.key.sk}}</th>
          <td>
            <span class="d-inline-block text-truncate">
              {{keyData.sk}}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="keyData.error">
      {{keyData.error}}
    </div>
  </div>
</template>

<script>
// @flow

import lang from '../../langs'

export default {
  props: ['keyData'],
  data() {
    return {
      lang
    }
  }
}
</script>

<style scoped>
  * {font-size: 1rem; line-height: 1.5rem;}
  .left {min-width: 125px; padding-right: 16px; text-align: right; }
  .text-truncate {  font-family: Consolas, Menlo, monospace; max-width: 800px; }
</style>