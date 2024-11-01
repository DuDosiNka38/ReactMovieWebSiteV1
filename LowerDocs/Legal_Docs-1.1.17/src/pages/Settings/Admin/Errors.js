import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Col, Row, Input,
} from "reactstrap";
import code_e from "./code.json";
import {AvForm, AvField} from 'availity-reactstrap-validation'
import * as actions from "../../../store/user/actions";
import axios from "./../../../services/axios";
import { connect } from "react-redux";
import noteWindow from "../../../services/notifications";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
const { SearchBar, ClearSearchButton } = Search;

class ErrorsSettings extends Component {
  state = {
    modal: false,
    Errors: [],
    isLoad: false,
    counter: 0,
    error_code: "",
    error_name: "",
    error_description: "",
  };
  switch_modal = this.switch_modal.bind(this);
  setData = this.setData.bind(this);
  updateErrors = this.updateErrors.bind(this);

  switch_modal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  setData(){
    if (!this.state.isLoad && this.state.counter < 100) {
      const {  Core } = this.props;
      if (Core.Errors != undefined) {        
        this.setState({ Errors: Core.Errors });
        this.setState({ isLoad: true });
      } else {
        this.setState({ counter: this.state.counter + 1 });
        setTimeout(this.setData, 300);
      }
    }
  }

  addNewError(){
    const { Errors, error_code, error_name, error_description } = this.state;

    if(error_code === null || error_name === null || error_description === null)
      return false;
    if(!error_code.length || !error_name.length || !error_description.length)
      return false;
    
    Errors.push({
      error_code:error_code,
      error_name:error_name.trim().replace(" ", "_").toUpperCase(),
      error_description:error_description
    });

    this.setState(
      {
        Errors: Errors,
        error_code: "",
        error_name: "",
        error_description: ""
      }
    );
  }

  removeError(ecode){
    const { Errors } = this.state;
    this.setState({Errors: Errors.filter((x) => x.error_code !== ecode)});
  }

  async updateErrors() {
    const { Errors } = this.state;

    const response = await axios.post(
      "/api/settings/setErrors",Errors);

    if (response.data.result) {
      noteWindow.isSuck("Errors data successfully updated!");
      this.props.onGlobalLoad();
      this.switch_modal();
    } else if (
      response.data.result_data.hasOwnProperty("result_error_text")
    ) {
      noteWindow.isError(response.data.result_data.result_error_text);
    }
  }

  handleChange = (e) => {
    const { name, value} = e.currentTarget;
    const eCode = e.currentTarget.getAttribute("attr-error-code");

    if(eCode === null)
      this.setState({ [name]: value });
    else{
      const { Errors } = this.state;
      this.setState(
        {
          Errors: Errors.map((x) => {
            if(x.error_code == eCode)
              x.error_description = value;

            return x;
          })
        }
      );

    }
  };

  componentDidMount() {
    this.setData();
  }

  addedInputToCell = (cell, row, rowIndex, formatExtraData) => {
    return (
      <>
        <Input type="text" name="error_description" attr-error-code={row.error_code} defaultValue={cell} onChange={this.handleChange}/>       
      </>
    );
  };

