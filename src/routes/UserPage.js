import React, { Component } from 'react';
import User from '../components/User/User';
import logo from '../images/logo.svg';
import '../styles/global.css';

export default class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {query: props.location.query};
    }

    render() {
        return (
            <div className="AppPage">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>User Page</h2>
                </div>
                <p className="App-body">
                    <User query={this.state.query} />
                </p>
            </div>
        )
    }
}
