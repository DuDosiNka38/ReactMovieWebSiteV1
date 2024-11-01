import React, { Component } from "react";
import { Button, Label, FormGroup, Col, Row, Card, CardBody, Modal, ModalBody, ModalHeader } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import noteWindow from "./../../services/notifications";
import CasePersonal from "./../../components/CasePersonal/CasePersonal";
import { connect } from "react-redux";
import * as actions from './../../store/user/actions'
import axios from "./../../services/axios";
import randomColor from "randomcolor"
import PRIVILEGE from "../../services/privileges";
import PreloaderLD from "./../../services/preloader-core";
import Select from "react-select";



class CreateCaseForm extends Component {
  Preloader = new PreloaderLD(this);
  
  state = {
    Case_Full_NAME: "",
    Case_Number: "",
    Case_Short_NAME: "",
    DESCRIPTION: "",
    Status: "ACTIVE",
    Case_Type: "",
    Department_id: "",
    persones: [],
    AllUsers: this.props.allUserData,
    refresh: false,
    modal: false,
    existUserData: [],
    preloaderState: false,
    // caseFiles: [],
  };

  addNewCase = this.addNewCase.bind(this);
  deleteRow = this.deleteRow.bind(this);
  // setExistedUser = this.setExistedUser.bind(this);
  // cancelExistedUser = this.cancelExistedUser.bind(this);

