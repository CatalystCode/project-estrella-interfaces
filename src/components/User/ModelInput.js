import React, { Component } from 'react';
import request from 'request';

export default class ModelInput extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.state = ({
            model_group: nextProps.model_group,
            model_name: nextProps.model_name,
            model_intervals: nextProps.model_intervals,
            model_arguments: {}
        });
    }

    handleChange(event) {
        this.state.model_arguments[event.target.name] = event.target.value;
        this.refs.model_arguments.value = JSON.stringify(this.state.model_arguments);
    }


    handleSubmit(event) {
        event.preventDefault();
        request({
            method: "PUT",
            uri: process.env.REACT_APP_SERVICE_HOST,
            json: JSON.stringify(this.state)
        }, function (err, resp, body) {
            if (err || resp.statusCode != 200) {
                alert(resp.statusCode + ': ' + JSON.stringify(body));
            } 
            else {
                alert('Success!');
            }
        });
    }

    render() {
        return (
            this.props.model_group ?
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <p>Model group:<input name="model_group" type="text" value={this.props.model_group} disabled /></p>
                        <p>Model name:<input name="model_name" type="text" value={this.props.model_name} disabled /></p>
                        <p>Model intervals:<input name="model_intervals" type="number" value={this.props.model_intervals} disabled /></p>
                        <p>Model arguments:</p>
                        {this.props.model_arguments.map(arg => (<p>{arg.key}<input name={arg.key} type={arg.value == "string" ? "text" : "number"} onChange={this.handleChange}></input></p>))}
                        <input ref="model_arguments" name="model_arguments" type="hidden" onChange={this.handleChange} />
                        <input type="submit" value="Submit" />
                    </form>
                </div> :
                <div />
        );
    }
}