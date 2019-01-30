// @flow

import TBC from 'tezbridge-crypto'
import { network_client } from './network'

export async function genMinFeeOperation(secret_key : string, op_params: Array<{
    kind: 'origination' | 'transaction',
    param: Object
  }>) {
  const key = TBC.crypto.getKeyFromSecretKey(secret_key)

  op_params.forEach(op => {
  	delete op.param.fee
  	delete op.param.gas_limit
  	delete op.param.storage_limit
  })
  const op_bytes_result = await network_client.mixed.makeOperationBytes({
  	source: key.address,
    public_key: key.getPublicKey()
  }, op_params)

  const ops = op_bytes_result.contents

  const local_hex = TBC.localop.forgeOperation(op_bytes_result.contents, op_bytes_result.branch)
  if (local_hex !== op_bytes_result.operation_hex)
  	throw `Inconsistent forged bytes:\nLocal(${local_hex})\nRemote(${op_bytes_result.operation_hex})`

  op_bytes_result.signature = TBC.crypto.signOperation(op_bytes_result.operation_hex, secret_key)
  const preapplyed_result = await network_client.submit.preapply_operation(
  	op_bytes_result.branch, op_bytes_result.contents, op_bytes_result.protocol, op_bytes_result.signature)

  let gas_sum = 0
  preapplyed_result[0].contents.forEach((content, index) => {
    const result = content.metadata.operation_result

  	if (result.errors)
  		throw `Operation errors:${JSON.stringify(result.errors, null, 2)}` 

  	const gas_limit = result.consumed_gas
  	
  	let storage_limit = 0
  	if (result.paid_storage_size_diff)
  		storage_limit += parseInt(result.paid_storage_size_diff)
  	if (result.originated_contracts)
  		storage_limit += result.originated_contracts.length * 257
  	storage_limit = storage_limit + ''

  	ops[index].gas_limit = gas_limit
  	ops[index].storage_limit = storage_limit
  	ops[index].fee = '0'

  	gas_sum += parseInt(gas_limit)
  })

  const op_with_sig = op_bytes_result.operation_hex + TBC.codec.toHex(TBC.codec.bs58checkDecode(op_bytes_result.signature))
  const fee = Math.ceil(100 + op_with_sig.length / 2 + 0.1 * gas_sum)

  let fee_left = fee
  ops.forEach(op => {
    const consumption = fee_left <= 400000 ? fee_left : 400000
    op.fee = consumption + ''
    fee_left -= consumption
  })
  if (fee_left)
    throw `Still need ${fee_left} fee to run the operation` 

  const final_op_result = await network_client.mixed.makeOperationBytes({
    source: key.address,
    public_key: key.getPublicKey()
  }, ops.map(x => ({kind: x.kind, param: x})))

  const final_local_hex = TBC.localop.forgeOperation(final_op_result.contents, final_op_result.branch)
  if (final_local_hex !== final_op_result.operation_hex)
    throw `Inconsistent final forged bytes:\nLocal(${local_hex})\nRemote(${final_op_result.operation_hex})`

  final_op_result.signature = TBC.crypto.signOperation(final_op_result.operation_hex, secret_key)
  const final_op_with_sig = final_op_result.operation_hex + TBC.codec.toHex(TBC.codec.bs58checkDecode(final_op_result.signature))
  
  return {
    fee,
    operation_contents: final_op_result.contents,
    operation_with_sig: final_op_with_sig
  }
}

export default {
	genMinFeeOperation
}