// @flow

import TezBridgeCrypto from 'tezbridge-crypto'
import { network_client } from '../src/PsddFKi3/network'
import Operation from '../src/PsddFKi3/operation'
import { assert, RPCFn } from './util'

network_client.RPCFn = RPCFn

const package_tests = async () => {
  const sk = 'edskS68LAmi2nQHCEzvMs9CAJaCpWWtkFTavc2DBnxLaNvFerXBgjggKNu9QFPTyT5BuE1ttNbkHj7c3Q4AuPtjaFzfyj4t9un'

  {
    const result = await Operation.genMinFeeOperation(sk, [
      {
        kind: 'transaction',
        amount: '10',
        destination: 'tz2L2HuhaaSnf6ShEDdhTEAr5jGPWPNwpvcB'
      },
      {
        kind: 'transaction',
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
      },
      {
        kind: 'origination',
        balance: '5',
        spendable: true,
        delegatable: false,
        script: {
          code: [{"prim":"parameter","args":[{"prim":"contract","args":[{"prim":"unit"}],"annots":[":X"]}]},{"prim":"storage","args":[{"prim":"unit"}]},{"prim":"code","args":[[{"prim":"CDR","annots":["@storage_slash_1"]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
          storage: {"prim":"Unit"}
        }
      }
    ])

    const inject_result = await network_client.submit.inject_operation(result.operation_with_sig)
    console.log(inject_result)
  }
}

const main = async () => {
  await package_tests()
}

main()
