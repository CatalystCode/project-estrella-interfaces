import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../styles/home.css';

export default class Home extends Component {
    render() {
        return (
            <div className="home">
                <div className="home-header">
                    <img src={logo} className="home-logo" alt="logo" />
                    <h2>Welcome!</h2>
                </div>
                <p className="home-intro">
                    Project-Estrella goal is to operationalize the execution of parameterized <code>R</code> modules.
                </p>
            </div>
        );
    }
}
