export default {
  _: 'en_US',
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
    important: 'important',
    address: 'address',
    version: 'Version',
    key: 'Key',
    copied: 'copied',

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
    subordinate_contracts: 'Subordinate contracts',

    dapp_requests: 'DApp requests',
    remote_bridging: 'Remote bridging',
    temp_signer: 'Temporary signer',

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
      create_account: 'Create KT1 account',
      set_delegate: 'Set delegate for KT1 account',
      raw_sign: 'Sign operation bytes',
      raw_inject: 'Inject signed operation bytes',
      inject_operations: 'Sign & inject operations with minimal fee'
    },
    op_desc: {
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
      bytes: 'Bytes'
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
    loading_protocol: 'Loading protocol script',
    host: 'Host',
    invalid_host: 'invalid host'
  },
  remote: {
    safari_warning: 'The permission of microphone is needed(for 1 second)  to enable bridging function in Safari',
    as_repeater: 'As repeater',
    as_signer: 'As signer',
    disconnected: 'Disconnected',
    connected: 'Connected',
    go_step2: 'Go step 2',
    repeater_step1: 'Step 1 -> Send the connection info to the signer',
    repeater_step2: 'Step 2 -> Paste or scan the connection info from the signer',
    signer_step1: 'Step 1 -> Paste or scan the connection info from the repeater',
    signer_step2: 'Step 2 -> Send the connection info to the repeater',
    conn_info: 'Connection info',
    paste_txt_image: 'Paste the connection text or QRCode image',
    qrcode_dropping: 'QRCode from image dropping',
    drop_qrcode_here: 'Drop remote connection QRCode here',
    qrcode_loading: 'QRCode from image loading'
  },
  tools: {
    home: 'Home',
    signer: 'Signer',
    playground: 'Playground'
  },
  manager: {
    use_as_signer: 'Use as signer'
  }
}