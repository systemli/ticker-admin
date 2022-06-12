import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import TickerView from './views/TickerView'
import UsersView from './views/UsersView'
import SettingsView from './views/SettingsView'
import PropTypes from 'prop-types'
import '../leaflet.config.js'

const Ticker = ({ match }) => {
  let id = parseInt(match.params.id)

  return <TickerView id={id} />
}

const queryClient = new QueryClient()

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Switch>
        <Route component={HomeView} exact path="/" />
        <Route component={LoginView} exact path="/login" />
        <Route component={Ticker} path="/ticker/:id" />
        <Route component={UsersView} path="/users" />
        <Route component={SettingsView} path="/settings" />
      </Switch>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
  document.getElementById('root')
)

Ticker.propTypes = {
  match: PropTypes.object.isRequired,
}
