import { log } from './util'

import Pt24m4xi_TBC from 'tezbridge-crypto/Pt24m4xi'
import Pt24m4xi_TBN from 'tezbridge-network/Pt24m4xi'

const faucets = [
  {"mnemonic": ["motion", "monster", "panther", "fan", "transfer", "camp", "judge", "repeat", "inject", "maze", "expand", "naive", "worth", "camp", "excuse"], "secret": "0c41a866670e4974cf92b7f3d5367876655e95da", "amount": "15728682529", "pkh": "tz1YRZsKt8guzFd4hz5RvWab7B5EsMVNg1nG", "password": "tOWgWN82hX", "email": "acucphrs.ochklsjf@tezos.example.org"}
  , {"mnemonic": ["bridge", "boss", "joy", "shrimp", "cable", "fix", "arrow", "peasant", "fall", "replace", "error", "hope", "cricket", "multiply", "model"], "secret": "cf4347a85fd02eb9fe2029bc6d267935ecc30759", "amount": "67711892518", "pkh": "tz1TJCwoX79reCZ8yccPeW8iB9Mba91v8H47", "password": "ZDsMHzScWY", "email": "xsbpgksg.vyppouvf@tezos.example.org"}
  , {"mnemonic": ["boring", "mouse", "home", "current", "endless", "sketch", "small", "access", "spider", "broken", "ridge", "check", "high", "monkey", "dune"], "secret": "125c1beeea4b93349505e5559b3507e48c8bea60", "amount": "33317119106", "pkh": "tz1SJJY253HoEda8PS5vvfHVtyghgK3CTS2z", "password": "rjatOyE0Rt", "email": "ctduyckh.jgrgthcs@tezos.example.org"}
  , {"mnemonic": ["consider", "success", "mobile", "hole", "cost", "public", "doctor", "orchard", "expire", "clinic", "scatter", "sight", "hundred", "twenty", "young"], "secret": "4b682fde843e96700dc718c36011b87136c9b37e", "amount": "10841378370", "pkh": "tz1hiiUL7SWtqWWJZqJamJjxZZYRgp8RFSYH", "password": "X28CYNZt9W", "email": "kydzafrx.njkuxgsz@tezos.example.org"}
]

async function getFaucetKey(faucet, TBC, network_client) {
  const key = TBC.crypto.getKeyFromWords(faucet.mnemonic.join(' '), faucet.email + faucet.password)
  
  log('Checking faucet: ' + faucet.pkh)
  const balance = await network_client.fetch.balance(key.address)
  if (balance === '0') {
    log('Need activation')
    const branch = await network_client.fetch.hash()
    const protocol = await network_client.fetch.protocol()
    const ops = [{
      kind: 'activate_account',
      secret: faucet.secret,
      pkh: key.address
    }]
    const bytes = await network_client.submit.forge_operation(branch, ops)
    const sig = TBC.crypto.signOperation(bytes, key.getSecretKey())
    const op_with_sig = bytes + TBC.codec.toHex(TBC.codec.bs58checkDecode(sig))
    const result = await network_client.submit.inject_operation(op_with_sig)
    log('Activation result: ' + result)
  }

  return key
}

const Pt24m4xi = async () => {
  const TBC = Pt24m4xi_TBC
  const TBN = Pt24m4xi_TBN

  log('Testing Pt24m4xi')

  const network_client = new TBN({host: 'https://rpc.tzbeta.net'})

  const key = await getFaucetKey(faucets[2], TBC, network_client)

  
}

Pt24m4xi()

