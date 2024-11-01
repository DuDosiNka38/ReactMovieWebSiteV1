import React, { Component, Suspense, lazy } from "react";
import PageHeader from "./../../../components/PageHader/PageHeader";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  CardHeader,
  Label,
  FormGroup,
  Input,
} from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../../store/modal/actions";
import * as PersonnelActions from "./../../../store/personnel/actions";
import TrotlingBlocks from "./../../../components/StyledComponents/TrotlingBlocks";

import UserTable from "./UsersTable";

class UserManagement extends Component {
  state = {
    Persones: [],
    toggleSwitch: false,
  };

  render() {
    return (
      <>
        <div className="page-content">
          <Container fluid className="pageWithSearchTable">
            <PageHeader>User Management</PageHeader>

            <Card className="documents-block">
              <CardHeader>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center userSwitch">
                    <Label
                      className={`mr-2 AccentFont ${
                        this.state.toggleSwitch === false && "labelAccent"
                      }`}
                    >
                      Users
                    </Label>
                    <div className="custom-control custom-switch mb-2 d-flex  ">
                      <Input
                        type="checkbox"
                        className="custom-control-input"
                        id="customSwitch1"
                      />
                      <Label
                        className={`custom-control-label AccentFont ${
                          this.state.toggleSwitch === true && "labelAccent"
                        }`}
                        htmlFor="customSwitch1"
                        onClick={(e) => {
                          this.setState({
                            toggleSwitch: !this.state.toggleSwitch,
                          });
                        }}
                      >
                        Case Partisipants
                      </Label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    {this.state.toggleSwitch === false &&( <>
                          <Button
                            onClick={() => this.props.showModal("NEW_USER", {onSuccess: this.props.fetchPersonnel})}
                            className="d-flex align-items-center text-center ld-button-warning"
                          >
                            <i className="ri-user-add-line font-size-14 mr-1  auti-custom-input-icon "></i>
                            Add User
                          </Button>
                        </>
                      )}
                    {this.state.toggleSwitch === true &&(
                        <>
                          <Button
                            onClick={() => this.props.showModal("CP_ADD_NEW_PERSON", {onSuccess: this.props.fetchPersonnel})}
                            className="d-flex align-items-center text-center ld-button-warning"
                          >
                            <i className="ri-user-add-line font-size-14 mr-1  auti-custom-input-icon "></i>
                            Add Case Partisipant
                          </Button>
                        </>
                      )}
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <Suspense fallback={<TrotlingBlocks TRtype="line" />}>
                  <UserTable
                    showPerson={this.state.toggleSwitch}
                  />
                </Suspense>
              </CardBody>
            </Card>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  modalType: state.Modal.type,
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  // fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),
  fetchPersonnel: () => dispatch(PersonnelActions.personnelFetchRequested()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
