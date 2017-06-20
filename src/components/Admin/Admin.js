import React, { Component } from 'react';
import request from 'request';

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {
                name: '',
                data: null
            },
            model_group: '',
            model_name: '',
            model_intervals: 0,
            model_frequency: '',
            model_parameters: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            file: {
                name: event.target.value,
                data: event.target.files[0]
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        request.post({
            uri: process.env.REACT_APP_SERVICE_HOST,
            method: 'POST',
            multipart: [{
                body: this.state.file.data
            }]
        }, function (err, resp, body) {
            if (err) {
                alert('Error!');
            } 
            else {
                alert('URL: ' + body);
            }
        });
    }

    render() {
        return (
            <form action={process.env.REACT_APP_SERVICE_HOST} method="post" encType="multipart/form-data">
                <input type="file" name="file" value={this.state.file.name} onChange={this.handleChange} /><br />
                Model group: <input type="text" name="model_group" value={this.state.model_group} onChange={this.handleChange} /><br />
                Model name: <input type="text" name="model_name" value={this.state.model_name} onChange={this.handleChange} /><br />
                Model intervals: <input type="number" name="model_intervals" value={this.state.model_intervals} onChange={this.handleChange} /><br />
                Model frequency: <input type="text" name="model_frequency" value={this.state.model_frequency} onChange={this.handleChange} /><br />
                Model parameters: <input type="text" name="model_parameters" onChange={this.handleChange} /><br />
                <input type="submit" value="Submit" />
            </form>
        )
    }
}
