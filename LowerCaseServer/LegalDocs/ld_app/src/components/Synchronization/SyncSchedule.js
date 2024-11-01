import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button, Input, CardHeader, FormGroup, Label, Table } from "reactstrap";
import { connect } from "react-redux";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";
import DeleteSyncSharePersonModal from "../../modals/Sync/DeleteSyncSharePersonModal";
import AddSyncScheduleRowModal from "../../modals/Sync/AddSyncScheduleRowModal";
import OKHButton from "../OKH_Components/OKHButton/OKHButton";

class SyncSchedule extends Component {
  state = {};

  DAYS = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
  ];

  componentDidMount = async () => {
    this.props.addModals([
      {
        type: "DELETE_SYNC_SHARE_PERSON",
        component: DeleteSyncSharePersonModal,
      },
      {
        type: "ADD_SYNC_SCHEDULE_ROW",
        component: AddSyncScheduleRowModal,
      },
    ]);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.User !== this.props.User && this.props.User.Person_id) {
      this.props.fetchSyncSchedule(this.props.User.Person_id);
    }
  }

  render() {
    const { User, syncSchedule } = this.props;
    return (
      <>
        <Card className="documents-block">
          <CardHeader>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="h4">Synchronization Schedule</h4>
              <div className="d-flex align-items-center justify-content-between">
                <Button
                  className="d-flex align-items-center ld-button-warning text-uppercase ml-2"
                  onClick={() => this.props.showModal("ADD_SYNC_SCHEDULE_ROW", {DAYS: this.DAYS})}
                >
                  <i className="ri-add-line mr-2"></i> New Record
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <Table className="customTable mb-0" attr-type="SYNC_DIRS">
              <thead>
                <tr>
                  <td></td>
                  <td>Computer id</td>
                  <td>Directory</td>
                  <td>Synchronization time</td>
                  <td>Synchronization days</td>
                </tr>
              </thead>
              <tbody>
                {syncSchedule.length > 0 ? (
                  syncSchedule.map((x, i) => (
                    <>
                      <tr attr-index={`SYNC_DIRS_${i}`}>
                        <td style={{ textAlign: "center" }}>
                          <i
                            class="ri-close-line removeSyncScheduleRow"
                            onClick={() => this.props.removeSyncSchedule(x.Row_id)}
                            title="Remove this directory from schedule"
                          ></i>
                          {/* <i
                            class="ri-edit-2-line editSyncScheduleRow"
                            title="Edit schedule row"
                            onClick={() => {
                              const editSyncScheduleRowData = Object.assign({}, syncSchedule[i]);
                              editSyncScheduleRowData.Sync_days = this.DAYS.filter((x) =>
                                JSON.parse(editSyncScheduleRowData.Sync_days).includes(x.value)
                              );
                              this.setState({ editSyncScheduleRowData });
                              this.switch_modal("EDIT_SHEDULE_ROW");
                            }}
                          ></i> */}
                        </td>
                        <td>{x.Computer_id}</td>
                        <td>{x.Directory_name}</td>
                        <td>{x.Sync_time}</td>
                        <td>
                          {JSON.parse(x.Sync_days !== null && x.Sync_days !== undefined ? x.Sync_days : [])
                            .map((x) => this.DAYS.find((y) => y.value === x).label)
                            .join(", ")}
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <>
                    <tr>
                      <td colSpan="5">Synchronization directories list is empty</td>
                    </tr>
                  </>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  modalType: state.Modal.type,

  User: state.User.data,
  UserLoading: state.User.loading,

  syncSchedule: state.Sync.syncSchedule
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  fetchSyncSchedule: (Person_id) => dispatch(SyncActions.syncScheduleFetchRequested(Person_id)),
  removeSyncSchedule: (Row_id) => dispatch(SyncActions.removeSyncScheduleRequested(Row_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncSchedule);
