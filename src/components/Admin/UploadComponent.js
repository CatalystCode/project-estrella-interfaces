import React, { Component } from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import DropzoneComponent from 'react-dropzone-component';
import '../../styles/UploadComponent.css';
import 'dropzone/dist/min/dropzone.min.css';

const djsConfig = {
    addRemoveLinks: true,
    maxFiles: 1,
    autoProcessQueue: false
};

const componentConfig = {
    iconFiletypes: ['.bin', '.txt', '.json'],
    showFiletypeIcon: true,
    postUrl: `${process.env.REACT_APP_SERVICE_HOST + '/api/model'}`
};

const styles = {
    button: {
        paddingLeft: 15,
        paddingBottom: 10,
        paddingTop: 10
    }
};

export default class UploadComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            metadata: {},
            action: 'loaded',
            model_arguments: []
        };
    }

    handleChange(name, value) {
        this.state.metadata[name] = value;
    }

    addArgument() {
        this.state.model_arguments.push({ 'name': '', 'type': '' });
        this.forceUpdate();
    }

    removeArgument() {
        this.state.model_arguments.pop();
        this.forceUpdate();
    }

    updateArgument(id, name, value) {
        this.state.model_arguments[id][name] = value;
    }

    fileAdded(file) {
        this.setState({ action: 'loaded' });
        this.dropzone.updateTotalUploadProgress();
    }

    initialize(dz) {
        this.dropzone = dz;
        this.dropzone.removeAllFiles(true);
    }

    maxFilesExceeded(file) {
        this.dropzone.removeAllFiles();
        this.dropzone.addFile(file);
    }

    uploadInterceptor(file, xhr, formData) {
        var modelParameters = {};
        modelParameters.interval = { 'type': 'integer' };
        modelParameters.arguments = {};
        this.state.model_arguments.map(arg => (
            modelParameters.arguments[arg.name] = { 'type': arg.type }
        ));

        this.state.metadata.model_parameters = JSON.stringify(modelParameters);
        xhr.setRequestHeader('metadata', JSON.stringify(this.state.metadata));
    }

    uploadCompleted(file, response, ev) {
        if (!response) {
            return;
        }

        this.dropzone.removeAllFiles();
        this.setState({ action: 'processed' });
    }

    uploadFailed(file, response, ev) {
        this.dropzone.removeAllFiles();
        alert(response["message"]);
    }

    handleUpload() {
        if (this.dropzone.files.length == 0) {
            alert('Please select a model file to upload');
            return;
        }

        this.setState({ action: 'processing' });
        this.dropzone.processQueue();
    }

    render() {
        const eventHandlers = {
            init: this.initialize.bind(this),
            complete: this.uploadCompleted.bind(this),
            addedfile: this.fileAdded.bind(this),
            maxfilesexceeded: this.maxFilesExceeded.bind(this),
            sending: this.uploadInterceptor.bind(this),
            success: this.uploadCompleted.bind(this),
            error: this.uploadFailed.bind(this)
        }

        const { action } = this.state;
        const className = action === 'processed' ? 'btn-success' : action === 'failed' ? 'btn-danger' : 'btn-primary';
        const message = action === 'processed' ? 'Model Uploaded' : action === 'failed' ? 'Upload Failed' : 'Upload';

        let modelParams;
        if (this.state.model_arguments.length == 0) {
            modelParams = (
                <Button className="md-cell md-cell--bottom" raised onClick={this.addArgument.bind(this)} label="Add" />
            )
        }
        else {
            modelParams = (
                <p>
                    {this.state.model_arguments.map((arg, id) => (
                        <div className="md-grid">
                            <TextField className="md-cell md-cell--bottom" placeholder="Name" name={arg.name} onChange={this.updateArgument.bind(this, id, 'name')} />
                            <TextField className="md-cell md-cell--bottom" placeholder="Type" name={arg.type} onChange={this.updateArgument.bind(this, id, 'type')} />
                        </div>
                    ))}
                    <p>
                        <Button className="md-cell md-cell--bottom" raised onClick={this.addArgument.bind(this)} label="Add" />
                        <Button className="md-cell md-cell--bottom" raised onClick={this.removeArgument.bind(this)} label="Remove" />
                    </p>
                </p>
            )
        }

        return (
            <div>
                <div className="col-lg-12 text-center">
                    <DropzoneComponent config={componentConfig}
                        eventHandlers={eventHandlers}
                        djsConfig={djsConfig} />
                </div>
                <div className="md-grid">
                    <TextField id="model_group" placeholder="Model group" className="md-cell md-cell--bottom" onChange={this.handleChange.bind(this, 'model_group')} />
                    <TextField id="model_name" placeholder="Model name" className="md-cell md-cell--bottom" onChange={this.handleChange.bind(this, 'model_name')} />
                    <TextField id="model_intervals" type="number" placeholder="Model intervals" className="md-cell md-cell--bottom" onChange={this.handleChange.bind(this, 'model_intervals')} />
                    <TextField id="model_frequency" placeholder="Model frequency" className="md-cell md-cell--bottom" onChange={this.handleChange.bind(this, 'model_frequency')} />
                    <br />
                </div>
                <p>
                    <h4 className="md-cell md-cell--bottom">
                        Model Parameters
                    </h4>
                    {modelParams}
                </p>
                <br /><br /><br />
                <p>
                    <Button className="md-cell md-cell--bottom" raised onClick={this.handleUpload.bind(this)} label={message} />
                </p>
            </div>
        );
    }
}
