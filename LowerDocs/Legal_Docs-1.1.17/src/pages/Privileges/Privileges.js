import React, { Component } from "react";
import { Container, Card, CardBody, Row, Col, Button, Table } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import noteWindow from "../../services/notifications";
import axios from "./../../services/axios";
import SlideToggle from "react-slide-toggle";


class Priviliges extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "Priviliges", link: "#" },
    ],
    rolePriv: {},
    isLoad: false,
    counter: 0,
    selectedRole: null,
    toggleEvent: 0,
    isTogled: false,
  };

  setSelectedPrivileges = this.setSelectedPrivileges.bind(this);
  onSelectChange = this.onSelectChange.bind(this);
  onChangeRolePrivilege = this.onChangeRolePrivilege.bind(this);
  getSelectedRolePrivileges = this.getSelectedRolePrivileges.bind(this);
  updatePrivileges = this.updatePrivileges.bind(this);

  componentDidMount() {
    this.props.onRoleLoada();
    this.setSelectedPrivileges();
    this.setState({ toggleEvent: Date.now() });

  }

  onToggle = () => {
    this.setState({ toggleEvent: Date.now() , isTogled: !this.state.isTogled});
  };
  getSelectedRolePrivileges() {
    if (this.state.selectedRole == null) {
      return false;
    } else {
      return this.state.rolePriv[this.state.selectedRole];
    }
  }

  setSelectedPrivileges() {
    if (!this.state.isLoad && this.state.counter < 100) {
      const {  rolePreviliges } = this.props;
      if (rolePreviliges != undefined && rolePreviliges.length != 0) {
        let p = {};
        for (let k in rolePreviliges) {
          if (rolePreviliges[k].hasOwnProperty("single")) {
            p[k] = rolePreviliges[k].single.filter((x) => x.Show_to_user === "Y").map((x) => {
              return {
                name: "RP",
                label: x.DESCRIPTION,
                value: x.Privilege,
              };
            });
          } else {
            p[k] = null;
          }
        }
        this.setState({ rolePriv: p });
        this.setState({ isLoad: true });
      } else {
        this.setState({ counter: this.state.counter + 1 });
        setTimeout(this.setSelectedPrivileges, 300);
      }
    }
  }

  onSelectChange(e, el) {
    setTimeout(this.setState({ selectedRole: e.value }), 1);
  }

  onChangeRolePrivilege(e, el) {
    if (this.state.selectedRole == null) {
      noteWindow.isError("Select Role at first!");
    } else {
      let rp = this.state.rolePriv;
      rp[this.state.selectedRole] = e;
      this.setState({ rolePriv: rp });
    }
  }

  async updatePrivileges() {
    const result = await axios
      .post(
        "/api/privilege/updateRolePrivilege",
        this.state.rolePriv
      )
      .then(function (response) {
        if (response.data.result) {
          noteWindow.isSuck("Data successfully saved!");
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
      this.props.onGlobalLoad();
    }
  }

  render() {
    const { roles, previliges } = this.props;

    if (!this.state.isLoad) return <></>;

    const roleOpt = roles.filter((x) => x.Case_NAME === "SYSTEM").map((x) => ({
      name: "role",
      value: x.Role+"|"+x.Role_id,
      label: x.DESCRIPTION,
    }));

    const rolePrev = previliges.single.filter((x) => x.Show_to_user === "Y").map((x) => (
      {
        name: "RP",
        value: x.Privilege,
        label: x.DESCRIPTION,
      }
    ));



    return (
      <>
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title="Priviliges"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
            <h5 className="mb-3">Priviliges</h5>

            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <div>
                      <p>Role</p>
                      <Select
                        attr-case-name={this.props.caseName}
                        options={roleOpt}
                        className="basic-multi-select"
                        name="Role"
                        // isMulti={true}
                        closeMenuOnSelect={true}
                        classNamePrefix="select"
                        onChange={this.onSelectChange}
                      />
                    </div>
                    <hr />
                    <div>
                      <p>Role Privileges</p>
                      <Select
                        attr-case-name={this.props.caseName}
                        options={rolePrev}
                        closeMenuOnSelect={false}
                        value={this.getSelectedRolePrivileges()}
                        className="basic-multi-select"
                        name="Role"
                        isMulti={true}
                        classNamePrefix="select"
                        onChange={this.onChangeRolePrivilege}
                      />
                    </div>
                    <hr />
                    <div>
                      <Button
                        color="success"
                        attr-action="edit"
                        onClick={this.updatePrivileges}
                        className="d-flex align-items-center mr-3"
                      >
                        <i className=" ri-save-3-fill font-size-16 mr-1  auti-custom-input-icon "></i>{" "}
                        Save
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={12}>
              <Card>
                <CardBody>
                <div>

                  
        <Button className="toggle" color= "info" onClick={this.onToggle} className="mb-2">
          {this.state.isTogled === false ? "Show Previliges Table" : "Hide Previliges Table"}
        </Button>
        <SlideToggle toggleEvent={this.state.toggleEvent} collapsed>
          {({ setCollapsibleElement }) => (
            <div className="my-collapsible">
              <div
                className="my-collapsible__content"
                ref={setCollapsibleElement}
              >
                <div className="my-collapsible__content-inner">
                <div className="">
                <Table className = "meta-table table-bordered striped table-sm">
                <thead>
                        <tr>
                          <td>Privilege</td>
                          <td>Privilege Name</td>
                          <td>DESCRIPTION</td>
                          <td>Privilege Type</td>
                        </tr>
                      </thead>
                      {/* <hr></hr> */}
                      <tbody>
                  {previliges.single.map((x) => (
                    <>
                      {x.Show_to_user === "Y" && 
                        <>
                          <tr>
                            <td>{x.Privilege}</td>
                            <td>{x.Priv_name}</td>
                            <td>{x.DESCRIPTION}</td>
                            <td>{x.Priv_Type}</td>
                          </tr> 
                        </>
                      }                     
                    </>
                  ))}
                  </tbody> 
                </Table>
                </div>
                </div>
              </div>
            </div>
          )}
        </SlideToggle>
      </div>
                
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
const mapStateToProps = (state) => {
  return {
    roles: state.User.User_Roles,
    previliges: state.User.previliges,
    rolePreviliges: state.User.role_previliges,
  };
};
const mapDispatchToProps = (dispatch) => ({
  onRoleLoada: () => dispatch(actions.getUserRole()),
  onPreviligesLoada: () => dispatch(actions.getPrevilige()),
  onRolePreviligesLoada: () => dispatch(actions.getRolePrvilige()),
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Priviliges);
