import React, { Component } from "react";
import { Row, Col, Button, Container, Card, CardBody, Label } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import caseRoles from "./../../components/Cases/caseroles.json";
import Checkbox from "./../../components/Checkboxes/Checkbox";
import RegisterForm from "./../Authentication/RegisterForm";
import { AvForm } from "availity-reactstrap-validation";
import axios from "./../../services/axios";
import noteWindow from "./../../services/notifications";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import SelectGlobalRole from "../../components/UserComponents/SelectGlobalRole";
class UsersConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_role: null,
      selectedOptions: [],
      cases: new Map(),
      loaded: false,
      breadcrumbItems: [
        { title: "Legal Docs", link: "/general" },
        { title: "User Managment", link: "/general" },
        { title: "Settings", link: "#" },
      ],
    };
    this.editUser = this.editUser.bind(this);
    this.prepareCheckboxGroup = this.prepareCheckboxGroup.bind(this);
  }
  onChange = (el) => {
    this.setState({ user_role: el.value });
  };

  multiselect = (cName) => {
    // const c = this.state.cases;
    // // if(c[cName].checked){
    // // let multiValue = selectedOptions.map(({ value }) => value);
    // c[cName]["privileges"] = false;
    // this.setState({ cases: c });
    // console.log(this.state.cases);
    // // }
  };

  prepareCheckboxGroup() {
    let selectCase = new Map();
    selectCase = this.state.cases;
    const pCases = this.props.globalData.AllCases;

    this.props.cases.map((x) => 
      {
        let checked = false;
        let cs = pCases.find((c) => c.Case_Short_NAME === x.Case_Short_NAME);
        if(cs !== undefined && cs.Case_Participants.find((x) => x.Person_id === this.props.match.params.userId) !== undefined)
          checked = true;

        selectCase[x.Case_Short_NAME] = { checked: checked, privileges: null };
      }        
    );
    this.setState({ cases: selectCase });
    this.setState({loaded: true});
  }
  componentDidMount() {
    setTimeout(this.prepareCheckboxGroup, 0);
    this.props.onGlobaDataLoad()
  }

  // async registerNewUser(event, user) {
  //   const response = await axios.post("/api/user/add", {
  //     user_email: user.user_email,
  //     user_name: user.user_name,
  //     user_password: user.user_password,
  //     person_id: user.person_id,
  //     user_role: this.state.user_role,
  //     cases: this.state.cases,
  //   });
  //   if (response.data.result) {
  //     noteWindow.isSuck("User registration done");
  //     this.myFormRef.reset();
  //   } else if (response.data.result_data.hasOwnProperty("result_error_text")) {
  //     noteWindow.isError(response.data.result_data.result_error_text);
  //   } else {
  //   }
  // }


  async editUser(event, user) {
    const response = await axios.post("/api/user/edit", {
      user_email: user.user_email,
      user_name: user.user_name,
      user_password: user.user_password,
      person_id: user.person_id,
      user_role: this.state.user_role,
      cases: this.state.cases,
    });
    if (response.data.result) {
      noteWindow.isSuck("User information are restore");
      this.myFormRef.reset();
    } else if (response.data.result_data.hasOwnProperty("result_error_text")) {
      noteWindow.isError(response.data.result_data.result_error_text);
    } else {
    }
  }

  render() {
    // const { allUsers } = this.props;
    const UserID = this.props.match.params.userId;
    const users = this.props.allUsers.concat(this.props.staff);
    const thisUser = users.filter((x) => x.Person_id === UserID);

    if (thisUser.length === 0 || !this.state.loaded) return <></>;

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title={`User ${this.props.match.params.userId}`}
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
            <h5 className="mb-3">{`User ${this.props.match.params.userId}`}</h5>

            <Row className="no-gutters">
              <AvForm
                onValidSubmit={this.editUser}
                className="form-horizontal row w-100"
                ref={(el) => (this.myFormRef = el)}
              >
                <RegisterForm
                  registerNewUser={this.registerNewUser}
                  userId={thisUser[0].Person_id}
                  userMail={thisUser[0].Email_address}
                  userName={thisUser[0].NAME}
                  path = "config"
                  dis={true}
                />
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <Label htmlFor="useremail">User Role</Label>

                      <SelectGlobalRole
                        roles={this.props.userRoles.filter((x) => x.Case_NAME === "SYSTEM")}
                        onChange={this.onChange}
                        currentRole={thisUser[0].User_Role}
                      />
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={12}>
                  <h3>Select Cases</h3>

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
                                checked={this.state.cases[Case_Short_NAME].checked}
                              />
                            </Col>
                          )
                        )}
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={12}>
                  <Button
                    color="primary"
                    className="w-md waves-effect waves-light  w-100"
                    type="submit"
                  >
                    {this.props.loading ? "Loading ..." : "Update"}
                  </Button>
                </Col>
              </AvForm>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }onGlobaDataLOad
}

const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    userRoles: state.User.User_Roles,
    allUsers: state.User.allUserData,
    staff: state.User.staff,
    personeData: state.User.persone,
    globalData: state.User.globalData
  };
};
const mapDispatchToProps = (dispatch) => ({
  onCaseLoad: () => dispatch(actions.getCase()),
  onUserRolesLoad: () => dispatch(actions.getUserRole()),
  onGlobaDataLoad: () => dispatch(actions.getGlobalData())
});
export default connect(mapStateToProps, mapDispatchToProps)(UsersConfiguration);
