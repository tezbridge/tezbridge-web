// @flow

const get = key => localStorage.getItem(key)
const set = (k, v) => localStorage.setItem(k, v + '')

type Manager = {
  name: string,
  enc: string
}

class Storage {
  version : number
  managers : Array<Manager>
  settings : {[string]: Object}

  constructor() {
    const version = get('version') || '1'
    const managers = get('managers') || '[]'
    const settings = get('settings') || '{}'

    this.version = parseInt(version)
    this.managers = JSON.parse(managers)
    this.settings = JSON.parse(settings)
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