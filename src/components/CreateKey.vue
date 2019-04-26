<template>
  <div>
    <tree-node title="mnemonic" limited>
      <sm-input class="element" title="bits of entropy" v-model="keys.mnemonic.bits"></sm-input>
      <sm-input class="element" title="password" :optional="true" important="must remember" kind="password" v-model="keys.mnemonic.password"></sm-input>
      <div class="op-panel element">
        <button @click="generateWords">
          <icon icon="sync" spin></icon>
          Generate
        </button>
      </div>
      <record :data="mnemonic_key"></record>
    </tree-node>

    <tree-node title="ed25519">
      <div class="selectable">
        <icon icon="sync" spin @click="refreshEd25519"></icon>
        {{keys.ed25519.seed}}
      </div>      
    </tree-node>

    <tree-node title="secp256k1">
    </tree-node>

    <tree-node title="p256">
    </tree-node>

  </div>
</template>

<script>
// @flow

import TBC from 'tezbridge-crypto'
import lang from '../langs'

import TreeNode from './TreeNode'
import SmInput from './SmInput'

import Record from './Record'

export default {
  components: {
    Record,
    TreeNode,
    SmInput
  },
  data() {
    return {
      lang,
      keys: {
        last_encrypted: '',
        mnemonic: {
          bits: '128',
          words: '',
          password: '',
        },
        ed25519: {
          seed: '',
          key: {},
          password: '',
        },
        secp256k1: {
          sk: '',
          key: {},
          password: '',
        },
        p256: {
          sk: '',
          key: {},
          password: '',
        }
      }
    }
  },
  mounted() {
    this.generateWords()
    this.refreshEd25519()
  },
  methods: {
    generateWords() {
      this.keys.mnemonic.words = TBC.crypto.genMnemonic(this.keys.mnemonic.bits)
    },
    refreshEd25519() {
      const seed = TBC.crypto.genRandomBytes(32)
      this.keys.ed25519.seed = TBC.codec.bs58checkEncode(seed, TBC.codec.prefix.ed25519_seed)
    }
  },
  computed: {
    mnemonic_key() {
      const seed = TBC.crypto.getSeedFromWords(this.keys.mnemonic.words, this.keys.mnemonic.password)
      const key = TBC.crypto.getKeyFromSeed(seed)

      const seed_tz = TBC.codec.bs58checkEncode(seed, TBC.codec.prefix.ed25519_seed)
      return {
        [this.lang.gen_key.words]: [this.keys.mnemonic.words],
        [this.lang.key.seed]: seed_tz, 
        [this.lang.key.pkh]: key.address, 
        [this.lang.key.sk]: key.getSecretKey(),
        [this.lang.key.pk]: key.getPublicKey()
      }
    }
  }
}
</script>

<style scoped>
.element {margin-top: 8px;}
.op-panel {text-align: center}
</style>
