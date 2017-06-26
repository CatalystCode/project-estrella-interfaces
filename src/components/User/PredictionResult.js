import React, { Component } from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import request from 'request';

export default class PredictionResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'url': '',
            'prediction': ''
        }
    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            'url': nextProps.url,
            'prediction': ''
        }
    }

    queryPrediction() {
        request(this.state.url, function (error, response, body) {
            if (response && response.statusCode == 200) {
                this.setState({ 'prediction': body });
            }
            else {
                let message = error ? error.message : body;
                this.setState({ 'prediction': message });
            }
        }.bind(this));
    }

    render() {
        let prediction = '';
        if (this.props.url) {
            prediction = this.state.prediction;
        }

        return (
            this.props.url ?
                <div className="md-divider-border md-divider-border--below">
                    <TextField className="md-cell md-cell--bottom" label="URL" value={this.props.url} size="100" locked />
                    <Button className="md-cell md-cell--bottom" raised label="Query" onClick={this.queryPrediction.bind(this)} /><br /><br />
                    <p>
                        {prediction}
                    </p>
                </div> :
                <div />
        )
    }
}
