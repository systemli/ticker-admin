import React, { FC } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import SettingsView from './views/SettingsView'
import TickerView from './views/TickerView'
import UsersView from './views/UsersView'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import '../leaflet.config.js'

const App: FC = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Switch>
          <Route component={HomeView} exact path="/" />
          <Route component={LoginView} exact path="/login" />
          <Route component={TickerView} path="/ticker/:tickerId" />
          <Route component={UsersView} path="/users" />
          <Route component={SettingsView} path="/settings" />
        </Switch>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
