import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
} from "reactstrap";
import {
  AvForm,
  AvField,
  FormGroup,
  Label,
  AvInput,
  AvGroup,
  AvCheckbox,
  AvCheckboxGroup,
} from "availity-reactstrap-validation";
import Select from "react-select";
import { connect } from "react-redux";
import * as actions from "./../../../store/user/actions";
import Pagination from "./../../../services/pagination";
import axios from "./../../../services/axios";
import noteWindow from "./../../../services/notifications";
import sysInfo from "./../../../electron/services/sysInfo";

let autoUpdate = null;
class Sync extends Component {
  constructor(props){
    super(props);
    this.Form = undefined;

    this.CasesOpt = undefined;
  }
  state = {
    Uploaded_files: null,
    chkBoxModel: null,
    checkedAction: null,
    modal: false,
    MODAL_ACTION: null,

    tableSearch: "",
    tablePagination: {
      "Uploaded_files": {}
    },
    order: {
      // "Uploaded_files": {orderField: "Case_NAME", orderType: "DESC"}
    },
    searchFields: {
      "Uploaded_files" : ["File_name", "Case_NAME", "Form"]
    },

    caseForChecked: null,

    isMainChecked: false,

  };

  switch_modal = (action) => {
    const { MODAL_ACTION } = this.state;
    let show = true;

    switch(action){
      case "CONFIRM_SAVING":
        const { Uploaded_files } = this.state;
        if(Uploaded_files.filter((x) => x.Case_NAME !== null).length === 0){
          show = false;
          noteWindow.isError("Nothing to submit! You need fill fields at first!")
        }
        break;
    }

    if(show === true){
      this.setState((prevState) => ({
        MODAL_ACTION: action,
        modal:
          action === undefined || action === MODAL_ACTION
            ? !prevState.modal
            : true,
      }));

      this.render();
    }
  };

  onSelectChange = (e, el) => {
    let { Uploaded_files } = this.state;
    
    switch (el.name) {
      case "ActionForChecked":
        this.switch_modal(e.value);
        break;

      case "Case":
        Uploaded_files.find((x) => x.File_hash === e).Case_NAME = el.value;
        this.setState({Uploaded_files});
        break;

      case "Document":
        Uploaded_files.find((x) => x.File_hash === e).DOC_ID = el.value;
        this.setState({Uploaded_files});
        break;

      case "Form":
        Uploaded_files.find((x) => x.File_hash === e).Form = el.value;
        this.setState({Uploaded_files});
        break;

      case "CaseForChecked":
        this.setState({caseForChecked: e.value});
        break;

      case "FormForChecked":
        this.setState({formForChecked: e.value});
        break;

      case "checkBoxType":
        switch(e.value){
          case "ALL":
            this.toggleAll({checked: true});
            break;

          case "PAGE":
            let { Uploaded_files } = this.state;
            this.toggleList(this.getPageRows("Uploaded_files", this.searchFilter(Uploaded_files)));
            break;
        }
        break;

      case "":
        break;
    }
  };

  addCaseToChecked = () => {
    let { Uploaded_files, chkBoxModel, caseForChecked } = this.state;

    if(caseForChecked !== null){
      chkBoxModel.map((hash) => {
        let el = Uploaded_files.find((x) => x.File_hash === hash);
        if(el !== undefined){
          el.Case_NAME = caseForChecked;
        }
      });
      this.setState({Uploaded_files})
      this.switch_modal();
      this.render();
    } else {
      noteWindow.isError("You need to choose case at first!");
    }
  }

  addFormToChecked = () => {
    let { Uploaded_files, chkBoxModel, formForChecked } = this.state;

    if(formForChecked !== null){
      chkBoxModel.map((hash) => {
        let el = Uploaded_files.find((x) => x.File_hash === hash);
        if(el !== undefined){
          el.Form = formForChecked;
        }
      });
      this.setState({Uploaded_files})
      this.switch_modal();
      this.render();
    } else {
      noteWindow.isError("You need to choose form at first!");
    }
  }

