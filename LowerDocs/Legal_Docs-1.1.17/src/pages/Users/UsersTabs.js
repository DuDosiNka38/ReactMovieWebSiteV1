import React, { Component } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavLink,
  Button
  // NavLink
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import classnames from "classnames";
import PRIVILEGE from "../../services/privileges";
import { connect } from "react-redux";
import {Link} from 'react-router-dom'
const { SearchBar, ClearSearchButton } = Search;


class UsersTabs extends Component {
  state = {
    customActiveTab: "1",
    setted: false
  };
  toggleCustom(tab) {
    if (this.state.customActiveTab !== tab) {
      this.setState({
        customActiveTab: tab,
      });
    }
  }

  // setData(){
  //   console.log(this.props);
  //   if(this.props.userData !== undefined && this.props.staffData !== undefined && !this.state.setted){
  //     this.props.userData.push({
  //       dataField: "uName",
  //       text: "Setting",
  //       formatter: this.props.formatter,
  //     })
  //     this.props.staffData.push({
  //       dataField: "uName",
  //       text: "Setting",
  //       formatter: this.props.formatter,
  //     })
  //     setTimeout(() => {this.setState({setted: true})}, 10);
  //   } else {
  //     setTimeout(this.setData, 500);
  //   }

    
  // }

//WARNING! To be deprecated in React v17. Use componentDidMount instead.
// componentWillMount() {
//   this.setData();
  
// }
  render() {
    // this.setData();
    const pData = this.props.personeData;

    
    const columns = [
      {
        dataField: "Person_id",
        text: "Person",
      },
      {
        dataField: "NAME",
        text: "Name",
      },
      {
        dataField: "Email_address",
        text: "Court",
      },
      {
        dataField: "Phone_number",
        text: "Phone",
      },
      {
        dataField: "User_Role_Name",
        text: "User Role",
      },
      {
        dataField: "uName",
        text: "Setting",
        formatter: this.props.formatter,
      },
    ];

    const sizePerPageRenderer = ({
      options,
      currSizePerPage,
      onSizePerPageChange,
    }) => (
      <div className="btn-group" role="group">
        {options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelect ? "btn-secondary" : "btn-light"}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    );

    const pagination = {
      sizePerPageRenderer,
    };


    const columnsStaff = [
      {
        dataField: "Person_id",
        text: "Person",
      },
      {
        dataField: "NAME",
        text: "Name",
      },
      {
        dataField: "Email_address",
        text: "Court",
      },
      {
        dataField: "Phone_number",
        text: "Phone",
      },
      {
        dataField: "User_Role_Name",
        text: "User Role",
      },
      {
        dataField: "uName",
        text: "Setting",
        formatter: this.props.formatter,
      },
    ];
    // console.log(this.props.staff.length);
    return (
      <>
        <Col lg={12}>
          <Card>
            <CardBody>
             
              <Row>
                <Col md={1}>
                  <Nav
                    pills
                    className="flex-column"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <NavLink
                      id="v-pills-home-tab"
                      style={{ cursor: "pointer" }}
                      className={classnames(
                        {
                          active: this.state.customActiveTab === "1",
                        },
                        "mb-2"
                      )}
                      onClick={() => {
                        this.toggleCustom("1");
                      }}
                      aria-controls="v-pills-home"
                      aria-selected="true"
                    >
                          Users
                    </NavLink>
                    <NavLink
                      id="v-pills-profile-tab"
                      style={{ cursor: "pointer" }}
                      className={classnames(
                        {
                          active: this.state.customActiveTab === "2",
                        },
                        "mb-2"
                      )}
                      onClick={() => {
                        this.toggleCustom("2");
                      }}
                      aria-controls="v-pills-home"
                      aria-selected="true"
                    >
                  
                      Personnel
                    </NavLink>
                   
                  </Nav>
                </Col>
                <Col md={11}>
                {PRIVILEGE.check("ADD_USER", pData) && (
                      <>
                       <div className="d-flex align-items-center justify-content-end pb-3">

                       <Link to="/register">
                              <Button
                                className="w-100 m-0"
                                color="success"
                                className="d-flex align-items-center w-100 justify-content-center"
                                type="button"
                              >
                                <i className="ri-add-fill"></i>
                                Add New User
                              </Button>
                            </Link>
                       </div>
                       
                      </>
                    )}
                  <TabContent
                    activeTab={this.state.customActiveTab}
                    className="text-muted mt-4 mt-md-0"
                    id="v-pills-tabContent"
                  >
                    <TabPane
                      tabId="1"
                      role="tabpanel"
                      aria-labelledby="v-pills-home-tab"
                    >
                     
                      <div className="some-table">

                      <ToolkitProvider
                            bootstrap4
                            keyField="Person_id"

                            data={this.props.staff}
                            columns={columnsStaff}
                            cellEdit={cellEditFactory({ mode: "click" })}
                            search
                          >
                            {(props) => (
                              <div>
                                <Row className="d-flex align-items-center justify-content-between">
                                  <Col lg="11">
                                    <SearchBar
                                      className="mb-3"
                                      onChang={this.handleChange}
                                      {...props.searchProps}
                                      style={{ width: "400px", height: "40px" }}
                                    />
                                  </Col>

                                  <Col
                                    lg={1}
                                    className="d-flex justify-content-end mb-4"
                                  >
                                    <ClearSearchButton
                                      {...props.searchProps}
                                      className="btn btn-info"
                                    />
                                  </Col>
                                </Row>
                                <div className="">
                                  <BootstrapTable
                                    {...props.baseProps}
                                    filter={filterFactory()}
                                    noDataIndication="There is no solution"
                                    pagination={this.props.staff.length > 10 && paginationFactory(pagination) }
                                    striped
                                    hover
                                    condensed
                                    className="striped"
                                  />
                                </div>
                              </div>
                            )}
                          </ToolkitProvider>
               
                       
                      </div>
                    </TabPane>
                    <TabPane
                      tabId="2"
                      role="tabpanel"
                      aria-labelledby="v-pills-profile-tab"
                    >
                     <div className="some-table">
                      
                               <ToolkitProvider
                            bootstrap4
                            keyField="Person_id"
                            data={this.props.users}
                            columns={columns}
                            // columns={columnsStaff}
                            cellEdit={cellEditFactory({ mode: "click" })}
                            search
                          >
                            {(props) => (
                              <div>
                                <Row className="d-flex align-items-center justify-content-between">
                                  <Col lg="11">
                                    <SearchBar
                                      className="mb-3"
                                      onChang={this.handleChange}
                                      {...props.searchProps}
                                      style={{ width: "400px", height: "40px" }}
                                    />
                                  </Col>

                                  <Col
                                    lg={1}
                                    className="d-flex justify-content-end mb-4"
                                  >
                                    <ClearSearchButton
                                      {...props.searchProps}
                                      className="btn btn-info"
                                    />
                                  </Col>
                                </Row>
                                <div className="">
                                  <BootstrapTable
                                    {...props.baseProps}
                                    filter={filterFactory()}
                                    noDataIndication="There is no solution"
                                    pagination={this.props.staff.length > 10 && paginationFactory(pagination) }
                                    striped
                                    hover
                                    condensed
                                    className="striped"
                                  />
                                </div>
                              </div>
                            )}
                          </ToolkitProvider>
                      </div>

                    </TabPane>
                  
                  </TabContent>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allUserData: state.User.allUserData,
    personeData: state.User.persone,
    staff: state.User.staff,
    uRoles: state.User.User_Roles,
  };
};
// const mapDispatchToProps = (dispatch) => ({
//   onAllUsersLoad: () => dispatch(actions.getAllUserData()),
//   onStaffLoad: () => dispatch(actions.getStf()),
//   onGlobalLoad: () => dispatch(actions.getGlobalData()),
// });

export default connect(mapStateToProps, null)(UsersTabs);
