// @flow

import TezBridgeCrypto from 'tezbridge-crypto'
import TezBridgeNetwork from 'tezbridge-network'
import { assert, RPCFn } from './util'

const network_client = new TezBridgeNetwork({
  host: 'https://testnet.tezbridge.com',
  RPCFn
})

const package_tests = async () => {
  const sk = 'edskS68LAmi2nQHCEzvMs9CAJaCpWWtkFTavc2DBnxLaNvFerXBgjggKNu9QFPTyT5BuE1ttNbkHj7c3Q4AuPtjaFzfyj4t9un'
  let result = {}

  const feeCalc = (g, s) => {
    return Math.ceil(g * 0.0000001 * 1000000)
  }

  {
    const key = TezBridgeCrypto.crypto.getKeyFromSecretKey(sk)
    
    const r : Object = await network_client.mixed.makeOperationBytes({
      source: key.address,
      public_key: key.getPublicKey()
    }, 
    [
      {
        kind: 'transaction',
        param: {
          fee: 100 + feeCalc(10100, 0) + (524 / 2) + '',
          gas_limit: '10100',
          storage_limit: '0',
          amount: '10',
          destination: 'tz2L2HuhaaSnf6ShEDdhTEAr5jGPWPNwpvcB'
        }
      },
      {
        kind: 'transaction',
        param: {
          fee: feeCalc(67803, 0) + '',
          gas_limit: '67803',
          storage_limit: '2',
          amount: '0',
          destination: 'KT1AthoYG1RnR9wDrsk4euuXh22SteYmvoUC',
          parameters: {
            prim: 'Right', 
            args: [{
              prim: 'Left', 
              args: [
                {prim: 'Pair', args: [
                  {string: 'tz1bfQHTZv1oM78fA1MXreBHua7wvKvS5uCe'},
                  {prim: 'Pair', args: [
                    {int: '1'},
                    {prim: 'None'}
                  ]}
                ]}
              ]
          }]}
        }
      },
      // {
      //   kind: 'origination',
      //   param: {
      //     fee: feeCalc(11603, 323) + '',
      //     gas_limit: '11603',
      //     storage_limit: '323',
      //     balance: '5',
      //     spendable: true,
      //     delegatable: false,
      //     script: {
      //       code: [{"prim":"parameter","args":[{"prim":"contract","args":[{"prim":"unit"}],"annots":[":X"]}]},{"prim":"storage","args":[{"prim":"unit"}]},{"prim":"code","args":[[{"prim":"CDR","annots":["@storage_slash_1"]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
      //       storage: {"prim":"Unit"}
      //     }
      //   }
      // }
    ])

    const local_hex = TezBridgeCrypto.localop.forgeOperation(r.contents, r.branch)
    assert(local_hex === r.operation_hex, 'local forgeOperation + remote forgeOperation')
    result = r
  }

  {
    result.signature = TezBridgeCrypto.crypto.signOperation(result.operation_hex, sk)
    const preapplyed_result = await network_client.submit.preapply_operation(result.branch, result.contents, result.protocol, result.signature)
    console.log(JSON.stringify(preapplyed_result[0].contents.map(x => x.metadata.operation_result), null, 2))
    // console.log(result)
    const op_with_sig = result.operation_hex + TezBridgeCrypto.codec.toHex(TezBridgeCrypto.codec.bs58checkDecode(result.signature))
    console.log(op_with_sig.length)
    const inject_result = await network_client.submit.inject_operation(op_with_sig)
    console.log(result, inject_result)
  }
}

const main = async () => {
  await package_tests()
}

main()
