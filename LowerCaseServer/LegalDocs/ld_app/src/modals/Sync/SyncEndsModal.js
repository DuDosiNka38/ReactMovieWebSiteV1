import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import Icon from "react-icofont"



import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";
import { convertBytesToNormal } from "../../services/Functions";
class SyncEndsModal extends Component {
  state = {
  };

  // componentDidMount() {
  //   this.setState({...this.props.state});
  //   setTimeout(() => console.log(this.state), 1000);
  // }

  componentWillUnmount() {
    const { onClose } = this.props;

    if(onClose && typeof onClose === "function")
      onClose();
  }

  render() {
    const {Total_New_Files,Total_Scanned_Folders, Scanned_Folders, Total_Scanned_Files,Total_Uploaded_Files, Total_Scanned_Files_Size, Total_New_Files_Size} = this.props.state
    const { ModalProps } = this.props;
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="xl" {...ModalProps}>
          <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
            Synchronization successfully finished
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal p-0" style={{background: "#009688"}}>
          <div className="sync-info-blocks">
          <div className="sync-info-block " data-tip data-for="info">
                <div className="block-icon">
                  <Icon icon = "icofont-search-folder"></Icon>
                </div>
                <div className="block-info "   >
                  <div className="title d-flex justify-content-between">Scanned Folders</div>
                  <div className="value">{Total_Scanned_Folders}</div>
                  <ReactTooltip id="info" aria-haspopup="true" role="info">
                   <div className="d-flex flex-column align-items-start justify-content-center">
                    {Scanned_Folders.map((x)=> (
                        <div>{x} </div>
                    ))}
                  </div>
                </ReactTooltip>
                </div>
      
          
              </div>
              <div className="sync-info-block">
                <div className="block-icon">
                 <Icon icon = "icofont-files-stack"></Icon>
                </div>
                <div className="block-info">
                  <div className="title d-flex justify-content-between">Scanned Files</div>
                  <div className="value">{Total_Scanned_Files}</div>
                </div>
              </div>
              <div className="sync-info-block">
                <div className="block-icon">
                  <Icon icon="icofont-search-document"/>
                </div>
                <div className="block-info">
                  <div className="title">New Files Found</div>
                  <div className="value">{Total_New_Files}</div>
                </div>
              </div>
          
              <div className="sync-info-block">
                <div className="block-icon">
                <Icon icon="icofont-upload  "/>

                </div>
                <div className="block-info">
                  <div className="title">Uploaded Files</div>
                  <div className="value">{Total_Uploaded_Files}</div>
                </div>
              </div>
              <div className="sync-info-block">
                <div className="block-icon">
                  <i className="ri-qr-scan-fill"></i>
                </div>
                <div className="block-info">
                  <div className="title d-flex justify-content-between"> Scanned Files Size</div>
                  <div className="value">{convertBytesToNormal(Total_Scanned_Files_Size)}</div>
                </div>
              </div>
              <div className="sync-info-block">
                <div className="block-icon">
                  <i className=" ri-upload-cloud-fill"></i>
                </div>
                <div className="block-info">
                  <div className="title d-flex justify-content-between">Uploaded Files Size</div>
                  <div className="value">{convertBytesToNormal(Total_New_Files_Size)}</div>
                </div>
              </div>
              
            </div>
          </ModalBody>
          <ModalFooter className="p-0 m-0 border-0">
            <Button className="ld-button-success scan-modal-button w-100 m-0 nbr color-white" type="submit" onClick={() => this.props.hideModal(this.props.type)}>
            OK
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  AuthHash: state.Main.auth_hash,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  removeSyncSharePerson: (Share_to_Person_id) =>
    dispatch(SyncActions.removeSyncSharePersonRequested(Share_to_Person_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncEndsModal);
