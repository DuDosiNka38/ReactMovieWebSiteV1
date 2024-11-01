import React, { Component } from "react";
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
} from "reactstrap";
import PageHeader from "../../../components/PageHader/PageHeader";
import * as ModalActions from "./../../../store/modal/actions";
import * as CaseActions from "./../../../store/case/actions";
import { connect } from "react-redux";

class Departments extends Component {
  state = {};

  render() {
    const { departments } = this.props;    
	
    return (
      <>
        <div className="page-content">
          <Container fluid>
            <PageHeader>Departments</PageHeader>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardHeader className="d-flex justify-content-end align-items-center">
                    <Button
                      onClick={() => this.props.showModal("ADD_DEPARTMENT",)}
                      className="d-flex align-items-center text-center ld-button-warning"
                    >
                      <i className=" ri-add-line font-size-14 mr-1  auti-custom-input-icon "></i>
                      Add Department
                    </Button>
                  </CardHeader>
                  <CardBody className="p-0">
                    <Table className="customTable p-0 mb-0">
                      <thead>
                        <tr>
                          <td>Department Id</td>
                          <td>Department Name</td>
                          <td>Calendar Name</td>
                          <td>Court Name </td>
                          <td>Judge Name</td>
                          <td>Actions</td>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map((x) => (
                          <tr key={x.Department_id}>
                            <td>{x.Department_id}</td>
                            <td>{x.Department_Name}</td>
                            <td>{x.Calendar_name}</td>
                            <td>{x.Court_name}</td>
                            <td>{x.Judge_name}</td>

                            <td className="d-flex">
                              <span
                                className="flat-icon user-del font-size-20  d-flex justify-content-center align-items-center"
                                title="Edit"
																onClick={()=> this.props.showModal("UPDATE_DEPARTMENT", {DepartmentData: x})}

                              >
                                <i className="ri-settings-5-line"></i>
                              </span>
                              <span
                                className="flat-icon user-del font-size-20  d-flex justify-content-center align-items-center"
                                title="Delete"
																onClick={()=> this.props.showModal("DELETE_DEPARTMENT", {Department_id: x.Department_id, Department_Name: x.Department_Name})}
                              >
                                <i className="ri-close-line"></i>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
	departments: state.Case.departments,
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  requestDepartments: () => dispatch(CaseActions.departmentsFetchRequested()),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Departments);
