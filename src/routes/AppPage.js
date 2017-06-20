import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../styles/global.css';

export default class AppPage extends Component {
    render() {
        return (
            <div className="AppPage">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
            </div>
        );
    }
}
