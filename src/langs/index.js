// @flow

import en_us from './en-us'
import zh_cn from './zh-cn'

const langs = {
  en_us,
  zh_cn
}

const current_lang = langs.en_us

export function switchLang(name : string) {
  if (!langs[name])
    throw `Do not support the target language ${name}`

  Object.assign(current_lang, langs[name])
}

export default current_lang