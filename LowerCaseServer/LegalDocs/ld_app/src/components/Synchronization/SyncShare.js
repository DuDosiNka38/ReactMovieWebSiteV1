import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button, Input, CardHeader, FormGroup, Label, Table } from "reactstrap";
import { connect } from "react-redux";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";
import DeleteSyncSharePersonModal from "../../modals/Sync/DeleteSyncSharePersonModal";
import AddSyncSharePersonModal from "../../modals/Sync/AddSyncSharePersonModal";

class SyncShare extends Component {
  state = {};

  componentDidMount = async () => {
    this.props.addModals([
      {
        type: "DELETE_SYNC_SHARE_PERSON",
        component: DeleteSyncSharePersonModal,
      },
      {
        type: "ADD_SYNC_SHARE_PERSON",
        component: AddSyncSharePersonModal,
      },
    ]);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.User !== this.props.User && this.props.User.Person_id) {
      this.props.fetchSyncShare(this.props.User.Person_id);
    }
  }

  render() {
    const { User, syncShare } = this.props;
    return (
      <>
        <Card className="documents-block">
          <CardHeader>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="h4">USERS WHO CAN MANAGE MY UPLOADED FILES</h4>
              <div className="d-flex align-items-center justify-content-between">
                <Button
                  className="d-flex align-items-center ld-button-warning text-uppercase ml-2"
                  onClick={() => this.props.showModal("ADD_SYNC_SHARE_PERSON")}
                >
                  <i className="ri-user-shared-line mr-2"></i> Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <Table className="customTable mb-0" attr-type="SHARE_PERSONS">
              <thead>
                <tr>
                  <td></td>
                  <td>Person identifier</td>
                  <td>Name</td>
                  <td>E-mail</td>
                  <td>Share date</td>
                </tr>
              </thead>
              <tbody>
                {syncShare.length > 0 ? (
                  syncShare.map((x, i) => (
                    <>
                      <tr attr-index={`SHARE_PERSONS_${i}`}>
                        <td>
                          <i
                            class="ri-close-line removeSyncScheduleRow"
                            onClick={() =>
                              this.props.showModal("DELETE_SYNC_SHARE_PERSON", {
                                Share_to_Person_id: x.Share_to_Person_id,
                              })
                            }
                            title="Remove this person from share"
                          ></i>
                        </td>
                        <td>{x.Share_to_Person_id}</td>
                        <td>{x.Share_to_NAME}</td>
                        <td>{x.Share_to_Email_address}</td>
                        <td>{x.Share_date}</td>
                      </tr>
                    </>
                  ))
                ) : (
                  <>
                    <tr>
                      <td colSpan="5">Persons list is empty</td>
                    </tr>
                  </>
                )}
              </tbody>
            </Table>
          </CardBody>
          {/* <PageFilters components={{ ...PageFilterComponents }} onSubmit={this.submitDocsFilter} /> */}
        </Card>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  modalType: state.Modal.type,
  syncShare: state.Sync.syncShare,
  syncShareLoading: state.Sync.loading,

  User: state.User.data,
  UserLoading: state.User.loading,
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  fetchSyncShare: (Person_id) => dispatch(SyncActions.syncShareFetchRequested(Person_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncShare);
