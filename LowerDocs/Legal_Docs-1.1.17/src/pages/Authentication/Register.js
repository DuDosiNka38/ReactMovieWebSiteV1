import React, { Component } from "react";
import { Row, Col, Button, Container, Card, CardBody, Label } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import caseRoles from "./../../components/Cases/caseroles.json";
import Checkbox from "./../../components/Checkboxes/Checkbox";
import RegisterForm from "./RegisterForm";
import { AvForm } from "availity-reactstrap-validation";
import axios from "./../../services/axios";
import noteWindow from "./../../services/notifications";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import SelectGlobalRole from "../../components/UserComponents/SelectGlobalRole";
import PRIVILEGE from "../../services/privileges";

// import { connect } from "react-redux";
// import SingleDropdown from "../../components/Cases/CaseRoles/SingleDropdown"
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_role: null,
      selectedOptions: [],
      cases: new Map(),
      breadcrumbItems: [
        { title: "Legal Docs", link: "/general" },
        { title: "Add new user", link: "#" },
      ],
    };
    this.registerNewUser = this.registerNewUser.bind(this);
    this.prepareCheckboxGroup = this.prepareCheckboxGroup.bind(this);
  }

  onChange = (el) => {
    this.setState({ user_role: el.value });
  };

  multiselect = (cName, selectedOptions) => {
    const c = this.state.cases;
    let multiValue = selectedOptions.map(({ value }) => value);
    c[cName]["privileges"] = multiValue;
    this.setState({ cases: c });
  };

  prepareCheckboxGroup() {
    let selectCase = new Map();
    selectCase = this.state.cases;
    this.props.cases.map(
      ({  Case_Short_NAME, }) =>
        (selectCase[Case_Short_NAME] = { checked: false, privileges: null })
    );
    this.setState({ cases: selectCase });
  }
  componentDidMount() {
    setTimeout(this.prepareCheckboxGroup, 0);
  }
  

  async registerNewUser(event, user) {
    const response = await axios.post("/api/user/add", {
      user_email: user.user_email,
      user_name: user.user_name,
      user_password: user.user_password,
      person_id: user.person_id,
      user_role: this.state.user_role,
      cases: this.state.cases,
    });
    if (response.data.result) {
      noteWindow.isSuck("User registration done");
      this.props.onGlobalLoad();
      this.myFormRef.reset();
      this.props.history.push("/usersmanagement");
    } else if (response.data.result_data.hasOwnProperty("result_error_text")) {
      noteWindow.isError(response.data.result_data.result_error_text);
    } else {
    }
  }

  render() {
    if(this.props.personeData === undefined)
        return (<></>);

    const pData = this.props.personeData;

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title="Add new user"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
<h5 className="mb-3">Add new user</h5>

            <Row className="no-gutters">
              <AvForm
                onValidSubmit={this.registerNewUser}
                className="form-horizontal row w-100"
                ref={(el) => (this.myFormRef = el)}
              >
                <RegisterForm registerNewUser={this.registerNewUser} />
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <Label htmlFor="useremail">User Role</Label>

                      <SelectGlobalRole
                        roles={this.props.userRoles.filter((x) => x.Case_NAME == "SYSTEM" && x.Person_id == "SYSTEM")}
                        onChange={this.onChange}
                      />
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={12}>
                  <h3>Select Cases</h3>
                  {PRIVILEGE.check("SHOW_CASES", pData) ? 
                    <>
                      <Card>
                        <CardBody>

                        <Row>

                        {this.props.cases.map(
                            ({
                              Case_id,
                              Case_Full_NAME,
                              Case_Short_NAME,
                              Case_Number,
                            }) => (
                              <Col lg={4} key={Case_id} className="cShbx">
                                <Checkbox
                                  key={Case_id}
                                  id={Case_Short_NAME}
                                  caseName={Case_Full_NAME}
                                  cases={this.state.cases}
                                  roles={this.state.caseroles}
                                  rolesList={caseRoles}
                                  selectRoles={this.state.caseroles}
                                  multiselect={this.multiselect}
                                />
                              </Col>
                            )
                          )}
                        </Row>
                        </CardBody>
                      </Card>
                    </>
                    :
                    <>
                      <Card>
                        <CardBody>
                          <h5>You don't have access!</h5>
                        </CardBody>
                      </Card>
                    </>
                  }
                </Col>
                <Col lg ={12}>
                <Button
                          color="primary"
                          className="w-md waves-effect waves-light  w-100"
                          type="submit"
                        >
                          {this.props.loading ? "Loading ..." : "Register"}
                        </Button>
                </Col>
            
              </AvForm>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    userRoles: state.User.User_Roles,
    personeData: state.User.persone,
  };
};
const mapDispatchToProps = (dispatch) => ({
  onCaseLoad: () => dispatch(actions.getCase()),
  onUserRolesLoad: () => dispatch(actions.getUserRole()),
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Register);
