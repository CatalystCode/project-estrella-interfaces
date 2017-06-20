import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import AppPage from './routes/AppPage';
import AdminPage from './routes/AdminPage';
import UserPage from './routes/UserPage';
import './styles/index.css';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={AppPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/user" component={UserPage} />
    </Router>
), document.getElementById('app'))
