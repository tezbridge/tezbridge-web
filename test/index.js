// @flow

import TezBridgeCrypto from 'tezbridge-crypto'
import TezBridgeNetwork from 'tezbridge-network'
import { assert, RPCFn } from './util'

const network_client = new TezBridgeNetwork({
  host: 'https://testnet.tezbridge.com',
  RPCFn
})

const package_tests = async () => {
  {
    const key = TezBridgeCrypto.crypto.getKeyFromSecretKey('edskS68LAmi2nQHCEzvMs9CAJaCpWWtkFTavc2DBnxLaNvFerXBgjggKNu9QFPTyT5BuE1ttNbkHj7c3Q4AuPtjaFzfyj4t9un')
    
    const r : Object = await network_client.mixed.makeOperationBytes({
      source: key.address,
      public_key: key.getPublicKey()
    }, 
    [
      {
        kind: 'transaction',
        param: {
          amount: '10',
          destination: 'tz2L2HuhaaSnf6ShEDdhTEAr5jGPWPNwpvcB'
        }
      },
      {
        kind: 'transaction',
        param: {
          amount: '100',
          destination: 'KT1AthoYG1RnR9wDrsk4euuXh22SteYmvoUC'
        }
      },
      {
        kind: 'origination',
        param: {
          balance: '5',
          spendable: true,
          delegatable: false,
          script: {
            code: [{"prim":"parameter","args":[{"prim":"contract","args":[{"prim":"unit"}],"annots":[":X"]}]},{"prim":"storage","args":[{"prim":"unit"}]},{"prim":"code","args":[[{"prim":"CDR","annots":["@storage_slash_1"]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
            storage: {"prim":"Pair","args":[[],{"prim":"Unit"}]}
          }
        }
      }
    ])


    const result = TezBridgeCrypto.localop.forgeOperation(r.branch, r.contents)
    assert(result === r.operation_hex, 'local forgeOperation + remote forgeOperation')
  }
}

const main = async () => {
  await package_tests()
}

main();
