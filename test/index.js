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
    const key = TezBridgeCrypto.crypto.getKeyFromSecretKey('edskRsuDXnxhj3xzUi76u1JiYmAmvPY8tq8f2F1NT6XFyxDF1hT3d4WJDTULtWmagsSH39cBJhSdfSk7fFEjkc48gWykKaTmjq')
    
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

main()