  setData = () => {
    const { Person, Core } = this.props;

    if (Core === undefined || Core.length === 0 || Core === undefined) {
      setTimeout(this.setData, 500);
    } else {
      let { Uploaded_files, Syncronization, Sync_Share, Doc_Form, Cases } = Core;

      this.Form = Doc_Form.map((o) => ({
        name: "Form",
        value: o.Form,
        label: o.Form !== "UNCLASSIFIED" ? `${o.Form}: ${o.Description}` : `${o.Description}`,
      }));

      this.CasesOpt = Cases.map((x) => ({
        name: "Case",
        value: x.Case_Short_NAME,
        label: x.Case_Full_NAME,
      }));

      const PersonsId = Sync_Share.filter(
        (x) => x.Share_to_Person_id === Person.Person_id
      ).map((x) => x.Person_id);
      PersonsId.push(Person.Person_id);

      const UserFiles =
        Uploaded_files !== undefined && Uploaded_files.length > 0
          ? Uploaded_files.filter((x) => PersonsId.includes(x.Person_id))
          : [];
      const ParsedFiles = UserFiles.filter((x) => x.Parsed_Time !== null);
      const NotParsed = UserFiles.filter((x) => x.Parsed_Time === null);
      
      let tmp = [];
      ParsedFiles.map((x) => {
        const el = tmp.find((y) => y.hash === x.File_hash);
        if(el === undefined) {
          tmp.push({hash: x.File_hash, total: 1});
        } else {
          console.log(x.File_hash)
          tmp.filter((y) => y.hash !== x.File_hash).push({hash: el.hash, total: (el.total+1)});
        }
      });

      this.setState({
        Uploaded_files: ParsedFiles,
        NotParsed: NotParsed,
        chkBoxModel: [],
      });

      this.orderBy({name: "Uploaded_files", value: "Case_NAME"});
    }
  };

  toggleList = (data) => {
    let { chkBoxModel } = this.state;

    chkBoxModel = data.map((x) => x.File_hash);
    this.setState({ chkBoxModel: chkBoxModel, isMainChecked: true});
  }

  toggleOne = (e) => {
    let { chkBoxModel } = this.state;
    const { value, checked, name } = e.currentTarget;

    if (checked === false && chkBoxModel.indexOf(value) >= 0)
      chkBoxModel.splice(chkBoxModel.indexOf(value), 1);

    if (checked === true) chkBoxModel.push(value);

    this.setState({ chkBoxModel: chkBoxModel });
  };

  toggleAll = (e) => {
    let { chkBoxModel, Uploaded_files } = this.state;
    const { value, checked, name } = e.hasOwnProperty("currentTarget") ? e.currentTarget : e;
    chkBoxModel = [];

    if (checked === true) {
      Uploaded_files.map((x) => {
        chkBoxModel.push(x.File_hash);
      });
    }

    this.setState({ chkBoxModel: chkBoxModel, isMainChecked: checked });
  };

  getExtIcon(path) {
    const ext = path.split('.').pop();
    const icons = {
      "csv": (
        <>
          <i style={{ color: "#009688" }} class="fas fa-file-csv"></i>
        </>
      ),
      "doc": (
        <>
          <i style={{ color: "#2196f3" }} class="fas fa-file-word"></i>
        </>
      ),
      "docx": (
        <>
          <i style={{ color: "#2196f3" }} class="fas fa-file-word"></i>
        </>
      ),
      "jpeg": (
        <>
          <i style={{ color: "#e69325" }} class="fas fa-file-image"></i>
        </>
      ),
      "pdf": (
        <>
          <i style={{ color: "#F44336" }} class="fas fa-file-pdf"></i>
        </>
      ),
      "pdf_ocr": (
        <>
          <i style={{ color: "#F44336" }} class="fas fa-file-pdf"></i>
        </>
      ),
      "xls": (
        <>
          <i style={{ color: "#009688" }} class="fas fa-file-excel"></i>
        </>
      ),
      "xlsx": (
        <>
          <i style={{ color: "#009688" }} class="fas fa-file-excel"></i>
        </>
      ),
    };

    if (icons.hasOwnProperty(ext)) return icons[ext];
    else
      return (
        <>
          <i style={{ color: "#808080" }} class="fas fa-file-alt"></i>
        </>
      );
  }

