// @flow

import TezBridgeCrypto from 'tezbridge-crypto'
import TezBridgeNetwork from 'tezbridge-network'
import { assert, RPCFn } from './util'

const network_client = new TezBridgeNetwork({
  host: 'https://testnet.tezbridge.com',
  RPCFn
})

const package_tests = async () => {
  const _x = `
  dc19e7e9f579f8e9e503884cd15d29643130add0c43f2f3be14397aa106a8431
  08
  0002 688d34fccfa4a854b18dbbbd1b369f1b7f0e56d9
  80b518ff6780b518e0d4030a
  0001 806d2628efefae710659f622a5d667b12d379024
  00

  08
  0002 688d34fccfa4a854b18dbbbd1b369f1b7f0e56d9
  80b518806880b518e0d40305
  0000 f1cb2a6739025bf5008c4e8f610ba0f0f496f3fc
  00
  `
BMPDXR7hZcsz9LTtBoeVermGuVEsykuQHRAHEeQKNnfivgkxVXU
  const x = _x.replace(/\s+/g, '')
  const result = TezBridgeCrypto.codec.fromHex(x)
  const source = TezBridgeCrypto.codec.bs58checkDecode('tz1hgWvYdzLECdrq5zndGHwCGnUCJq1KFe3r')
  console.log(source)
  console.log(x)

  // console.log(JSON.stringify([].slice.call(result)))
  {
    const r : Object = await network_client.mixed.makeOperationBytes({
      source: 'tz3Vrs3r11Tu9fZvu4mHFcuNt9FK9QuCw83X',
      public_key: 'p2pk67SFY4XDMaACBrbJfvhmfLVx3wNfNt4inWHRsCdZc13b7CASxbm'
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
          amount: '5',
          destination: 'tz1hgWvYdzLECdrq5zndGHwCGnUCJq1KFe3r'
        }
      }
    ])

    console.log(r)
    console.log(r.operation_hex)
  }
  //   
  //   const secret_key = 'p2sk33568Eg2DXkg4aLQxQG2nQkL8yr4F3tR5xfqttMgkDQZzgb6RW'
  //   console.log(r.operation_hex)
//     r.signature = TezBridgeCrypto.crypto.signOperation(r.operation_hex, secret_key)
//     const preapplyed_result = await network_client.submit.preapply_operation(r.branch, r.contents, r.protocol, r.signature)
// 
//     console.log(JSON.stringify(preapplyed_result))
//     
//     const op_with_sig = r.operation_hex + TezBridgeCrypto.codec.toHex(TezBridgeCrypto.codec.bs58checkDecode(r.signature))
//     const result = await network_client.submit.inject_operation(op_with_sig)
//     console.log(result)

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
