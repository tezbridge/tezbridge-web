<template>
  <div class="wrapper" ontouchstart>
    <div v-if="!key">
      <sm-input :title="lang.signer.access_code" v-model="access_code"></sm-input>  
    </div>
    <div v-else>
      <tree-node>
        
      </tree-node>
    </div>
  </div>
</template>

<script>
// @flow

import TBC from 'tezbridge-crypto'
import storage from '../libs/storage'
import lang from '../langs'
import { debounce } from '../libs/util'
import SmInput from './SmInput'
import TreeNode from './TreeNode'

export default {
  components: {
    TreeNode,
    SmInput
  },
  data() {
    return {
      lang,
      ready_manager: storage.ready_manager,
      access_code: '',
      key: null
    }
  },
  watch: {
    access_code: debounce(function(p : string){
      const box = new TBC.crypto.EncryptedBox(this.ready_manager.enc)
      box.revealKey(p)
      .then(key => {
        storage.removeReadyManager()
        this.key = key
      })
      .catch(err => {
        this.key = false
      })
    })
  }
}
</script>

<style scoped>
.wrapper { width: 304px; }
</style>
