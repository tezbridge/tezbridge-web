<template>
  <div>
    <sm-input class="element" :title="lang.key.bits_of_entropy" v-model="bits"></sm-input>
    <sm-input class="element" :title="lang.general.password" :optional="true" important kind="password" v-model="password"></sm-input>
    <!-- <sm-input class="element" :title="lang.key.derive_path" placeholder="m/44'/1729'/0'/0'|tz2" :optional="true" important v-model="derive_path"></sm-input> -->
    <div class="op-panel element">
      <button @click="newWords">
        <icon icon="sync" spin size="sm"></icon>
        {{lang.general.refresh}}
      </button>
    </div>
    <switcher class="element" :data="lang_lst" v-model="words_lang"></switcher>
    <record class="mnemonic-record" :data="key_info"></record>
  </div>
</template>

<script>
// @flow

declare var TBC : any

import lang from '../../langs'
import { debounce } from '../../libs/util'

import Record from '../Record'
import Switcher from '../Switcher'
import SmInput from '../SmInput'

export default {
  components: {
    Record,
    SmInput,
    Switcher
  },
  data() {
    return {
      lang,
      key_info: {},
      lang_lst: {
        'English': 'english',
        '日本語': 'japanese',
        'Español': 'spanish',
        '中文(简体)': 'chinese_simplified',
        '中文(繁體)': 'chinese_traditional',
        'Français': 'french',
        'Italiano': 'italian',
        '한국어': 'korean'
      },
      words_lang: 'english',
      derive_path: '',
      bits: '128',
      words: '',
      password: ''
    }
  },
  watch: {
    words_lang: debounce(function() { this.newWords() }),
    bits: debounce(function() { this.newWords() }),
    derive_path: debounce(function() { this.refresh() }),
    words: debounce(function() { this.refresh() }),
    password: debounce(function() { this.refresh() })
  },
  methods: {
    newWords() {
      this.words = TBC.crypto.genMnemonic(this.bits, this.words_lang)
    },
    refresh() {
      const scheme_mapping = {
        tz1: 'ed25519',
        tz2: 'secp256k1',
        tz3: 'p256'
      }

      const key = TBC.crypto.getKeyFromWords(this.words, this.password)
      // Warning: No need to use this until the SLIP-0010 is finished
      // let key
      // try {
      //   const [path, prefix] = this.derive_path.split('|')
      //   key = TBC.crypto.deriveKeyFromWords(
      //     this.words,
      //     this.password,
      //     path,
      //     scheme_mapping[prefix]
      //   )
      // } catch (e) {
      //   key = TBC.crypto.getKeyFromWords(this.words, this.password)
      // }
      
      this.key_info = {
        [this.lang.key.words]: [this.words],
        [this.lang.key.pkh]: key.address, 
        [this.lang.key.sk]: key.getSecretKey(),
        [this.lang.key.pk]: key.getPublicKey()
      }
    }
  },
  mounted() {
    this.newWords()
  }
}
</script>

<style scoped>
  
</style>