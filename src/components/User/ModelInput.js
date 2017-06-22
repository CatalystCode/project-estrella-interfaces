import React, { Component } from 'react';
import request from 'request';
import PredictionResult from './PredictionResult';

export default class ModelInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'input': '',
            'url': ''
        };
    }

    componentDidUpdate(prevProps, prevState) {
        let input = {};
        input.model_group = prevProps.model_group;
        input.model_name = prevProps.model_name;
        input.model_interval = prevProps.model_intervals;
        input.model_arguments = {};
        this.state = {
            'input': input,
            'url': prevState.url
        };
    }

    handleChange(type, event) {
        var value = event.target.value;
        if (type == "integer" || type == "long") {
            value = parseInt(value);
        }
        else if (type == "float" || type == "double") {
            value = parseFloat(value);
        }
        let { input } = this.state;
        input.model_arguments[event.target.name] = value;
        this.setState({ input });
        this.refs.model_arguments.value = JSON.stringify(input.model_arguments);
    }

    handleSubmit(event) {
        event.preventDefault();
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
                <div>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <p>Model group:<input name="model_group" type="text" value={this.props.model_group} disabled /></p>
                        <p>Model name:<input name="model_name" type="text" value={this.props.model_name} disabled /></p>
                        <p>Model intervals:<input name="model_intervals" type="number" value={this.props.model_intervals} disabled /></p>
                        <p>Model arguments:</p>
                        {this.props.model_arguments.map(arg => (<p>{arg.key}<input name={arg.key} type={arg.value == "string" ? "text" : "number"} onChange={this.handleChange.bind(this, arg.value)}></input></p>))}
                        <input ref="model_arguments" name="model_arguments" type="hidden" />
                        <input type="submit" value="Submit" />
                    </form><br />
                    <PredictionResult url={this.state.url} />
                </div> :
                <div />
        );
    }
}