  //SEARCH ANG PAG
  tableSearch = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ tableSearch: value });
  }

  clearSearch = () => {
    this.setState({ tableSearch: "" });
  }

  searchFilter = (data) => {
    const { tableSearch, searchFields } = this.state;

    if(tableSearch === "")
      return data;

    const needle = tableSearch.toLowerCase();

    return data.filter((x) => {
      let result = false;

      for (let k in x) {
        if (typeof x[k] === "string" && searchFields["Uploaded_files"].includes(k)) {
          const tmp = x[k].toLowerCase();
          if (tmp.indexOf(needle) !== -1) {
            result = true;
          }
        }
      }
      
      return result;
    });
  }

  getPageRows = (name, data) => {
    let { tablePagination, order } = this.state;
    let RESULT = data;

    if(tablePagination.hasOwnProperty(name) && data.length > 10){
      const { offset, pageLimit } = tablePagination[name];

      RESULT = RESULT.slice(offset, offset + pageLimit);      
    }

    return RESULT;
  }

  onPageChanged = data => {
    let { tablePagination } = this.state;
    const { currentPage, totalPages, pageLimit, name } = data;
    const offset = (currentPage - 1) * pageLimit;

    tablePagination[name] = {
      currentPage: currentPage,
      offset: offset,
      totalPages: totalPages,
      pageLimit: pageLimit
    };  
    
    this.setState({ tablePagination:tablePagination });
  };

  orderBy = (e) => {
    let { order } = this.state;
    const name= e.hasOwnProperty("name") ? e.name : e.currentTarget.getAttribute("name");
    const orderField = e.hasOwnProperty("value") ? e.value : e.currentTarget.getAttribute("value");

    if(!order.hasOwnProperty(name)){
      order[name] = {orderField: orderField, orderType: "ASC"};
    }

    if(order[name].orderField === orderField){
      order[name].orderType = order[name].orderType === "ASC" ? "DESC" : "ASC";
    } else {
      order[name].orderField = orderField;
      order[name].orderType = "ASC";
    }

    if(order.hasOwnProperty(name)){
      let RESULT = this.state[name];

      if(RESULT !== null){
        const {orderType, orderField} = order[name];

        if(orderType === "ASC")
          RESULT = RESULT.sort((a, b) => {
            if(a[orderField] !== null && b[orderField] !== null){
              return a[orderField] > b[orderField] ? 1 : -1;
            } 
            if(a[orderField] === null && b[orderField] !== null){
              return -1;
            }
            if(a[orderField] !== null && b[orderField] === null){
              return 1;
            }
            if(a[orderField] === null && b[orderField] === null){
              return 1;
            }
          });

        if(orderType === "DESC")
          RESULT = RESULT.sort((a, b) => {
            if(a[orderField] !== null && b[orderField] !== null){
              return a[orderField] < b[orderField] ? 1 : -1;
            } 
            if(a[orderField] === null && b[orderField] !== null){
              return 1;
            }
            if(a[orderField] !== null && b[orderField] === null){
              return -1;
            }
            if(a[orderField] === null && b[orderField] === null){
              return 1;
            }
          });

        this.setState({[name]: RESULT});
      }
    }  

    this.setState({order: order});
  }

  getOrderArrow = (name, field) => {
    const { order } = this.state;

    if(!order.hasOwnProperty(name) || order[name].orderField !== field)
      return null;

    const { orderType } = order[name];
    
    if(orderType === "ASC")
      return <><i class="ri-sort-asc"></i></>

    if(orderType === "DESC")
      return <><i class="ri-sort-desc"></i></>

    return null;
  }
  //SEARCH ANG PAG ENDS

  saveFiles = () => {
    const {Uploaded_files} = this.state;
    const filtered = Uploaded_files.filter((x) => x.Case_NAME !== null);

    this.switch_modal("PROCESSING");
    let counter = 0;
    filtered.map((x) => {
      axios.post("api/file/add", x).then((r) => {

        if(r.data.result === true){
          const SERVER_PATH = r.data.result_data.SERVER_PATH;
          axios.post("api/file/removeUploadedFile", x).then((r) => console.log(r.data));
          const locations = JSON.parse(x.File_locations);
          locations.forEach((loc) => {
            axios.post("api/file/addLocation", {
              File_id: x.File_hash,
              Person_id: x.Person_id,
              Computer_id: sysInfo.get().os.hostname,
              File_name: x.File_name,
              File_path: loc,
              SERVER_PATH: SERVER_PATH
            
            }).then((r) => console.log(r.data))
          });
        }

        if(r.data.result === false){
          if(r.data.hasOwnProperty("result_data") && r.data.result_data.hasOwnProperty("result_error_code")){
            const e_code = r.data.result_data.result_error_code;
            switch(e_code){
              case "FILE_IS_NOT_EXISTS":
                axios.post("api/file/delete", {file: x.File_path}).then((r) => console.log(r.data));
                break;
            }
          }
          
        }
        console.log(counter, filtered.length);
        if(counter++ === filtered.length-1){
          noteWindow.isSuck("Files successfully saved!");
          this.switch_modal();
          this.setState({Uploaded_files: Uploaded_files.filter((x) => x.Case_NAME === null)});
          this.props.onGlobalLoad();
        }
      });
    });
  }

  removeFiles = () => {
    const {Uploaded_files, chkBoxModel} = this.state;
    const filtered = Uploaded_files.filter((x) => chkBoxModel.includes(x.File_hash));

    this.switch_modal("PROCESSING");
    let counter = 0;
    filtered.map((x) => {
      const el = document.body.querySelector(`tr[attr-index='PARSED_FILES_${x.File_hash}']`);
      if( el !== null ) el.classList.add("removing");

      axios.post("api/file/removeUploadedFile", {File_hash: x.File_hash}).then((r) => {
        if(counter++ === filtered.length-1){
          this.switch_modal();
          axios.post("api/file/delete", {file: x.File_path});
          setTimeout(() => {
            this.setState({Uploaded_files: Uploaded_files.filter((x) => !chkBoxModel.includes(x.File_hash))});
            document.body.querySelectorAll(`tr[attr-index^='PARSED_FILES_']`).forEach(function(x){x.classList.remove("removing")})
            setTimeout(() => {
              this.switch_modal();
              this.render();
            }, 1000);
          }, 1000);
        }
      });      
    });
  }

  componentDidMount() {
    setTimeout(this.props.onGlobalLoad, 2000);
    this.setData();
  }

  render() {
    const { Person, Core } = this.props;
    const {
      Uploaded_files,
      NotParsed,
      chkBoxModel,
      MODAL_ACTION,
      tablePagination
    } = this.state;

    if (Core === undefined || Core.length === 0 || Uploaded_files === null) return null;

    const { Syncronization, Sync_Share, Cases, Doc_Form } = Core;  

    const syncHistory = Syncronization.filter(
      (x) => x.Person_id === Person.Person_id
    );

    const filtered = {
      Uploaded_files: this.searchFilter(Uploaded_files),
      NotParsed: NotParsed
    }

    return (
      <>
        <div className="page-content">
          <Container fluid className="syncPage">
            <h5>Synchronization</h5>
            <Row>
              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="text-uppercase">TOTAL UPLOADED AND PARSED FILES ON SERVER</h5>
                    <h4 className="primary-color">{Uploaded_files.length}</h4>
                  </CardBody>
                </Card>                
              </Col>
              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="text-uppercase">TOTAL In queue for parsing</h5>
                    <h4 className="primary-color">{NotParsed.length}</h4>
                  </CardBody>
                </Card> 
              </Col>
              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="text-uppercase">Last synchronization</h5>
                    <h4 className="primary-color">{syncHistory.length > 0 ? syncHistory.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1).slice(0,1)[0].sync_time : "Synchronization hasn't been performed before"}</h4>
                  </CardBody>
                </Card> 
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <h4 className="h4">Uploaded and parsed files on server {chkBoxModel.length > 0 ? <>: <b style={{color:"#3f51b5"}}>SELECTED {chkBoxModel.length}</b> </> : ""}</h4>                    
                    {Uploaded_files.length > 0 ? (
                      <>
                        <Row>
                          {/* <Col lg={6}>
                            <div className="scanInfo my-3">
                              <h6>Scan Information</h6>   
                              <Row>
                                <Col lg={8} className="scan-info-label">
                                  <i className="ri-briefcase-4-line"></i> Total files with correctly <b>selected</b> case:
                                </Col>
                                <Col className="scan-info-value text-right">
                                  {Uploaded_files.filter((x) => x.Case_NAME !== null).length}
                                </Col>
                              </Row>  
                              <Row>
                                <Col lg={8} className="scan-info-label">
                                  <i class="ri-layout-3-line"></i> Total files with correctly <b>selected</b> form:
                                </Col>
                                <Col className="scan-info-value text-right">
                                  {Uploaded_files.filter((x) => x.Form !== "UNCLASSIFIED" && x.Form !== null).length}
                                </Col>
                              </Row>                   
                              <Row>
                                <Col lg={8} className="scan-info-label">
                                  <i class="ri-file-copy-2-line"></i> TOTAL SELECTED FILES:
                                </Col>
                                <Col className="scan-info-value text-right">
                                  {chkBoxModel.length}
                                </Col>
                              </Row>
                              
                            </div>
                          </Col> */}
                          {/* <Col lg={6}>
                            <div className="fileFilters my-3">
                              <h6>Filters</h6>
                              <h5>As soon as possible;)</h5>     
                            </div>
                          </Col> */}
                        </Row>
                        <AvForm onSubmit={() => this.switch_modal("CONFIRM_SAVING")}>
                          <Row className="mb-2 d-flex align-items-center">
                            <Col lg={3}>
                              {(() => {
                                const { checkedAction } = this.state;
                                const options = [
                                  {
                                    value: "SELECT_CASE",
                                    label: "Choose Case for selected files",
                                  },
                                  {
                                    value: "SELECT_FORM",
                                    label: "Choose Form for selected files",
                                  },
                                  {
                                    value: "REMOVE_FILES",
                                    label: "Remove selected files",
                                  },
                                ];

                                return (
                                  <>
                                    <Select
                                      name="ActionForChecked"
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      placeholder="Choose action for selected files"
                                      isDisabled={chkBoxModel.length === 0}
                                      options={options}
                                      value={checkedAction === null ? checkedAction : options.find((x) => x.value === checkedAction)}
                                      onChange={this.onSelectChange}
                                    />
                                  </>
                                );
                              })()}
                              
                              {/* <h5 className="h5 mb-0">{part.label}</h5> */}
                              {/* <h4 className=" d-flex align-items-center scaningDirHeader">
                                  <span className={`scaningDir ${part.class !== undefined ? part.class : ""}`}>
                                    {part.label}{" "}
                                    <span className="folder-files-count">
                                      {part.files.length}
                                    </span>
                                  </span>
                                </h4> */}
                            </Col>
                            <Col className="search-row">
                              <Input
                                className="table-search"
                                onChange={this.tableSearch}
                                type="text"
                                placeholder="Click to Search"
                              />
                              <i
                                class="ri-close-line"
                                onClick={this.clearSearch}
                              ></i>
                            </Col>
                          </Row>
                          <AvCheckboxGroup name="manageFiles">
                            <Table className={`customTable`}>
                              <thead>
                                <tr
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <td className="custom-cbox" style={{width: "5%", position: "relative", paddingLeft: "7px"}}>
                                    {(() => {
                                      const customStyles = {
                                        control: (provided, state) => ({
                                          ...provided,
                                          height: "24px",
                                          width: "48px",
                                          minHeight: "24px",
                                        }),
                                        placeholder: () => ({
                                          display: "none"
                                        }),
                                        valueContainer: () => ({
                                          display: "none"
                                        }),
                                        indicatorSeparator: () => ({
                                          position: "relative",
                                          left: "24px",
                                          top: "0px",
                                          height: "16px",
                                          width: "1px",
                                          background: "hsl(0, 0%, 80%)",
                                        }),
                                        dropdownIndicator: (provided, state) => ({
                                          ...provided,
                                          position: "absolute",
                                          right: "-8px"
                                        }),
                                        menu: (provided, state) => ({
                                          ...provided,
                                          marginTop: "1px",
                                          overflow: "hidden",
                                          zIndex: "9",
                                          width: "110px",
                                        }),

                                        menuList: (provided, state) => ({
                                          ...provided,
                                          padding: "0"
                                        }),

                                        option: (provided, state) => ({
                                          padding: "2px 5px",
                                          color: "#74788d",
                                          fontSize: "12px",
                                        })
                                      }

                                      return (
                                        <>
                                          <Select
                                            styles={customStyles}
                                            options={[
                                              {value: "ALL", label:"Select all"},
                                              {value: "PAGE", label: "Select all on page"}
                                            ]}
                                            name="checkBoxType"
                                            onChange={this.onSelectChange}
                                          />
                                    
                                          <AvCheckbox
                                            customInput
                                            onChange={this.toggleAll}
                                            style={{
                                              top: "-23px",
                                              left: "4px"
                                            }}
                                            checked={this.state.isMainChecked}
                                          />
                                        </>
                                      );
                                    })()}
                                  </td>
                                  <td style={{ width: "10%" }} className="order-button" name="Uploaded_files" value={"Person_id"} onClick={this.orderBy}>
                                    Person id {this.getOrderArrow("Uploaded_files", "Person_id")}
                                  </td>
                                  <td style={{ width: "40%" }} className="order-button" name="Uploaded_files" value={"File_name"} onClick={this.orderBy}>
                                    Name {this.getOrderArrow("Uploaded_files", "File_name")}
                                  </td>
                                  <td style={{ width: "15%" }} className="order-button" name="Uploaded_files" value={"Case_NAME"} onClick={this.orderBy}>
                                    Case Name {this.getOrderArrow("Uploaded_files", "Case_NAME")}
                                  </td>
                                  <td style={{ width: "15%" }} className="order-button" name="Uploaded_files" value={"Document"} onClick={this.orderBy}>
                                    Document {this.getOrderArrow("Uploaded_files", "Document")}
                                  </td>
                                  <td style={{ width: "15%" }} className="order-button" name="Uploaded_files" value={"Form"} onClick={this.orderBy}>
                                    Form {this.getOrderArrow("Uploaded_files", "Form")}
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {                                
                                this.getPageRows("Uploaded_files", filtered.Uploaded_files).map((file) => (
                                  <>
                                    <tr
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}

                                      attr-index={`PARSED_FILES_${file.File_hash}`}
                                    >
                                      <td style={{ width: "5%" }}>
                                        <AvCheckbox
                                          customInput
                                          value={file.File_hash}
                                          onChange={this.toggleOne}
                                          checked={chkBoxModel.includes(
                                            file.File_hash
                                          )}
                                        />
                                      </td>
                                      <td style={{ width: "10%" }}>
                                        {file.Person_id}
                                      </td>
                                      <td style={{ width: "40%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {this.getExtIcon(file.File_path)} {file.File_name}
                                      </td>
                                      <td style={{ width: "15%" }}>
                                        {(() => {
                                          return (
                                            <>
                                              <Select
                                                name="Case"
                                                attr-file-hash={file.File_hash}
                                                options={this.CasesOpt}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                onChange={(e) =>
                                                  this.onSelectChange(
                                                    file.File_hash,
                                                    e
                                                  )
                                                }
                                                value={file.Case_NAME !== null ? this.CasesOpt.find(
                                                  (c) => c.value === file.Case_NAME 
                                                ) : null}
                                              />
                                            </>
                                          );
                                        })()}
                                        
                                      </td>
                                      <td style={{ width: "15%" }}>
                                        {(() => {
                                          const Case = Cases.find((x) => x.Case_Short_NAME === file.Case_NAME);
                                          let docs = [{label: "Create new document", value: null, name: "Document"}];
                                          if(Case !== undefined && Case !== null){
                                            docs = docs.concat(Case.Case_Documents.filter((x) => x.DOCUMENT_NAME !== "DEFAULT").map((doc) => ({
                                              label: doc.DOCUMENT_NAME,
                                              value: doc.DOC_ID,
                                              name: "Document"
                                            })));
                                          }

                                          if(Case !== undefined && Case !== null){
                                            return (
                                              <>
                                                <Select
                                                  name="Document"
                                                  attr-file-hash={file.File_hash}
                                                  options={docs}
                                                  defaultValue={docs[0]}
                                                  value={docs.find((x) => x.value === file.DOC_ID)}
                                                  className="basic-multi-select"
                                                  classNamePrefix="select"
                                                  onChange={(e) =>
                                                    this.onSelectChange(
                                                      file.File_hash,
                                                      e
                                                    )
                                                  }
                                                />
                                              </>
                                            );
                                          } else {
                                            return (<div className="d-flex text-center align-items-center" style={{padding: "10px 0"}}><div style={{width: "100%"}}>Select Case at first</div></div>);
                                          }
                                        })()}  
                                        
                                      </td>
                                      <td style={{ width: "15%" }}>
                                        <Select
                                          name="Form"
                                          options={this.Form}
                                          className="basic-multi-select"
                                          classNamePrefix="select"
                                          onChange={(e) =>
                                            this.onSelectChange(
                                              file.File_hash,
                                              e
                                            )
                                          }
                                          value={
                                            file.Form !== null
                                              ? this.Form.find(
                                                  (y) => y.value === file.Form
                                                )
                                              : this.Form.find(
                                                  (y) =>
                                                    y.value === "UNCLASSIFIED"
                                                )
                                          }
                                        />
                                      </td>
                                    </tr>
                                  </>
                                ))}
                              </tbody>
                            </Table>
                          </AvCheckboxGroup>
                          <Pagination
                            name="Uploaded_files"
                            totalRecords={filtered.Uploaded_files.length}
                            pageNeighbours={1}
                            onPageChanged={this.onPageChanged}
                          />
                          <Button type="submit" color="success" className="w-100 mt-3">Submit</Button>
                        </AvForm>
                      </>
                    ) : (
                      <>Uploaded files list is empty!</>
                    )}
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <h4 className="h4">Synchronization history</h4>
                    <Table className="customTable">
                      <thead>
                        <tr>
                          <td>Computer id</td>
                          <td>Synchronization date</td>
                          <td>Status</td>
                        </tr>
                      </thead>
                      <tbody>
                        {syncHistory.length > 0 
                          ?
                            syncHistory.map((row) => (
                              <>
                                <tr>
                                  <td>{row.Computer_id}</td>
                                  <td>{row.sync_time}</td>
                                  <td>{row.Status}</td>
                                </tr>
                              </>
                            ))
                          :
                            <>
                              <tr>
                                <td colSpan={3}>Synchronization history list is empty</td>
                              </tr>
                            </>
                        }
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>

              {MODAL_ACTION === "CONFIRM_SAVING" && (
                <>
                  <Modal isOpen={this.state.modal} centered={true} size="l">
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                      className="text-center"
                    >
                      Confirm saving {Uploaded_files.filter((x) => x.Case_NAME !== null).length} {Uploaded_files.filter((x) => x.Case_NAME !== null).length === 1 ? "file" : "files"}
                    </ModalHeader>
                    <ModalBody>
                      {Uploaded_files.filter((x) => x.Case_NAME !== null).length} {Uploaded_files.filter((x) => x.Case_NAME !== null).length === 1 ? "file" : "files"} would be saved in database and then you could be found them in case documents
                    </ModalBody>
                    <ModalFooter>
                      <Button color="success"  onClick={this.saveFiles}>
                        Submit
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}
              
              {MODAL_ACTION === "SELECT_CASE" && (
                <>
                  <Modal isOpen={this.state.modal} centered={true} size="l">
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                      className="text-center"
                    >
                      Select case for {chkBoxModel.length} {chkBoxModel.length === 1 ? "file" : "files"}
                    </ModalHeader>
                    <ModalBody>
                      <Select
                        name="CaseForChecked"
                        options={this.CasesOpt}
                        onChange={this.onSelectChange}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="success" onClick={this.addCaseToChecked}>
                        Submit
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              {MODAL_ACTION === "SELECT_FORM" && (
                <>
                  <Modal isOpen={this.state.modal} centered={true} size="l">
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                      className="text-center"
                    >
                      Select form for {chkBoxModel.length} {chkBoxModel.length === 1 ? "file" : "files"}
                    </ModalHeader>
                    <ModalBody>
                      <Select
                        name="FormForChecked"
                        options={this.Form}
                        onChange={this.onSelectChange}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="success" onClick={this.addFormToChecked}>
                        Submit
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              {MODAL_ACTION === "REMOVE_FILES" && (
                <>
                  <Modal isOpen={this.state.modal} centered={true} size="l">
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                    >
                      Are you sure?
                    </ModalHeader>
                    <ModalBody>
                      {chkBoxModel.length} selected {chkBoxModel.length === 1 ? "file" : "files"} would be deleted permamently from server.
                    </ModalBody>
                    <ModalFooter>
                      <Button color="success"  onClick={this.removeFiles}>
                        Submit
                      </Button>
                      <Button color="danger"  onClick={this.switch_modal}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              {MODAL_ACTION === "PROCESSING" && (
                <>
                  <Modal isOpen={this.state.modal} centered={true} size="s" style={{width: "200px"}}>
                    <ModalHeader
                      // toggle={() => this.setState({ modal: false })}                   
                      className="text-center d-flex align-items-center justify-content-center"
                      charCode= "" 
                    >
                      Processing
                    </ModalHeader>
                    <ModalBody className="text-center w-100">
                      <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </ModalBody>
                  </Modal>
                </>
              )}


            </Row>
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Person: state.User.persone,
    Core: state.User.globalData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sync);
