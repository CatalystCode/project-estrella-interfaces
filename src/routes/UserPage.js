import React, { Component } from 'react';
import User from '../components/User/User';

export default class UserPage extends Component {
    render() {
        return (
            <User query={this.props.location.query} />
        )
    }
}
