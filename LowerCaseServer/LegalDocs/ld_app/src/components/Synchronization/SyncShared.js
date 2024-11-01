import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button, Input, CardHeader, FormGroup, Label, Table } from "reactstrap";
import { connect } from "react-redux";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";
import DeleteSyncSharePersonModal from "../../modals/Sync/DeleteSyncSharePersonModal";
import AddSyncSharePersonModal from "../../modals/Sync/AddSyncSharePersonModal";

class SyncShared extends Component {
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
      this.props.fetchSyncShared(this.props.User.Person_id);
    }
  }

  render() {
    const { User, syncShared } = this.props;
    return (
      <>
        <Card className="documents-block">
          <CardHeader>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="h4">USERS WHO SHARED FILES TO ME</h4>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <Table className="customTable mb-0" attr-type="SHARE_PERSONS">
              <thead>
                <tr>
                  <td>Person identifier</td>
                  <td>Name</td>
                  <td>E-mail</td>
                  <td>Share date</td>
                </tr>
              </thead>
              <tbody>
                {syncShared.length > 0 ? (
                  syncShared.map((x, i) => (
                    <>
                      <tr attr-index={`SHARED_PERSONS_${i}`}>
                        <td>{x.Person_id}</td>
                        <td>{x.Share_person_NAME}</td>
                        <td>{x.Share_person_Email_address}</td>
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
  syncShared: state.Sync.Shared_Persons,
  syncShareLoading: state.Sync.loading,

  User: state.User.data,
  UserLoading: state.User.loading,
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  fetchSyncShared: (Person_id) => dispatch(SyncActions.syncSharedPersonsFetchRequested(Person_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncShared);
