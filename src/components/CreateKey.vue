<template>
  <div>
    <tree-node title="mnemonic">
      <sm-input class="element" :title="lang.gen_key.bits" v-model="keys.mnemonic.bits"></sm-input>
      <sm-input class="element" :title="lang.password" :optional="true" important kind="password" v-model="keys.mnemonic._password"></sm-input>
      <sm-input class="element" title="Derive path" placeholder="m/44'/1729'/0'/0'|tz2" :optional="true" important v-model="keys.mnemonic._derive_path"></sm-input>
      <div class="op-panel element">
        <button @click="refreshWords">
          <icon icon="sync" spin size="sm"></icon>
          {{lang.refresh}}
        </button>
      </div>
      <switcher class="element" :data="keys.mnemonic.lang_lst" v-model="keys.mnemonic.lang"></switcher>
      <record class="mnemonic-record" :data="mnemonic_key"></record>
    </tree-node>

    <tree-node title="ed25519">
      <sm-input class="element" :title="lang.password" :optional="true" important kind="password" v-model="keys.ed25519.password"></sm-input>
      <div class="op-panel element">
        <button @click="refreshEd25519">
          <icon icon="sync" spin size="sm"></icon>
          {{lang.refresh}}
        </button>
      </div>
      <record :data="Object.keys(ed25519_key).length ? ed25519_key : keys.ed25519.key"></record>
    </tree-node>

    <tree-node title="secp256k1">
      <sm-input class="element" :title="lang.password" :optional="true" important kind="password" v-model="keys.secp256k1.password"></sm-input>
      <div class="op-panel element">
        <button @click="refreshSecp256k1">
          <icon icon="sync" spin size="sm"></icon>
          {{lang.refresh}}
        </button>
      </div>
      <record :data="Object.keys(secp256k1_key).length ? secp256k1_key : keys.secp256k1.key"></record>
    </tree-node>

    <tree-node title="p256">
      <sm-input class="element" :title="lang.password" :optional="true" important kind="password" v-model="keys.p256.password"></sm-input>
      <div class="op-panel element">
        <button @click="refreshP256">
          <icon icon="sync" spin size="sm"></icon>
          {{lang.refresh}}
        </button>
      </div>
      <record :data="Object.keys(p256_key).length ? p256_key : keys.p256.key"></record>
    </tree-node>

  </div>
</template>

<script>
// @flow

import * as bip32 from 'bip32'
import { mnemonicToSeedSync } from 'bip39'
import TBC from 'tezbridge-crypto'
import lang from '../langs'
import { debounce } from '../libs/util'

import TreeNode from './TreeNode'
import SmInput from './SmInput'
import Switcher from './Switcher'
import Record from './Record'

export default {
  components: {
    Record,
    TreeNode,
    Switcher,
    SmInput
  },
  data() {
    return {
      lang,
      keys: {
        mnemonic: {
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
          lang: 'english',
          derive_path: '',
          _derive_path: '',
          bits: '128',
          words: '',
          password: '',
          _password: '',
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
    this.refreshWords()
    this.refreshEd25519()
    this.refreshSecp256k1()
    this.refreshP256()
  },
  methods: {
    refreshWords() {
      this.keys.mnemonic.words = TBC.crypto.genMnemonic(this.keys.mnemonic.bits, this.keys.mnemonic.lang)
    },
    refreshEd25519() {
      const seed = TBC.crypto.genRandomBytes(32)
      this.keys.ed25519.seed = TBC.codec.bs58checkEncode(seed, TBC.codec.prefix.ed25519_seed)
    },
    refreshSecp256k1() {
      const sk = TBC.crypto.genRandomBytes(32)
      this.keys.secp256k1.sk = TBC.codec.bs58checkEncode(sk, TBC.codec.prefix.secp256k1_secret_key)
    },
    refreshP256() {
      const sk = TBC.crypto.genRandomBytes(32)
      this.keys.p256.sk = TBC.codec.bs58checkEncode(sk, TBC.codec.prefix.p256_secret_key)
    },
    genKey(scheme : 'ed25519' | 'secp256k1' | 'p256', key : Object, seed? : string) {
      const scheme_key = this.keys[scheme]

      const basic = {
        [this.lang.key.sk]: [key.getSecretKey()],
        [this.lang.key.pkh]: key.address,
        [this.lang.key.pk]: key.getPublicKey(),
        [this.lang.key.seed]: seed
      }

      if (scheme_key.password) {
        const raw_key = seed ? TBC.codec.bs58checkDecode(seed) : key.secret_key
        TBC.crypto.encryptKey(scheme, raw_key, scheme_key.password)
        .then(encrypted => {
          scheme_key.key = Object.assign(
            {}, 
            {[this.lang.key.encrypted]: [encrypted]}, 
            basic,
            {[this.lang.key.sk]: key.getSecretKey()})
        })
        return {}
      } else {
        return basic
      }
    }
  },
  watch: {
    'keys.mnemonic.lang'() {
      this.refreshWords()
    },
    'keys.mnemonic._password': debounce(function(pwd : string){
      this.keys.mnemonic.password = pwd
    }),
    'keys.mnemonic._derive_path': debounce(function(path : string){
      this.keys.mnemonic.derive_path = path
    })
  },
  computed: {
    mnemonic_key() {
      const seed = mnemonicToSeedSync(this.keys.mnemonic.words, this.keys.mnemonic.password)
      const node = bip32.fromSeed(seed)
      let key
      try {
        const [path, prefix] = this.keys.mnemonic.derive_path.split('|')
        const child = node.derivePath(path)

        const key_mapping = {
          tz1: TBC.codec.prefix.ed25519_seed,
          tz2: TBC.codec.prefix.secp256k1_secret_key,
          tz3: TBC.codec.prefix.p256_secret_key
        }

        const getKey = prefix === 'tz1' ? TBC.crypto.getKeyFromSeed : TBC.crypto.getKeyFromSecretKey
        key = getKey(
          TBC.codec.bs58checkEncode(child.privateKey, key_mapping[prefix])
        )

      } catch (e) {
        key = TBC.crypto.getKeyFromWords(this.keys.mnemonic.words, this.keys.mnemonic.password)
      }

      return {
        [this.lang.gen_key.words]: [this.keys.mnemonic.words],
        [this.lang.key.pkh]: key.address, 
        [this.lang.key.sk]: key.getSecretKey(),
        [this.lang.key.pk]: key.getPublicKey()
      }
    },
    ed25519_key() {
      const seed = this.keys.ed25519.seed
      if (!seed)
        return {}

      const key = TBC.crypto.getKeyFromSeed(TBC.codec.bs58checkDecode(seed))
      return this.genKey('ed25519', key, seed)
    },
    secp256k1_key() {
      if (!this.keys.secp256k1.sk)
        return {}

      const key = TBC.crypto.getKeyFromSecretKey(this.keys.secp256k1.sk)
      return this.genKey('secp256k1', key)
    },
    p256_key() {
      if (!this.keys.p256.sk)
        return {}

      const key = TBC.crypto.getKeyFromSecretKey(this.keys.p256.sk)
      return this.genKey('p256', key)
    }
  }
}
</script>

<style scoped>
</style>
