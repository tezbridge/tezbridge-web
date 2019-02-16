// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { Button, Placeholder } from 'semantic-ui-react'

import { models } from './models'
import { signal, signals } from './signals'
import './actions'
import { App } from '../framework'

const root_node = document.getElementById('root')

function Xx({model} : {model : Object}) {
  return (
    <div>
      <span>{model.x}</span>
      <Button onClick={() => signals.Increment(2)(model)}>Test</Button>
    </div>
  )
}

function Page() {
  return <Xx model={models.get('setting')} />
}

if (root_node) {
  ReactDOM.render(
    <App content={Page} signal={signal} />,
    root_node
  )
}