import React, { Component } from 'react';
import UploadComponent from './UploadComponent';
import request from 'request';

export default class Admin extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <UploadComponent />
        )
    }
}
