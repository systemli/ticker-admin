import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import TickerView from "./views/TickerView";

const Ticker = ({match}) => {
    return (
        <TickerView id={match.params.id}/>
    );
};

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={HomeView}/>
            <Route exact path="/login" component={LoginView}/>
            <Route path="/ticker/:id" component={Ticker}/>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);
registerServiceWorker();
