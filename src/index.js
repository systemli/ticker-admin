import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import TickerView from './views/TickerView'
import UsersView from './views/UsersView'
import SettingsView from './views/SettingsView'
import PropTypes from 'prop-types'
import '../leaflet.config.js'

/* Offline-plugin allows offline availability.
Only loaded in prod environment (see webpack.prod.js)
to allow hot reloading of webpack-dev-server */
const runtime = require('offline-plugin/runtime')

runtime.install({
  onUpdating: () => {},
  onUpdateReady: () => {
    runtime.applyUpdate()
  },
  onUpdated: () => {},
  onUpdateFailed: () => {},
})

const Ticker = ({ match }) => {
  let id = parseInt(match.params.id)

  return <TickerView id={id} />
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={HomeView} />
      <Route exact path="/login" component={LoginView} />
      <Route path="/ticker/:id" component={Ticker} />
      <Route path="/users" component={UsersView} />
      <Route path="/settings" component={SettingsView} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)

Ticker.propTypes = {
  match: PropTypes.object.isRequired,
}
