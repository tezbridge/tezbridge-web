// @flow

import de_DE from './de-DE'
import en_US from './en-US'
import ja_JP from './ja-JP'
import ko_KR from './ko-KR'
import zh_CN from './zh-CN'

const langs = {
  de_DE,
  en_US,
  ja_JP,
  ko_KR,
  zh_CN
}

const current_lang = Object.assign({}, langs.zh_CN)

export function switchLang(name : string) {
  if (!langs[name])
    throw `Do not support the target language ${name}`

  Object.assign(current_lang, langs[name])
}

export default current_lang