  addedBtnToCell = (cell, row, rowIndex, formatExtraData) => {
    return (
      <Button
          className=" btnToTable"
          type="button"
          color="danger"
          onClick={() => this.removeError(cell)}
          value={cell}
          attr-row-id={rowIndex}
          name="del"
        >
          <i className="ri-delete-bin-2-line iToTable"></i>
        </Button>
    );
  };
  render() {
    const { Errors } = this.state;
    const { pData } = this.props;
      
    if(pData == undefined)
      return (<></>);

    const columns = [
      {
        dataField: "error_code",
        text: " Error code",
        sort: true,
      },
      {
        dataField: "error_name",
        text: " File name",
        sort: true,
      },
      {
        dataField: "error_description",
        text: "Error Description",
        formatter: this.addedInputToCell,
        sort: true,
      },
      {
        dataField: "error_code",
        text: "Action",
        formatter: this.addedBtnToCell,
        sort: true,
      },
     
     
    ];
    return (
      <>
        <Button onClick={this.switch_modal} color="info" className="w-100">
          View
        </Button>

        <Modal
          size="xl"
          isOpen={this.state.modal}
          switch={this.switch_modal}
          centered={true}
        >
          <ModalHeader
            toggle={() => this.setState({ modal: false })}
            className="text-center"
          >
            Edit Errors Text
          </ModalHeader>
          <ModalBody toggle={() => this.setState({ modal: false })}>
            {pData.Person_id == "ROOT" && 
            <>
              <AvForm onSubmit={this.addNewError}>
                <FormGroup className="auth-form-group-custom mb-4">
                  <i className="ri-bank-line auti-custom-input-icon"></i>
                  <Label htmlFor="Department_id">Error code</Label>

                  <AvField
                    name="error_code"
                    value={this.state.error_code}
                    type="text"
                    className="form-control"
                    id="error_code"
                    onChange={this.handleChange}
                    validate={{ required: true }}
                    placeholder=""
                  />
                </FormGroup>
                <FormGroup className="auth-form-group-custom mb-4">
                  <i className="ri-bank-line auti-custom-input-icon"></i>
                  <Label htmlFor="username">Error name</Label>

                  <AvField
                    name="error_name"
                    value={this.state.error_name}
                    type="text"
                    className="form-control"
                    id="error_name"
                    onChange={this.handleChange}
                    placeholder=""
                  />
                </FormGroup>
                <FormGroup className="auth-form-group-custom mb-4">
                  <i className="ri-bank-line auti-custom-input-icon"></i>
                  <Label htmlFor="username">Error description</Label>

                  <AvField
                    name="error_description"
                    value={this.state.error_description}
                    type="text"
                    className="form-control"
                    id="error_description"
                    onChange={this.handleChange}
                    placeholder=""
                  />
                </FormGroup>
                
                <div className="mt-4 text-center">
                  <Button
                    color="primary"
                    className="w-md waves-effect waves-light w-50"
                    type="button"
                    onClick={() => this.addNewError()}
                  >
                    Add
                  </Button>
                </div>
              </AvForm>
            <hr/>
            </>
            }
            {/* <AvForm>
            {Errors.map((x)=> (
              <>
              <FormGroup className="auth-form-group-custom mb-4">
                <div>
                  <i className="auti-custom-input-icon font-size-14 e-code"  > e{x.error_code}</i>
                  <Label htmlFor="username">{x.error_name}</Label>
                  <AvField
                    name="error_description"
                    value={x.error_description}
                    type="text"
                    className="form-control"
                    id="error_description"
                    onChange={this.handleChange}
                    placeholder={x.error_description} 
                  />
                </div>
                <div>
                  <Button onClick={() => this.removeError(x.error_code)}>Remove</Button>
                </div>
                
              </FormGroup>
              <hr/>
              </>
            ))}
            </AvForm> */}
            <ToolkitProvider
              bootstrap4
              keyField="File_id"
              data={Errors}
              columns={columns}
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
                  <div className="some-table">
                    <BootstrapTable
                    className="custom-table"
                      {...props.baseProps}
                      filter={filterFactory()}
                      noDataIndication="There is no solution"
                      striped
                      hover
                      condensed
                    />
                  </div>
                </div>
              )}
            </ToolkitProvider>
          </ModalBody>
          <ModalFooter>
           
            <Button
              type="button"
              color="success"
              onClick={this.updateErrors}
            >
              Confirm 
            </Button>
            <Button type="button" color="danger" onClick={() => this.switch_modal()}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Core: state.User.globalData,
    pData: state.User.persone,
  };
};
const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});
export default connect(mapStateToProps, mapDispatchToProps)(ErrorsSettings);