import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  ModalHeader,
  Modal,
  ModalBody,
  FormGroup,
  Label,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import CaseCard from "../../components/Cases/CaseCard";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import CasePersonalView from "../../components/CasePersonal/CasePersonalView";
import Select from "react-select";
import noteWindow from "../../services/notifications";
import axios from "./../../services/axios";
import PRIVILEGE from "../../services/privileges";

let sCase = [];

class CaseInfo extends Component {
  state = {
    partUsers: {},
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "All Cases", link: "/allcases" },
      { title: "Case ", link: "#" },
    ],
    refresh: false,
    modal: false,
    setCaseData: false,
  };
  updateCase = this.updateCase.bind(this);

  componentDidMount() {
    this.props.onCaseLoad();
  }
  switch_modal = (e) => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  getCaseFromArray(ar, el) {
    ar.forEach((e) => {
      if (e.Case_Short_NAME != undefined && e.Case_Short_NAME == el) {
        sCase = e;
      }
    });
    return sCase;
  }

  updateCase() {
    const cData = this.getCaseFromArray(
      this.props.cases,
      this.props.match.params.caseId
    );
    const result = axios
      .post("/api/case/update", {
        Case_Short_NAME: cData.Case_Short_NAME,
        Case_Full_NAME: this.state.Case_Full_NAME,
        DESCRIPTION: this.state.DESCRIPTION,
        Department_id: this.state.Department,
        Status: this.state.Status,
      })
      .then(function (response) {
        if (response.data.result) {
          noteWindow.isSuck("Case successfully updated!");
          return true;
        } else {
          noteWindow.isError(response.data.result_data.result_error_text);
          return false;
        }
      })
      .catch((response) => {
        noteWindow.isError(response);
        return false;
      });

    if (result) {
      setTimeout(this.props.onGlobalLoad(), 100);
    }

    setTimeout(this.setState({ modal: false }), 200);
  }

  onSelectChange = (el, e) => {
    this.setState({ [el.name]: el.value });
  };

  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };

  render() {
    const { calendars, cases, personeData, previliges} = this.props;  

    if(personeData == undefined || personeData.length == 0)
            return (<></>);

    const caseData = this.getCaseFromArray(
      this.props.cases,
      this.props.match.params.caseId
    );  

    if(caseData == undefined || caseData.length == 0 || previliges == undefined || previliges.length == 0)
      return (<></>);

    const pData = Object.assign({}, personeData);

    
    if(personeData.Person_id != "ROOT")
      pData.Privileges = pData.Privileges.filter((x) => previliges.single.find((y) => y.Privilege == x.Privilege && y.Priv_Type != "case") != undefined).concat(caseData.Case_Participants.find((x) => x.Person_id == personeData.Person_id).Privileges);

    if(!PRIVILEGE.check("SHOW_CASES", pData))
      return(
        <>
          <div className="page-content">
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <h2>You don't have permissions to see this page!</h2>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      );
      
    let CID = this.props.match.params.caseId;    
    let CasePersonal = this.props.cases
    .find((x) => x.Case_Short_NAME === CID).Case_Participants;


    const dept = this.props.departments.map((x) => ({
      name: "Department",
      value: x.Department_id,
      label: x.Department_Name,
    }));
    const statuses = this.props.cs.map((x) => ({
      name: "Status",
      value: x.Status,
      label: x.Status_Description,
    }));
    return (
      <>
        <div className="">
          <Container fluid>
            {/* <Breadcrumbs
              title={caseData.Case_Full_NAME + " INFORMATION"}
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
<h5 className="mb-3">{caseData.Case_Full_NAME + " INFORMATION"}</h5>

            <Row>
              <Col lg={12}>
                <CaseCard
                  CaseData={caseData}
                  CaseName={caseData.Case_Full_NAME}
                  Calendar_name={caseData.Calendar_name}
                  Case_Number={caseData.Case_Number}
                  Case_Short_NAME={caseData.Case_Short_NAME}
                  Case_Type={caseData.Case_Type}
                  Court_name={caseData.Court_name}
                  DESCRIPTION={caseData.DESCRIPTION}
                  Department_Name={caseData.Department_Name}
                  Case_Type_Description={caseData.Case_Type_Description}
                  Judge_name={caseData.Judge_name}
                  Status={caseData.Status}
                  switch_modal={this.switch_modal}
                  isUserCanEdit={PRIVILEGE.check("EDIT_CASE", pData)}
                  
                />
              </Col>
              {PRIVILEGE.check("SHOW_CASE_PERSONNEL", pData) && 
                <>
                  <Col lg={12}>
                    <CasePersonalView
                      CID={CID}
                      CasePersonal={CasePersonal}
                      refresh={this.state.refresh}
                      userCan={{edit: PRIVILEGE.check("EDIT_CASE_PERSONNEL", pData), add: PRIVILEGE.check("ADD_CASE_PERSONNEL", pData), delete: PRIVILEGE.check("DELETE_CASE_PERSONNEL", pData)}}
                    />
                  </Col>
                </>
              }

              <Modal
                isOpen={this.state.modal}
                switch={this.switch_modal}
                centered={true}
                size="xl"
              >
                <>
                  <ModalHeader
                    toggle={() => this.setState({ modal: false })}
                    className="text-center"
                  >
                    Edit Case
                  </ModalHeader>
                  <ModalBody toggle={() => this.setState({ modal: false })}>
                    <AvForm onValidSubmit={this.updateCase}>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="auth-form-group-custom mb-4">
                            <i className=" ri-hashtag auti-custom-input-icon"></i>
                            <Label htmlFor="username">Case Full Name:</Label>
                            <AvField
                              name="Case_Full_NAME"
                              value={sCase.Case_Full_NAME}
                              type="text"
                              className="form-control"
                              id="Case_Full_Name"
                              onChange={this.handleChange}
                              validate={{
                                required: {
                                  value: true,
                                  errorMessage: "Please enter case name",
                                },
                              }}
                              placeholder="Event Name"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={12}>
                          <FormGroup className="mb-4 mt-2">
                            <Label htmlFor="billing-address">Description</Label>
                            <AvField
                              className="form-control custom-textarea"
                              id="billing-address"
                              // rows="3"
                              type="textarea"
                              name="DESCRIPTION"
                              value={sCase.DESCRIPTION}
                              placeholder="Enter Comments"
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={6} className="mb-3">
                          <Label htmlFor="">Department</Label>
                          <Select
                            // attr-case-name={this.props.caseName}
                            options={dept}
                            // defaultValue = {options[0]}
                            className="basic-multi-select"
                            name="Department"
                            classNamePrefix="select"
                            onChange={this.onSelectChange}
                            defaultValue={dept.find(
                              (x) => x.value == caseData.Department_id
                            )}
                          />
                        </Col>
                        <Col lg={6} className="mb-3">
                          <Label htmlFor="">Status</Label>
                          <Select
                            // attr-case-name={this.props.caseName}
                            options={statuses}
                            // defaultValue = {options[0]}
                            className="basic-multi-select"
                            name="Department"
                            classNamePrefix="select"
                            onChange={this.onSelectChange}
                            defaultValue={statuses.find(
                              (x) => x.value == caseData.Status
                            )}
                          />
                        </Col>
                      </Row>
                      <Button color="primary" className="w-100" type="submit">
                        Update Case
                      </Button>
                    </AvForm>
                  </ModalBody>
                </>
              </Modal>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    departments: state.User.depatmentsData.departments,
    cs: state.User.CaseStatuses,
    personeData: state.User.persone,
    previliges: state.User.previliges,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onCaseLoad: () => dispatch(actions.getCase()),
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseInfo);
