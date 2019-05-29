export default {
  _: 'zh_CN',
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
    important: '重要',
    address: '地址',
    version: '版本',
    key: '密钥',
    copied: '已复制',

    state: '状态',
    reset: '重置',
    results: '处理结果',
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
    subordinate_contracts: '从属合约',

    dapp_requests: 'DApp请求',
    remote_bridging: '远程桥接',
    temp_signer: '临时签名账户',

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
      create_account: '创建从属账号',
      set_delegate: '为从属账号设置委托',
      raw_sign: '给操作字节信息签名',
      raw_inject: '发送已签名的操作字节信息到链上',
      inject_operations: '使用最小手续费签名并发送操作到链上'
    },
    op_desc: {
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
      bytes: '字节'
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
    host: '远程主机',
    invalid_host: '无效主机'
  },
  remote: {
    safari_warning: '在Safari上需要允许麦克风权限(仅开启1秒钟)来开启远程桥接功能',
    as_repeater: '作为中继器',
    as_signer: '作为签名器',
    disconnected: '未连接',
    connected: '已连接',
    go_step2: '到步骤2',
    step1: '步骤 1 -> 传送这段链接信息到您远端签名器',
    step2: '步骤 2 -> 黏贴或扫一扫您远端的链接信息',
    conn_info: '链接信息',
    paste_txt_image: '黏贴链接的文字信息或二维码',
    qrcode_dropping: '拖拽图片扫二维码',
    drop_qrcode_here: '拖拽二维码到这里',
    qrcode_loading: '载入图片扫二维码'
  },
  tools: {
    home: '首页',
    signer: '签名器',
    playground: '试验场'
  },
  manager: {
    balance: '余额',
    spendable: '可使用',
    use_as_signer: '用此账号签名'
  }
}