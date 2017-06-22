import React, { Component } from 'react';
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
<<<<<<< HEAD
    postUrl: process.env.REACT_APP_SERVICE_HOST
=======
    postUrl: `${process.env.REACT_APP_SERVICE_HOST + '/api/model'}`
>>>>>>> e9caebb40e198a016238a31f6a5cff567edb608b
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

    handleChange(name, event) {
        this.state.metadata[name] = event.target.value;
    }

    addArgument(name, event) {
        this.state.model_arguments.push({ 'name': '', 'type': '' });
        this.forceUpdate();
    }

    removeArgument(name, event) {
        this.state.model_arguments.pop();
        this.forceUpdate();
    }

    updateArgument(id, name, event) {
        this.state.model_arguments[id][name] = event.target.value;
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
                <p>
                    Model parameters<button type="button" onClick={this.addArgument.bind(this)}>Add</button><br />
                </p>
            )
        }
        else {
            modelParams = (
                <p>
                    Model parameters<br />
                    {this.state.model_arguments.map((arg, id) => (
                        <div>
                            Name<input name={arg.name} type={"text"} onChange={this.updateArgument.bind(this, id, 'name')}></input>
                            Type<input name={arg.type} type={"text"} onChange={this.updateArgument.bind(this, id, 'type')}></input>
                        </div>))}
                    <button type="button" onClick={this.addArgument.bind(this)}>Add</button>
                    <button type="button" onClick={this.removeArgument.bind(this)}>Remove</button>
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
                Model group: <input type="text" name="model_group" value={this.state.metadata.model_group} onChange={this.handleChange.bind(this, 'model_group')} /><br />
                Model name: <input type="text" name="model_name" value={this.state.metadata.model_name} onChange={this.handleChange.bind(this, 'model_name')} /><br />
                Model intervals: <input type="number" name="model_intervals" value={this.state.metadata.model_intervals} onChange={this.handleChange.bind(this, 'model_intervals')} /><br />
                Model frequency: <input type="text" name="model_frequency" value={this.state.metadata.model_frequency} onChange={this.handleChange.bind(this, 'model_frequency')} /><br />
                {modelParams}
                <div className="col-lg-12 text-left">
                    <div className="row" style={styles.button}>
                        <button type="button" onClick={this.handleUpload.bind(this)} className={className + " btn"}>
                            {action === 'processing' ? <i className="fa fa-spinner fa-spin fa-fw"></i> : null}
                            {message} &nbsp;
                    </button>
                    </div>
                </div>
            </div>
        );
    }
}
