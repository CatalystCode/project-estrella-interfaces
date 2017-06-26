import React, { Component } from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import request from 'request';
import ModelInput from './ModelInput';
import PredictionChart from './PredictionChart';

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model_group: '',
            model_name: '',
            model_intervals: 0,
            model_arguments: [],
            url: '',
            query: {},
            chartData: []
        };
        this.queryModelInfo = this.queryModelInfo.bind(this);
    }

    handleChange(name, value) {
        this.state.query[name] = value;
    }

    handleSubmit() {
        this.queryModelInfo(this.state.query.model_name, this.state.query.model_group);
    }

    componentWillUpdate(nextProps, nextState) {
        let query = nextProps.query;
        if (!query.model_name) {
            return;
        }

        let url = process.env.REACT_APP_SERVICE_HOST + "/api/model?model_name=" + query.model_name + "&model_group=" + query.model_group;
        if (url === this.state.url) {
            return;
        }

        this.queryModelInfo(query.model_name, query.model_group);
    }

    queryModelInfo(modelName, modelGroup) {
        let modelUrl = process.env.REACT_APP_SERVICE_HOST + "/api/model?model_name=" + modelName + "&model_group=" + modelGroup;
        request(modelUrl, function (error, response, body) {
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
                    'url': modelUrl
                });

                let predictionUrl = process.env.REACT_APP_SERVICE_HOST + "/api/prediction?model_name=" + modelName + "&model_group=" + modelGroup;
                request(predictionUrl, function (error, response, body) {
                    if (response && response.statusCode == 200) {
                        let predictionDataArray = JSON.parse(body);
                        var chartDataArray = [];
                        predictionDataArray.map(data => {
                            let chartData = {
                                'interval': data.model_interval,
                                'prediction': data.model_prediction
                            }
                            chartDataArray.push(chartData);
                        });
                        this.setState({ 'chartData': chartDataArray });
                    }
                }.bind(this));
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

        let chart;
        if (this.state.chartData.length != 0) {
            chart = (
                <PredictionChart data={this.state.chartData} />
            );
        }

        var tdStyle = { 'vertical-align': 'top' };
        return (
            <table width="100%" border="0">
                <tr>
                    <td width="50%">
                        <ModelInput
                            model_group={this.state.model_group}
                            model_name={this.state.model_name}
                            model_intervals={this.state.model_intervals}
                            model_arguments={this.state.model_arguments}
                        />
                        {query}
                    </td>
                    <td style={tdStyle}>
                        {chart}
                    </td>
                </tr>
            </table>
        )
    }
}
