import React, { Component } from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import request from 'request';
import ModelInput from './ModelInput';

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model_group: '',
            model_name: '',
            model_intervals: 0,
            model_arguments: [],
            url: '',
            query: {}
        };
        this.queryModelInfo = this.queryModelInfo.bind(this);
    }

    handleChange(name, value) {
        this.state.query[name] = value;
    }

    handleSubmit() {
        let requestUrl = process.env.REACT_APP_SERVICE_HOST + "/api/model?model_name=" + this.state.query.model_name + "&model_group=" + this.state.query.model_group;
        this.queryModelInfo(requestUrl);
    }

    componentWillUpdate(nextProps, nextState) {
        let query = nextProps.query;
        if (!query.model_name) {
            return;
        }

        let requestUrl = process.env.REACT_APP_SERVICE_HOST + "/api/model?model_name=" + query.model_name + "&model_group=" + query.model_group;
        if (requestUrl === this.state.url) {
            return;
        }

        this.queryModelInfo(requestUrl);
    }

    queryModelInfo(url) {
        request(url, function (error, response, body) {
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

                this.setState({
                    'model_group': model_group,
                    'model_name': model_name,
                    'model_intervals': model_intervals,
                    'model_arguments': model_arguments,
                    'url': url
                });
            }
            else {
                this.setState({
                    model_group: '',
                    model_name: '',
                    model_intervals: 0,
                    model_arguments: [],
                    url: ''
                });
            }
        }.bind(this));
    }

    render() {
        let query;
        if (!this.state.model_group) {
            query = (
                <div className="md-divider-border md-divider-border--below">
                    <TextField id="model_group" placeholder="Model group" className="md-cell md-cell--bottom" onChange={this.handleChange.bind(this, 'model_group')} />
                    <TextField id="model_name" placeholder="Model name" className="md-cell md-cell--bottom" onChange={this.handleChange.bind(this, 'model_name')} />
                    <br />
                    <p>
                        <Button className="md-cell md-cell--bottom" raised onClick={this.handleSubmit.bind(this)} label="Submit" />
                    </p>
                </div>
            );
        }
        else {
            query = (
                <div />
            )
        }

        return (
            <div>
                <ModelInput
                    model_group={this.state.model_group}
                    model_name={this.state.model_name}
                    model_intervals={this.state.model_intervals}
                    model_arguments={this.state.model_arguments}
                />
                {query}
            </div>
        )
    }
}
