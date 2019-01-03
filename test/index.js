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
    const r : Object = await network_client.mixed.makeOriginationBytes({
      source: 'tz1XErrAm8vFBzu69UU74JUSbvsmvXiQBy6e',
      public_key: 'edpkv2FiD8nFLXC4XfAr33pqt7KfKxx9oH2tJdwqza2fjhGVYC8f31'
    }, {
      spendable: false,
      delegatable: false,
      script: {
        code: [{"prim":"parameter","args":[{"prim":"contract","args":[{"prim":"unit"}],"annots":[":X"]}]},{"prim":"storage","args":[{"prim":"unit"}]},{"prim":"code","args":[[{"prim":"CDR","annots":["@storage_slash_1"]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
        storage: {"prim":"Pair","args":[[],{"prim":"Unit"}]}
      }
    })

    console.log(r.operation_hex)
    const secret_key = 'edskS68LAmi2nQHCEzvMs9CAJaCpWWtkFTavc2DBnxLaNvFerXBgjggKNu9QFPTyT5BuE1ttNbkHj7c3Q4AuPtjaFzfyj4t9un'
    r.signature = TezBridgeCrypto.crypto.signOperation(r.operation_hex, secret_key)
    console.log(r.signature)
    const preapplyed_result = await network_client.submit.preapply_operation(r.branch, r.contents, r.protocol, r.signature)
    console.log(preapplyed_result)
  }

}

const main = async () => {
  await package_tests()
}

main()
