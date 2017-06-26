import React, { Component } from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import request from 'request';
import PredictionResult from './PredictionResult';

export default class ModelInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'input':
            {
                'model_group': '',
                'model_name': '',
                'model_interval': 0,
                'model_arguments': {}
            },
            'current_interval': '',
            'url': ''
        };
    }

    componentWillReceiveProps(props) {
        let input = {};
        input.model_group = props.model_group;
        input.model_name = props.model_name;
        input.model_interval = props.model_intervals;
        input.model_arguments = {};
        this.state = {
            'input': input,
            'current_interval': 0,
            'url': ''
        };
    }

    handleIntervalChange(value) {
        this.state.current_interval = value;
    }

    handleArgumentChange(type, key, value) {
        if (type == "integer" || type == "long") {
            value = parseInt(value);
        }
        else if (type == "float" || type == "double") {
            value = parseFloat(value);
        }
        let { input } = this.state;
        input.model_arguments[key] = value;
        this.setState({ input });
        this.refs.model_arguments.value = JSON.stringify(input.model_arguments);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.current_interval) {
            this.state.input.model_interval = this.state.current_interval;
        }
        request({
            method: "POST",
            uri: process.env.REACT_APP_SERVICE_HOST + '/api/prediction',
            body: this.state.input,
            json: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (err, resp, body) {
            if (err || resp.statusCode != 200) {
                if (resp) {
                    alert(resp.statusCode + ': ' + JSON.stringify(body));
                }
                else {
                    alert(err);
                }
            }
            else {
                this.setState({ 'url': body });
            }
        }.bind(this));
    }

    render() {
        return (
            this.props.model_group ?
                <div className="md-divider-border md-divider-border--below">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <TextField className="md-cell md-cell--bottom" id="model_group" label="Model group" value={this.props.model_group} locked />
                        <TextField className="md-cell md-cell--bottom" id="model_name" label="Model name" value={this.props.model_name} locked />
                        <TextField className="md-cell md-cell--bottom" id="model_intervals" label="Model intervals" value={this.props.model_intervals} locked />
                        <br />
                        <p>
                            <h4 className="md-cell md-cell--bottom">
                                Model Parameters
                            </h4>
                            <TextField className="md-cell md-cell--bottom" id="current_interval" label="Current interval" onChange={this.handleIntervalChange.bind(this)} />
                            {
                                this.props.model_arguments.map(arg => (
                                    <TextField
                                        className="md-cell md-cell--bottom"
                                        label={arg.key}
                                        name={arg.key}
                                        type={arg.value == "string" ? "text" : "number"}
                                        onChange={this.handleArgumentChange.bind(this, arg.value, arg.key)}
                                        value={this.state.input.model_arguments[arg.key] ? this.state.input.model_arguments[arg.key] : ""}
                                    />))
                            }
                            <input ref="model_arguments" name="model_arguments" type="hidden" /><br />
                            <Button className="md-cell md-cell--bottom" raised type="submit" label="Submit" />
                        </p>
                    </form><br />
                    <PredictionResult url={this.state.url} />
                </div> :
                <div />
        );
    }
}