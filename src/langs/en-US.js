export default {
  _: 'en_US',
  help: {
    ident_mark: `The identification mark displayed beside the logo 
                 is used to prevent phishing attack though a fake TezBridge site.
                 |When a DApp opens the TezBridge website, you should notice a familar
                 identification mark generated before. Otherwise, it might be a fraud TezBridge.`,
    mnemonic: `Generating the seed by using >=12 words. 
               The generated mnemonic can be imported to other Tezos wallets.
               |Also you can use the derive path to create a Ledger compatible mnemonic.`,
    bits_of_entropy: `With more entropy security is improved but the sentence length increases.
                      |The allowed bits of entropy varies from 128 to 256 and it must be divisible by 8.`,
    derive_path: `This is related to Hierarchical deterministic key. 
                  It's often used to make it compatible to those multi-chain wallets like Ledger.`,
    ed25519: `Ed25519 is the recommended EdDSA crypto scheme. It's also the default crypto scheme for tezos-client.
              |The public key hash generated by ed25519 in Tezos starts with tz1.`,
    secp256k1: `Tezos supports secp256k1 scheme which is used in Bitcoin and 
                the public key hash generated by secp256k1 in Tezos starts with tz2.`,
    p256: `Tezos supports NIST P-256 crypto scheme and
           the public key hash generated by p256 in Tezos starts with tz3.`,
    bridging_mode: `This option is used for change the Remote Signer info swap method.
                    The Remote Signer sends data though a browser native WebRTC channel.
                    So this option decides which WebRTC info swap method will be shown to the user.
                    |Simple: Netlify lambda function is used to exchange connection info.
                    |Manual: Users can exchange the connection info by QRCode or text sending.`,
    signer: `It opens TezBridge Signer page. The TezBridge Signer is usually directly opened by some third party DApp sites.`,
    playground: `A place shows editable examples of TezBridge's plugin integration for developers.`,
    legacy: `It'll jump to the old version of TezBridge. It's used to export your accounts' keys stored there.`
  },
  general: {
    confirm: 'Confirm',
    remove: 'Remove',
    lock: 'Lock',
    load: 'Load',
    back: 'Back',
    password: 'Password',
    pwd_incorrect: 'password incorrect',
    optional: 'optional',
    refresh: 'Refresh',
    change: 'Change',
    important: 'important',
    address: 'address',
    version: 'Version',
    key: 'Key',
    copied: 'copied',
    simple: 'Simple',
    manual: 'Manual',
    app: 'App',

    state: 'State',
    reset: 'reset',
    responses: 'responses',
    account: 'account',

    allow: 'Allow',
    approve: 'Approve',
    reject: 'Reject',
    approved: 'Approved',
    rejected: 'Rejected'
  },
  menu: {
    create_key: 'Create key',
    import_key: 'Import key',
    local_managers: 'Local managers',
    settings: 'Settings',
    tools: 'Tools',
    error_logs: 'Error logs',
    about: 'About',

    mnemonic: 'Mnemonic',
    originated_accounts: 'Originated accounts',

    dapp_requests: 'DApp requests',
    remote_bridging: 'Remote bridging',
    temp_signer: 'Temporary signer',

    choose_signer: 'Choose signer'
  },
  import_key: {
    manager_name: 'Manager name',
    manager_name_used: 'manager name is used',
    lock_password: 'Locking password'
  },
  signer: {
    manager: 'Manager',
    source: 'Source'
  },
  requests: {
    operation: 'Operation',
    methods: {
      get_source: 'Get source address',
      set_host: 'Set RPC host',
      set_delegate: 'Set delegate for KT1 account',
      raw_sign: 'Sign operation bytes',
      raw_inject: 'Inject operation bytes',
      create_account: 'Create KT1 account',
      inject_operations: 'Sign & inject operations with minimal fee'
    },
    op_desc: {
      op_hash: 'Operation hash',
      kind: 'Kind',
      amount: 'Amount',
      balance: 'Balance',
      destination: 'Destination',
      fee: 'Fee',
      gas_limit: 'Gas limit',
      storage_limit: 'Storage limit',
      delegatable: 'Delegatable',
      spendable: 'Spendable',
      delegate: 'Delegate',
      script: 'Script',
      parameters: 'Parameters',
      bytes: 'Bytes',
      host: 'RPC Host',
      signature: 'Signature',
      sign_bytes: 'Need to sign the bytes',
      parsed_ops: 'Parsed operations'
    }
  },
  key: {
    bits_of_entropy: 'Bits of entropy',
    derive_path: 'Derive path',
    words: 'Words',
    pkh: 'Public key hash',
    sk: 'Secret key',
    pk: 'Public key',
    encrypted: 'Encrypted key',
    ed25519_seed: 'Ed25519 seed',
    faucet: 'Faucet'
  },
  settings: {
    loading_protocol: 'Loading protocol',
    host: 'Host',
    language: 'Language',
    briding_mode: 'Bridging mode',
    ident_mark: 'Identification mark',
    invalid_host: 'invalid host'
  },
  remote: {
    safari_warning: 'The permission of microphone is needed to enable bridging function in Safari (for 1 second)',
    as_tunnel: 'As tunnel',
    as_signer: 'As signer',
    disconnected: 'Disconnected',
    connected: 'Connected',
    go_step2: 'Go step 2',
    tunnel_step1: 'Step 1 -> Send the connection info to the signer',
    tunnel_step2: 'Step 2 -> Paste or scan the connection info from the signer',
    signer_step1: 'Step 1 -> Paste or scan the connection info from the tunnel',
    signer_step2: 'Step 2 -> Send the connection info to the tunnel',
    conn_info: 'Connection info',
    paste_txt_image: 'Paste the connection text or QRCode image',
    qrcode_dropping: 'QRCode from image dropping',
    drop_qrcode_here: 'Drop remote connection QRCode here',
    qrcode_loading: 'QRCode from image loading',
    choose_my_role: 'Choose my role',
    tunnel: 'Tunnel',
    code: 'Code',
    input_conn_code_tunnel: 'Input the code from the tunnel',
    input_conn_code_signer: 'Input the code from the signer',
    invalid_code: 'invalid code '
  },
  hardware: {
    hardware_signer: 'Hardware signer',
    connect_ledger: 'Connect Ledger',
    check_your_ledger: 'Check your ledger'
  },
  tools: {
    home: 'Home',
    signer: 'Signer',
    playground: 'Playground',
    legacy: 'Legacy'
  },
  manager: {
    use_as_signer: 'Use as signer'
  }
}