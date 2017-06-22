import React, { Component } from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
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

    handleChange(type, key, value) {
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
                        <TextField id="model_group" label="Model group" value={this.props.model_group} locked />
                        <TextField id="model_name" label="Model name" value={this.props.model_name} locked />
                        <TextField id="model_intervals" label="Model intervals" value={this.props.model_intervals} locked />
                        <br />
                        <p>
                            <h4 className="md-cell md-cell--bottom">
                                Model Arguments
                            </h4>
                            {this.props.model_arguments.map(arg => (<TextField label={arg.key} name={arg.key} type={arg.value == "string" ? "text" : "number"} onChange={this.handleChange.bind(this, arg.key, arg.value)} />))}
                            <input ref="model_arguments" name="model_arguments" type="hidden" /><br />
                            <Button raised type="submit" label="Submit" />
                        </p>
                    </form><br />
                    <PredictionResult url={this.state.url} />
                </div> :
                <div />
        );
    }
}