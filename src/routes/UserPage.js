import React, { Component } from 'react';
import User from '../components/User/User';

export default class UserPage extends Component {
    render() {
        return (
            <div className="md-grid">
                <p className="md-cell md-cell--bottom">
                    <User query={this.props.location.query} />
                </p>
            </div>
        )
    }
}
