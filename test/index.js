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
    const r : Object = await network_client.mixed.makeTransactionBytes({
      source: 'tz2L2HuhaaSnf6ShEDdhTEAr5jGPWPNwpvcB',
      public_key: 'sppk7aLxNrEXqt52YTEXmVwKQSu2phVrjnSQmF7V31xSAFXEq9PSETE'
    }, {
      amount: '100',
      destination: 'tz3Vrs3r11Tu9fZvu4mHFcuNt9FK9QuCw83X'
    })

    const secret_key = 'spsk25jYUuHr7PF4yd1w4bc7XKcp8dDmR8y7mwc8b4c3F7UXYn7vxJ'
    r.signature = TezBridgeCrypto.crypto.signOperation(r.operation_hex, secret_key)
    const preapplyed_result = await network_client.submit.preapply_operation(r.branch, r.contents, r.protocol, r.signature)

    console.log(JSON.stringify(preapplyed_result))
    
    const op_with_sig = r.operation_hex + TezBridgeCrypto.codec.toHex(TezBridgeCrypto.codec.bs58checkDecode(r.signature))
    const result = await network_client.submit.inject_operation(op_with_sig)
    console.log(result)
  }

//   {
//     const r : Object = await network_client.mixed.makeOriginationBytes({
//       source: 'tz1XErrAm8vFBzu69UU74JUSbvsmvXiQBy6e',
//       public_key: 'edpkv2FiD8nFLXC4XfAr33pqt7KfKxx9oH2tJdwqza2fjhGVYC8f31'
//     }, {
//       spendable: false,
//       delegatable: false,
//       script: {
//         code: [{"prim":"parameter","args":[{"prim":"contract","args":[{"prim":"unit"}],"annots":[":X"]}]},{"prim":"storage","args":[{"prim":"unit"}]},{"prim":"code","args":[[{"prim":"CDR","annots":["@storage_slash_1"]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
//         storage: {"prim":"Unit"}
//       }
//     })
// 
//     const secret_key = 'edskS68LAmi2nQHCEzvMs9CAJaCpWWtkFTavc2DBnxLaNvFerXBgjggKNu9QFPTyT5BuE1ttNbkHj7c3Q4AuPtjaFzfyj4t9un'
//     r.signature = TezBridgeCrypto.crypto.signOperation(r.operation_hex, secret_key)
//     const preapplyed_result = await network_client.submit.preapply_operation(r.branch, r.contents, r.protocol, r.signature)
// 
//     const op_with_sig = r.operation_hex + TezBridgeCrypto.codec.toHex(TezBridgeCrypto.codec.bs58checkDecode(r.signature))
//     const result = await network_client.submit.inject_operation(op_with_sig)
//     console.log(result)
//   }

}

const main = async () => {
  await package_tests()
}

main()
