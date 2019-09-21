export default {
  _: 'zh_CN',
  help: {
    ident_mark: `显示在LOGO旁边的识别记号是用来防止假的TezBridge进行钓鱼攻击的。
                |当一个DApp打开TezBridge的时候，你应该注意到一个之前生成的熟悉的识别记号。否则，它可能就是一个假网站。`,
    mnemonic: `使用>=12个助记词来生成种子密钥。生成的助记词也可以被其他Tezos钱包导入。
              |并且你也可以通过设定衍生路径来建立一个与Ledger兼容的助记词。`,
    bits_of_entropy: `熵的比特位越大越安全，助记词也会越多。
                      |熵的比特位可以设定为128到256。但它必须能被8整除。`,
    derive_path: `这个设定与分层确定性(HD)密钥相关。 
                  它通常用来兼容支持多链的钱包，比如Ledger`,
    ed25519: `Ed25519 是推荐的加密算法。它也是tezos-client默认的加密算法。
              |Ed25519生成的公钥哈希值在Tezos系统里，以tz1开头。`,
    secp256k1: `Tezos支持在比特币中使用的secp256k1加密算法，并且secp256k1生成的公钥哈希值在Tezos系统里，以tz2开头。`,
    p256: `Tezos支持NIST P-256加密算法，并且P256生成的公钥哈希值在Tezos系统里，以tz3开头。`,
    bridging_mode: `这个选项是用来改变交换远程签名器信息的方法的。
            远程签名器是通过浏览器原生的WebRTC通道来发送数据到。
            因此，这个选项决定了用户能在界面上看到哪种交换方式。
                    |简单: 使用Netlify lambda function来交换连接信息。
                    |手动: 让用户可以通过二维码或文字发送来交换连接信息。`,
    signer: `它会打开TezBridge的签名器页面。TezBridge签名器通常是由第三方的DApp站点来直接打开的。`,
    playground: `这里是给开发者提供的，关于TezBridge插件整合的各种可编辑的例子。`,
    legacy: `会跳转到老版本TezBridge。通常用来导出先前的账户密钥。`
  },
  general: {
    confirm: '确认',
    remove: '删除',
    lock: '上锁',
    load: '载入',
    back: '返回',
    password: '密码',
    pwd_incorrect: '密码不正确',
    optional: '可选',
    refresh: '刷新',
    change: '更改',
    important: '重要',
    address: '地址',
    version: '版本',
    key: '密钥',
    copied: '已复制',
    simple: '简易',
    manual: '手工',
    app: '应用',
    dapp: 'DApp',
    protocol: '协议',

    state: '状态',
    reset: '重置',
    responses: '回应结果',
    account: '账号',

    allow: '允许',
    approve: '允许',
    reject: '拒绝',
    approved: '已允许',
    rejected: '已拒绝'
  },
  menu: {
    create_key: '创建密钥',
    import_key: '导入密钥',
    local_managers: '本地账户',
    settings: '设置',
    tools: '工具',
    error_logs: '错误日志',
    about: '关于',

    mnemonic: '助记词',
    originated_accounts: '创建的账号',

    dapp_requests: 'DApp请求',
    remote_bridging: '远程桥接',
    temp_signer: '临时签名账户',

    choose_signer: '选择签名器'
  },
  import_key: {
    manager_name: '账户名字',
    manager_name_used: '账户名字已被使用',
    lock_password: '上锁密码'
  },
  signer: {
    manager: '管理员账户',
    source: '当前账号'
  },
  requests: {
    operation: '操作',
    methods: {
      get_source: '获取当前账号',
      set_host: '设置RPC远程主机',
      set_delegate: '为从属账号设置委托',
      raw_sign: '给操作字节信息签名',
      raw_inject: '发送操作字节信息到链上',
      create_account: '创建从属账号',
      inject_operations: '使用最小手续费签名并发送操作到链上'
    },
    op_desc: {
      op_hash: '操作哈希',
      kind: '类型',
      amount: '金额',
      balance: '余额',
      destination: '目标账号',
      fee: '小费',
      gas_limit: '燃料限额',
      storage_limit: '存储限额',
      delegatable: '是否可被代理',
      spendable: '是否可被使用',
      delegate: '代理账号',
      script: '脚本',
      parameters: '参数',
      bytes: '字节',
      host: 'RPC远程主机',
      signature: '签名',
      sign_bytes: '需要给字节签名',
      parsed_ops: '解析后的操作',
      rpc_node: 'RPC节点'
    }
  },
  key: {
    bits_of_entropy: '熵的位数',
    derive_path: '衍生路径',
    words: '助记词',
    pkh: '公钥哈希值',
    sk: '私钥',
    pk: '公钥',
    encrypted: '已加密的私钥',
    ed25519_seed: 'Ed25519种子',
    faucet: 'Faucet'
  },
  settings: {
    loading_protocol: '正在载入协议',
    host: '远程主机',
    language: '语言',
    briding_mode: '桥接模式',
    ident_mark: '识别记号',
    invalid_host: '无效主机'
  },
  remote: {
    safari_warning: '在Safari上需要允许麦克风权限来开启远程桥接功能(仅需1秒钟)',
    as_tunnel: '作为桥接端',
    as_signer: '作为签名端',
    disconnected: '未连接',
    connected: '已连接',
    go_step2: '到步骤2',
    tunnel_step1: '步骤 1 -> 传送这段链接信息到您签名端',
    tunnel_step2: '步骤 2 -> 黏贴或扫一扫您签名端的链接信息',
    signer_step1: '步骤 1 -> 黏贴或扫一扫您中继端的链接信息',
    signer_step2: '步骤 2 -> 传送这段链接信息到您桥接端',
    conn_info: '链接信息',
    paste_txt_image: '黏贴链接的文字信息或二维码',
    qrcode_dropping: '拖拽图片扫二维码',
    drop_qrcode_here: '拖拽二维码到这里',
    qrcode_loading: '载入图片扫二维码',
    choose_my_role: '选择我的角色',
    tunnel: '桥接器',
    code: '桥接码',
    input_conn_code_tunnel: '输入桥接器的桥接码',
    input_conn_code_signer: '输入签名器的桥接码',
    invalid_code: '错误的桥接码'
  },
  hardware: {
    hardware_signer: '硬件签名器',
    connect_ledger: '连接Ledger',
    check_your_ledger: '查看你的Ledger'
  },
  tools: {
    home: '首页',
    signer: '签名器',
    playground: '试验场',
    legacy: '旧版'
  },
  manager: {
    sk_reveal: '显示私钥',
    use_as_signer: '用此账号签名'
  }
}