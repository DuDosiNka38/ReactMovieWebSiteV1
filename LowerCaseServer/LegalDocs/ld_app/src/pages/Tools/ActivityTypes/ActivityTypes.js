import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader, Container, Table } from "reactstrap";
import EventsApi from "../../../api/EventsApi";
import PageHeader from "../../../components/PageHader/PageHeader";
import { connect } from "react-redux";
import * as ModalActions from "../../../store/modal/actions";

class ActivityTypes extends Component {
  state = {
    ActivityTypes: [],

    isInit: false,
  };

  loadActivityTypes = async () => {
    const ActivityTypes = await EventsApi.fetchActivityTypes();
    this.setState({ActivityTypes});
  }

  addActivityType = async () => {
    const { showModal } = this.props;

    showModal("ADD_ACTIVITY_TYPE", {
      onSubmit: async () => {
        await this.loadActivityTypes();
      }
    })
  }

  editActivityTypeRequirements = async (Activity_type) => {
    const { showModal } = this.props;
    const { ActivityTypes } = this.state;

    const forEdit = ActivityTypes.find((x) => x.Activity_type === Activity_type);

    showModal("ACTIVITY_TYPE_REQUIREMENTS", {
      ...forEdit,
      ActivityTypes,
      onSubmit: async () => {
        await this.loadActivityTypes();
      },
      loadActivityTypes: this.loadActivityTypes
    })
  }

  editActivityType = async (Activity_type) => {
    const { showModal } = this.props;
    const { ActivityTypes } = this.state;

    const forEdit = ActivityTypes.find((x) => x.Activity_type === Activity_type);

    showModal("EDIT_ACTIVITY_TYPE", {
      ...forEdit,
      onSubmit: async () => {
        await this.loadActivityTypes();
      }
    })
  }

  deleteActivityType = async (Activity_type) => {
    const { showModal } = this.props;

    showModal("DELETE_ACTIVITY_TYPE", {
      Activity_type,
      onSubmit: async () => {
        const response = await EventsApi.deleteActivityType(Activity_type);
        this.loadActivityTypes();
      }
    })
  }

  async componentDidMount() {
    await this.loadActivityTypes();

    this.setState({isInit: true})
  }

  render() {
    const { isInit, ActivityTypes } = this.state;

    return (
      <>
        <div className="page-content">
          <Container fluid className="pageWithSearchTable">
            <PageHeader>Activity Types</PageHeader>
            <Card className="documents-block">
              <CardHeader>
                <div className="d-flex align-items-center justify-content-between">
                  {/* <h4 className="h4">Synchronization Schedule</h4> */}
                  <div className="d-flex align-items-center justify-content-between">
                    <Button
                      className="d-flex align-items-center ld-button-warning text-uppercase ml-2"
                      onClick={this.addActivityType}
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
                      <td>Activity Type</td>
                      <td>Description</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {ActivityTypes.map((at) => (
                      <>
                        <tr>
                          <td>{at.Activity_type}</td>
                          <td>{at.Description}</td>
                          <td style={{ textAlign: "center", width: "120px" }}>
                            <div className="d-flex align-items-center justify-content-between">
                            <i class="ri-links-line cursor-pointer mr-2"  title="Edit Activity Requirements" onClick={() => this.editActivityTypeRequirements(at.Activity_type)}> AR </i>
                            <i className="ri-settings-5-line cursor-pointer mr-2" title="Edit Activity Type"
                              onClick={() => this.editActivityType(at.Activity_type)}></i>
                            <i
                              class="ri-close-line cursor-pointer"
                              title="Remove Activity Type"
                              onClick={() => this.deleteActivityType(at.Activity_type)}
                            ></i>
                          </div>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityTypes);
