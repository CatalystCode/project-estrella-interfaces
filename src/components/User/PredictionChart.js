import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class PredictionChart extends Component {
    render() {
        return (
            this.props.data ?
                <div>
                    <LineChart width={600} height={300} data={this.props.data}
                        margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="interval" />
                        <YAxis dataKey="prediction" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="prediction" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </div> :
                <div />
        )
    }
}
