import React, { Component } from 'react';
import User from '../components/User/User';

export default class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {query: props.location.query};
    }

    render() {
        return (
            <div className="md-grid">
                <p className="md-cell md-cell--bottom">
                    <User query={this.state.query} />
                </p>
            </div>
        )
    }
}
