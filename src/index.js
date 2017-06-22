import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, hashHistory } from 'react-router';
import App from './routes/App';
import Home from './routes/Home';
import AdminPage from './routes/AdminPage';
import UserPage from './routes/UserPage';
import WebFontLoader from 'webfontloader';
import './styles/index.css';

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
});

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="admin" component={AdminPage} />
            <Route path="user" component={UserPage} />
        </Route>
    </Router>
), document.getElementById('app'))
