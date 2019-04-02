// @flow

import TBC from 'tezbridge-crypto'

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
  active_manager: '{"enc": "", "address": ""}'
}

class Storage {
  version : number
  managers : Array<Manager>
  active_manager: {enc: string, address: string}
  settings : {[string]: Object}

  constructor() {
    const version = get('version') || defaults.version
    const managers = get('managers') || defaults.managers
    const settings = get('settings') || defaults.settings
    const active_manager = get('active_manager') || defaults.active_manager

    this.version = parseInt(version)
    this.managers = JSON.parse(managers)
    this.settings = JSON.parse(settings)
    this.active_manager = JSON.parse(active_manager)
  }

  setActiveManager(box : TBC.crypto.EncryptedBox) {
    const password = TBC.codec.toHex(TBC.crypto.genRandomBytes(8))

    return box.revealKey('', password)
    .then(key => {
      box.show()
      .then(enc => {
        this.active_manager.enc = enc
        this.active_manager.address = key.address.slice(0, 4) + '********' + key.address.slice(-4)

        set('active_manager', JSON.stringify(this.active_manager))
        box.reveal(password, '')
        return Promise.resolve(true)
      })
    })
  }

  useActiveManager() {
    const active_manager = JSON.parse(get('active_manager') || defaults.active_manager)
    if (!active_manager.enc) {
      const box = new TBC.crypto.EncryptedBox(active_manager.enc)
      set('active_manager', defaults.active_manager)
      return box
    } else {
      throw 'No active manager'
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