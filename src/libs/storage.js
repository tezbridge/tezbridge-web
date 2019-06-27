// @flow

declare var TBC : any

const get = key => localStorage.getItem(key)
const set = (k, v) => localStorage.setItem(k, v + '')

type Manager = {
  name: string,
  enc: string
}


const defaults = {
  version: '1',
  managers: '[]',
  settings: '{}',
  ready_manager: '{"enc":"", "name":"", "source":""}'
}

class Storage {
  version : number
  managers : Array<Manager>
  ready_manager: {enc: string, name: string, source: string}
  settings : {[string]: Object}

  constructor() {
    const version = get('version') || defaults.version
    const managers = get('managers') || defaults.managers
    const settings = get('settings') || defaults.settings
    const ready_manager = get('ready_manager') || defaults.ready_manager

    this.version = parseInt(version)
    this.managers = JSON.parse(managers)
    this.settings = JSON.parse(settings)
    this.ready_manager = JSON.parse(ready_manager)

    this.recoverSettings()
  }

  recoverSettings() {
    if (!this.settings.language)
      this.settings.language = 'en_US'
    
    if (!this.settings.host)
      this.settings.host = 'https://alphanet-node.tzscan.io'

    if (!this.settings.bridging_mode)
      this.settings.bridging_mode = 'simple'
  }

  setReadyManager(box : TBC.crypto.EncryptedBox, name : string, source : string) {
    const password = TBC.codec.bs58checkEncode(TBC.crypto.genRandomBytes(8), new Uint8Array([71, 55]))

    box.reveal('', password)
    .then(() => {
      box.show()
      .then(enc => {
        this.ready_manager.enc = enc
        this.ready_manager.name = name
        this.ready_manager.source = source
        
        set('ready_manager', JSON.stringify(this.ready_manager))
        box.reveal(password, '')
        return Promise.resolve(true)
      })
    })

    return password
  }

  removeReadyManager() {
    this.ready_manager = JSON.parse(defaults.ready_manager)
    set('ready_manager', JSON.stringify(this.ready_manager))
  }

  useReadyManager() {
    const ready_manager = JSON.parse(get('ready_manager') || defaults.ready_manager)
    if (!ready_manager.enc) {
      const box = new TBC.crypto.EncryptedBox(ready_manager.enc)
      set('ready_manager', defaults.ready_manager)
      return box
    } else {
      throw 'No ready manager'
    }
  }

  addManager(manager : Manager) {
    for (let i = 0; i < this.managers.length; i++) {
      if (manager.name === this.managers[i].name)
        return false
    }

    this.managers.push(manager)
    return this.saveManagers()
  }

  indexOfManager(name : string) {
    for (let i = 0; i < this.managers.length; i++) {
      if (name === this.managers[i].name)
        return i
    }

    return -1
  }

  removeManager(name : string) {
    const index = this.indexOfManager(name)
    if (index === -1)
      return false
    else {
      this.managers.splice(index, 1)
      return this.saveManagers()
    }
  }

  saveVersion() {
    return set('version', this.version)
  }

  saveManagers() {
    return set('managers', JSON.stringify(this.managers))
  }

  saveSettings() {
    return set('settings', JSON.stringify(this.settings))
  }

}

const storage = new Storage()
export default storage