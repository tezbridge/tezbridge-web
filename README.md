# TezBridge

[![Build Status](https://travis-ci.org/tezbridge/tezbridge-web.svg?branch=master)](https://travis-ci.org/tezbridge/tezbridge-web)
[![Known Vulnerabilities](https://snyk.io/test/github/tezbridge/tezbridge-web/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tezbridge/tezbridge-web?targetFile=package.json)

[![GitHub last commit](https://img.shields.io/github/last-commit/tezbridge/tezbridge-web.svg)](https://github.com/tezbridge/tezbridge-web/commits/master)

The TezBridge web front-end.

## Features

* Clean and simple UI with minimal size (under 400KB after gzipped)
 
* Protocol adapter
  - auto select the adapted crypto and network scripts according to the current protocol
 
* Mnemonic key generation
  - change bits of entropy
  - set password
  - access HD sub account though derive path
  - support for all 8 languages in bip39
 
* Ed25519 key generation
  - generate encrypted `edesk` key
 
* Secp256k1 key generation
  - generate encrypted `spesk` key
 
* P256 key generation
  - generate encrypted `p2esk` key
 
* Import all supported kinds of key
  - mnemonic key
  - mnemonic key with HD derived account
  - ed25519 secret key
  - ed25519 seed
  - ed25519 encrypted key
  - secp256k1 secret key
  - secp256k1 encrypted key
  - p256 secret key
  - p256 encrypted key
  - faucet/ICO/Fundraiser account
 
* Local managers management
  - check balance
  - check originated accounts and their info
 
* Settings
  - multi language support (hidden for now)
  - host change
 
* Signer
  - show all parameters from DApp requests
  - show a response record of all handled requests
  - auto calcuate minimal fee for operations
  - operation bytes checking between local and remote forged ones
 
* Remote bridging
  - reset function
  - auto reset when connection is disconnected
  - QRCode generated for connection info
  - able to scan dropped QRCode image file
  - able to scan pasted QRCode image file in input
  - able to scan QRCode though camera in mobile
 
* Temporary signer for one time usage
  
* A playground for developers to try TezBridge plugin online
 
* TezBridge plugin
  - ease of use
  - API
    - get source address(KT1 or tzX)
    - create new KT1 account
    - set delegate for KT1 account
    - sign operation bytes
    - inject signed operation bytes
    - sign and inject operations in JSON object with minimal fee