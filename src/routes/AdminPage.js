import React, { Component } from 'react';
import Admin from '../components/Admin/Admin';
import logo from '../images/logo.svg';
import '../styles/global.css';

export default class AdminPage extends Component {
    render() {
        return (
            <div className="AppPage">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Admin Page</h2>
                </div>
                <p className="App-body">
                    <Admin />
                </p>
            </div>
        )
    }
}
