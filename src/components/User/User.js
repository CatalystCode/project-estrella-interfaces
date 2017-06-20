import React, { Component } from 'react';
import request from 'request';
import ModelInput from './ModelInput';

export default class User extends Component {
    constructor(props) {
        super(props);
        let query = props.query;
        let requestUrl = process.env.REACT_APP_SERVICE_HOST + "?model_name=" + query.model_name + "&model_group=" + query.model_group;
        this.state = {
            model_group: '',
            model_name: '',
            model_intervals: 0,
            model_arguments: []
        };
        
        request(requestUrl, function (error, response, body) {
            if (response && response.statusCode == 200) {
                var json = JSON.parse(body);
                var model_group = json['model_group'];
                var model_name = json['model_name'];
                var model_intervals = json['model_intervals'];
                var jsonModelArgs = json['model_parameters']['arguments'];
                var model_arguments = [];
                for (var key in jsonModelArgs) {
                    if (jsonModelArgs.hasOwnProperty(key)) {
                        model_arguments.push({ 'key': key, 'value': jsonModelArgs[key].type });
                    }
                }

                this.setState((prevState) => ({
                    model_group: model_group,
                    model_name: model_name,
                    model_intervals: model_intervals,
                    model_arguments: model_arguments
                }));
            }
        }.bind(this));
    }

    render() {
        return (
            <ModelInput model_group={this.state.model_group} model_name={this.state.model_name} model_intervals={this.state.model_intervals} model_arguments={this.state.model_arguments} />
        )
    }
}
