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
    postUrl: `${process.env.REACT_APP_SERVICE_HOST}`
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
        };
    }

    handleChange(name, event) {
        this.state.metadata[name] = event.target.value;
    }    

    fileAdded(file) {
        this.setState({action: 'loaded'});
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
        xhr.setRequestHeader("metadata", JSON.stringify(this.state.metadata));
    }

    uploadCompleted(file, response, ev) {
        if (!response) {
            return;
        }

        this.dropzone.removeAllFiles();
        this.setState({action: 'processed'});
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

        this.setState({action: 'processing'});
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

        const {action} = this.state;
        const className = action === 'processed' ? 'btn-success' : action === 'failed' ? 'btn-danger' : 'btn-primary';
        const message = action === 'processed' ? 'Model Uploaded' : action === 'failed' ? 'Upload Failed' : 'Upload';

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
                Model parameters: <input type="text" name="model_parameters" onChange={this.handleChange.bind(this, 'model_parameters')} /><br />                
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
