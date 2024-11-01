import React, { Component } from "react";
import { Row, Col, Card, CardBody, Label, FormGroup } from "reactstrap";
import Dropzone from "react-dropzone";

// Breadcrumb

import { Link } from "react-router-dom";
import axios from "./../../services/axios";

class UploadFileHandler extends Component {
  constructor(props) {
    super(props);
    this.handleAcceptedFiles = this.handleAcceptedFiles.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.loadFiles = this.loadFiles.bind(this);
    this.state = {
      selectedFiles: [],
      filesDescriprion: new Map(),
      processing: false,
      file: "",
    };
  }
  
  async deleteFile(file){
    if(file.length != 0){
      await axios
      .post("/api/file/delete", {file: file}
      )
      .then((result) => {
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
    } else {
      return false;
    }
  }
  async loadFiles(file) {
    let formData = new FormData();
    this.setState({ processing: true });
    if(this.state.file != ""){
    }
    formData.append("file", file);
    
    const c = await axios
      .post("/app/upload.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        if(result.data.result){
          this.setState({file: result.data.result_data});
          this.props.addedFile(result.data.result_data);
          setTimeout(this.setState({ processing: !this.state.processing }),1000)
          return true;
        } else {
          setTimeout(this.setState({ processing: !this.state.processing }),1000)
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
  handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: this.formatBytes(file.size),
      })
    );

    files.forEach((f) => {
      const resp = this.loadFiles(f);
    });

    this.setState({ selectedFiles: files });
  };

  /**
   * Formats the size
   */
  formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  render() {
    return (
      <React.Fragment>
        <Label className="col-md-12 col-form-label mt-2">Upload File</Label>

        <Card>
          <FormGroup>
            <CardBody>
              {this.state.processing === true && <>
                <div className="SPINNER">
              <div role="status" class="mr-2 spinner-border text-primary"><span class="sr-only">Loading...</span></div>
              </div>
              </>}
              <Dropzone
                onDrop={(acceptedFiles) =>
                  this.handleAcceptedFiles(acceptedFiles)
                }
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone">
                    <div
                      className="dz-message needsclick mt-2"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <div className="mb-3">
                        <i className="display-4 text-muted ri-upload-cloud-2-line"></i>
                      </div>
                      <h4>Drop files here or click to upload.</h4>
                    </div>
                  </div>
                )}
              </Dropzone>
              <div className="dropzone-previews mt-3" id="file-previews">
                {this.state.selectedFiles.map((f, i) => {
                  return (
                    <Card
                      className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                      key={i + "-file"}
                    >
                      <div className="p-2">
                        <Row className="align-items-center">
                          <Col>
                            <Link
                              to="#"
                              className="text-muted font-weight-bold"
                            >
                              {f.name}
                            </Link>
                            <p className="mb-0">
                              <strong>{f.formattedSize}</strong>
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardBody>
          </FormGroup>
        </Card>
      </React.Fragment>
    );
  }
}

export default UploadFileHandler;
