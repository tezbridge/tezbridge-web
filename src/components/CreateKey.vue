<template>
  <div>
    <tree-node :title="lang.menu.mnemonic" hard_close>
      <mnemonic></mnemonic>
    </tree-node>

    <tree-node title="Ed25519" hard_close>
      <ed25519></ed25519>
    </tree-node>

    <tree-node title="Secp256k1" hard_close>
      <secp256k1></secp256k1>
    </tree-node>

    <tree-node title="P256" hard_close>
      <p256></p256>
    </tree-node>

  </div>
</template>

<script>
// @flow

import lang from '../langs'

import TreeNode from './TreeNode'

import Mnemonic from './KeyCreators/Mnemonic'
import Ed25519 from './KeyCreators/Ed25519'
import Secp256k1 from './KeyCreators/Secp256k1'
import P256 from './KeyCreators/P256'

export default {
  components: {
    TreeNode,
    Mnemonic,
    Ed25519,
    Secp256k1,
    P256
  },
  data() {
    return {
      lang
    }
  }
}
</script>

<style scoped>
</style>
