import React, { Component } from 'react';
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
                <div>
                    URL:<input type="text" value={this.props.url} size="100" disabled />
                    <button type="button" onClick={this.queryPrediction.bind(this)}>Query</button><br />
                    <p>
                        {prediction}
                    </p>
                </div> :
                <div />
        )
    }
}