  switch_modal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }


  onSelectChange = (el) => {
    this.setState({ [el.name]: el.value });
    console.log(this.state);
  };

  async addNewCase() {
    this.Preloader.show();

     let color = await randomColor({
      luminosity: 'dark',
      hue: 'random'
      });

      let pers = Array.from(this.state.persones);
      let newPers = [];
      let isHasNotSelectedData = false;

      for(let i = 0; i < pers.length; i++){
        if(pers[i].personeFullName != ""){
          newPers.push(pers[i]);
        }

        if(pers[i].personeCaseRole == "" || pers[i].side == ""){
          isHasNotSelectedData = true;
        }
      }
    if(isHasNotSelectedData){
      this.Preloader.hide();
      noteWindow.isError("Select Participant Role and Participant Side!");
    } else {
      const response = await axios.post(
        "/api/case/add",
        {
          Case_Full_NAME: this.state.Case_Full_NAME,
          Case_Number: this.state.Case_Number,
          Case_Short_NAME: this.state.Case_Short_NAME,
          DESCRIPTION: this.state.DESCRIPTION,
          Status: this.state.Status,
          Case_Type: this.state.Case_Type,
          Department_id: this.state.Department_id,
          Persones: newPers,
          CaseBg: color ,
        },
      );
      if (response.data.result) {
        noteWindow.isSuck("Case created!");
        this.CaseCreate.reset();
        this.setState({ DESCRIPTION: " " });
        this.setState({ Department_id: " " });
        this.setState({ Case_Type: " " });
        this.props.onGlobalLoad();
        this.props.goTo('/allcases/');

        // document.location.replace(`/allcases/`);
      } else if (response.data.result_data.hasOwnProperty("result_error_text")) {
        this.Preloader.hide();
        if(response.data.result_data.hasOwnProperty("error_code") && response.data.result_data.error_code == "USER_EXISTS"){
          const users = response.data.result_data.data;
          const persones = this.state.persones;
          const uData = [];

          for(let k in persones){
            if(!persones[k].addedFromDB){
              const x = persones[k];
              const u = users.find((y) => (x.personePseudonym == y.Person_id || x.personeEmail == y.Email_address));
              const isExist = uData.find((el) => (el.data == u));

              if(isExist == undefined)
                uData.push({data: u, key: k});            
            }
          }
          this.setState({existUserData: uData});
          this.setState({modal: !this.state.modal})
          
        } else {
          noteWindow.isError(response.data.result_data.result_error_text);
        }
      }
    }
  }

  setExistedUser = () => {
    const p = this.state.persones;
    const users = this.state.existUserData;

    for(let key in users){
      const user = users[key];

      p[parseInt(user.key)].personeFullName = user.data.NAME;
      p[parseInt(user.key)].personeEmail = user.data.Email_address;
      p[parseInt(user.key)].personePseudonym = user.data.Person_id;
      p[parseInt(user.key)].addedFromDB = true;
    }    

    this.setState({persones: p});
    this.setState({refresh: !this.state.refresh});
    this.setState({existUserData: [], modal: !this.state.modal});
  }

  cancelExistedUser = () => {
    const p = this.state.persones;
    const users = Object.keys(this.state.existUserData);
    const key = this.state.existUserKey;
    const newP = [];

    for(let k in p){
      if(!users.includes(k))
        newP.push(p[k]);
    }
    
    this.setState({existUserData: [], modal: !this.state.modal, persones: newP});
    this.setState({refresh: !this.state.refresh});
  }

  removeExistedUser = (e) => {
    const key = e.currentTarget.getAttribute("attr-key");
    const uData = [];
    const persones = this.state.persones;
    const p = [];

    for(let k in persones){
      if(k != key){
        p.push(persones[k]);
      }
    }         

    this.state.existUserData.forEach((x) => {
      if(x.key != key){
        const i = p.findIndex(function(v,i,a){
          if(v.personePseudonym == x.data.Person_id || v.personeEmail == x.data.Email_address){
            return true;
          }
        });

        uData.push({data: x.data, key: i});
      }
    });
    
    this.setState({persones: p, existUserData: uData})    

    if(uData.length == 0)
      setTimeout(this.setState({modal: !this.state.modal}), 100);
  }

  handleChange = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  handleTableChange = (e) => {
    const rID = e.currentTarget.getAttribute('row');
    const { name, value } = e.currentTarget;
    const p = this.state.persones;
    p[rID][name] = value;
    this.setState({ persones: p });
  };

  deleteRow (e) {
   const delRow = e.currentTarget.getAttribute('row')
   this.state.persones.splice(delRow,1);
   let state = this.state.persones.map((st)=>st)
   this.setState({ persones: state});
  } 

  componentDidMount() {
    this.props.onAllUsersLoad()
  }

  refresh = (set) => {
    this.setState({refresh: set})
  }

  render() {
    // this.Preloader.showOnStart();
    if(this.props.personeData == undefined)
        return (<>{this.Preloader.get()}</>);

    const pData = this.props.personeData;
    const CT = this.props.caseType.filter((y)=> y.visible !== false).map((x)=> ({
      name: "caseTepe", valeu: x.Case_Type, label: x.Description 
    }));
    // const departments;
    // this.Preloader.hide();
    return (
      <>
        {this.Preloader.get()}
        <AvForm
          className="form-horizontal"
          onValidSubmit={this.addNewCase}
          ref={(el) => (this.CaseCreate = el)}
        >
          <Row>
            <Col lg={12}>
            <Card>
              <CardBody>
              <p>Case information</p>
              <Row>
                <Col lg={12}>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i className="dripicons-briefcase auti-custom-input-icon"></i>
                    <Label htmlFor="username">Case Full Name</Label>
                    <AvField
                      name="Case_Full_NAME"
                      value={this.state.Case_Full_NAME}
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Full name"
                      onChange={this.handleChange}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: "Please enter a name",
                        },
                        maxLength: {
                          value: 100,
                          errorMessage:
                            "Your name must be between 1 and 100 characters",
                        },
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i className="dripicons-briefcase auti-custom-input-icon"></i>
                    <Label htmlFor="username">Case Short Name</Label>
                    <AvField
                      name="Case_Short_NAME"
                      value={this.state.Case_Short_NAME}
                      type="text"
                      className="form-control"
                      id="case_short_number"
                      onChange={this.handleChange}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: "Please enter a name",
                        },
                        maxLength: {
                          value: 100,
                          errorMessage:
                            "Your name must be between 1 and 10 characters",
                        },
                      }}
                      placeholder="Case Short Name"
                    />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i className=" ri-hashtag auti-custom-input-icon"></i>
                    <Label htmlFor="username">Case №</Label>
                    <AvField
                      name="Case_Number"
                      value={this.state.Case_Number}
                      type="text"
                      className="form-control"
                      id="case_namber"
                      onChange={this.handleChange}
                      
                      placeholder="Case number"
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup className="mb-4 mt-2">
                    <Label htmlFor="billing-address">Case Description</Label>
                    <textarea
                      className="form-control custom-textarea"
                      id="billing-address"
                      rows="3"
                      name="DESCRIPTION"
                      value={this.state.DESCRIPTION}
                      placeholder="Enter case description"
                      defaultValue={this.state.caseDescription}
                      onChange={this.handleChange}
                    ></textarea>
                  </FormGroup>
                </Col>
               
            
               
                <Col lg={12}>
                  {/* <UploadFile caseFiles={this.state.caseFiles} /> */}
                </Col>
              </Row>
              </CardBody>
            </Card>
            </Col>
            <Col lg={6}>
               <Card className="w-100">
                      <CardBody>
                      <Row>
                    <Col lg={12}>
                      <FormGroup row>
                        <Label className="col-md-12 col-form-label ">
                          Select case type
                        </Label>
                        <Col md={12}>
                          <select
                            className="form-control"
                            onChange={this.handleChange}
                            value={this.state.Case_Type}
                            name="Case_Type"
                          >
                            <option value="Deafault">Select</option>
                            {this.props.caseType.filter((y)=> y.visible !== false).map(
                              ({ Case_Type, Description }) => (
                                <option key={Case_Type} value={Case_Type}>
                                  {Description}
                                </option>
                              )
                            )}
                          </select>
                          {/* <Select
                          options={CT}
                          name="Case_Type"
                          onChange={this.onSelectChange} 
                          isClearable={true}

                          /> */}

                          
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                      </CardBody>
               </Card>
                </Col>
                <Col lg={6}>
                <Card className="w-100">
                      <CardBody>
                  <Row>
                    
                      <Col lg={12}>
                      <FormGroup row>
                        <Label className="col-md-12 col-form-label ">
                          Select department
                        </Label>
                        <Col md={12}>
                          <select
                            className="form-control"
                            onChange={this.handleChange}
                            value={this.state.Department_Name}
                            name="Department_id"
                          >
                            <option value="Default">Select</option>
                            {this.props.departments.filter((y)=> y.visible !== false).map(
                              ({ Department_Name, Department_id }) => (
                                <option
                                  key={Department_id}
                                  value={Department_id}
                                >
                                  {Department_Name}
                                </option>
                              )
                            )}
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                  
                  </Row>
                  </CardBody>
                    </Card>
                </Col>
            <Col lg={12}>
             
              <Card>
             <CardBody>
             <p>Case personnel</p>
             {PRIVILEGE.check("ADD_CASE_PERSONNEL", pData) ?
                <CasePersonal
                    personeFullName={this.state.personeFullName}
                    personeEmail={this.state.personeEmail}
                    personePseudonym={this.state.personePseudonym}
                    personeCaseRole={this.state.personeCaseRole}
                    persones = {this.state.persones}
                    hendelChange = {this.handleTableChange}
                    onAddNewRow = {this.addNewPersonToState}
                    allUserData = {this.props.allUserData}
                    deleteRow = {this.deleteRow}
                    refresh = {this.state.refresh}
                    onRefresh = {this.refresh}
                  />
                  :
                  <>
                    <h5>You dont have permissions to add case personel!</h5>
                  </>
            }
                </CardBody>
              </Card>
           
            </Col>
            <Col lg={12}>
              <Button
                color="primary"
                className="w-md waves-effect waves-light w-100 mt-4 mb-5"
                type="submit"
              >
                Create Case
              </Button>
            </Col>
          </Row>
        </AvForm>
        <Modal
          isOpen={this.state.modal}
          switch={this.switch_modal}
          centered={true}
        >
          <ModalHeader
            toggle={() => this.setState({ modal: false })}
            className="text-center"
          >
            Some of persons Is Exists
          </ModalHeader>
          <ModalBody toggle={() => this.setState({ modal: false })}>
            <p>Do you want to insert data of this users in fields?</p>
            <div>
              {
                this.state.existUserData.map((u) => (
                  <>
                    <button onClick={this.removeExistedUser} attr-key={u.key}>X</button> <b>{u.data.Person_id}<br/></b>
                  </>
                ))
              }
            </div>
             <div className="d-flex justify-content-end">
                 
              <Button color="success" type="button" className="" onClick={this.setExistedUser}>
              Confirm
            </Button>
            <Button color="danger" type="button" className="ml-2" onClick={this.cancelExistedUser}>
              Decline
            </Button>
             </div>
         

          
          </ModalBody>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    caseType: state.User.casesTypes,
    departments: state.User.depatmentsData.departments,
    allUserData: state.User.allUserData,
    personeData: state.User.persone,


  };
};
const mapDispatchToProps = (dispatch) => ({
  onAllUsersLoad: () => dispatch(actions.getAllUserData()),
  onPersoneLoad: () => dispatch(actions.getPersonData()),
  onGlobalLoad: () => dispatch(actions.getGlobalData()),  
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateCaseForm);
