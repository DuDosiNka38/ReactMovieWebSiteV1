import React, { Component, Suspense } from "react";
import { Container, Row, Col, Card, CardBody, Button, Input, CardHeader, FormGroup, Label, Table, Spinner } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";

import AddDocumentModal from "../../modals/Documents/AddDocumentModal";
import PageHeader from "./../../components/PageHader/PageHeader";
import TrotlingBlocks from "../../components/StyledComponents/TrotlingBlocks";
import PageFilters from "../../components/FormComponents/PageFilters/PageFilters";

import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";
import * as PersonnelActions from "./../../store/personnel/actions";
import * as DocsActions from "./../../store/documents/actions";
import * as SyncActions from "./../../store/sync/actions";
import * as UserActions from "./../../store/user/actions";
import * as PreloaderActions from "./../../store/preloader/actions";

import DocApi from "./../../api/DocsApi";
import DocumentBlock from "../../components/Documents/DocumentBlock";
import Pagination from "../../services/Pagination/pagination";
import SyncApi from "../../api/SyncApi";
import ComputersApi from "../../api/ComputersApi";
import { filterObj, mapStep } from "../../services/Functions";
import { AvForm, AvField, AvCheckbox, AvCheckboxGroup } from "availity-reactstrap-validation";
import notification from "../../services/notification";
import { ipcRenderer } from "electron";

import CountDown from "../../services/CountDown";

const md5 = require("md5");

const actionsStyle = {
  container: (provided, state) => ({
    ...provided,
    width: "300px",
  }),
  menu: (provided, state) => ({
    ...provided,
    zIndex: "999",
  }),
};

class Synchronization extends Component {
  state = {
    pageLoaded: false,
    FilesData: [],
    FilesDataCache: {},
    FilesDataLength: 0,

    Doc_forms_opt: [],
    Cases_opt: [],
    updateToggler: false,

    Computers: [],
    chkBoxModel: [],
    isMainChecked: false,

    FILES_ACTION: null,

    hasNotUploaded: false,
    notUploaded: [],

    shiftSelect: {
      start: null,
      end: null,
    },


    isLoading: false,

    countDown: null,
  };

  request = {
    like: null,
    where: {},
    whereIn: [{ field: "Parsing_Step_Key", values: ["PARSED"] }],
    whereBetween: [],
    limit: 9,
    offset: 0,
  };

  // setCheckboxListeners = () => {
  //   const checkBoxes = document.querySelectorAll("input[name='parsed-file-row'][type='checkbox']");
  //   if(checkBoxes.length) {
  //     for (let x of checkBoxes){
  //       x.addEventListener("click", function(event){
  //         console.log(event);
  //       });
  //     }
  //   }

  // }

  submitFilesFilter = async (data) => {
    const { Search, Computer_id, Person_id, Parsing_Step_Key, Case_NAME, Order_By } = data;
    const defaults = {
      like: [],
      where: {},
      whereIn: [],
      whereNull: false,
      whereBetween: [],
      order: {
        field: "Upload_dt",
        type: "ASC",
      },
    };

    this.request = { ...this.request, ...defaults };

    if (Search) {
      this.request.like = [...this.request.like, { field: "File_name", value: Search }];
    }

    if (Case_NAME) {
      if (Case_NAME.includes(null)) {
        this.request.whereNull = "Case_NAME";
      }
      if (Case_NAME.filter((x) => x !== null).length)
        this.request.whereIn = [
          ...this.request.whereIn,
          { field: "Case_NAME", values: Case_NAME.filter((x) => x !== null) },
        ];
    }

    if (Computer_id) {
      this.request.whereIn = [...this.request.whereIn, { field: "Computer_id", values: Computer_id }];
    }

    if (Person_id) {
      this.request.whereIn = [...this.request.whereIn, { field: "Person_id", values: Person_id }];
    }

    if (Parsing_Step_Key) {
      this.request.whereIn = [...this.request.whereIn, { field: "Parsing_Step_Key", values: Parsing_Step_Key }];
    }

    if (Order_By) {
      this.request.order = {
        ...defaults.order,
        ...Order_By,
      };
    }

    this.loadData({ clearCache: true });
  };

  onPageChanged = async (data) => {
    const { currentPage, totalPages, pageLimit, name } = data;
    this.request.offset = pageLimit !== "ALL_RECORDS" ? (currentPage > 0 ? (currentPage - 1) * pageLimit : 0) : null;
    this.request.limit = pageLimit !== "ALL_RECORDS" ? pageLimit : null;
    this.loadData({ clearCache: false, updateToggler: !this.state.updateToggler });
  };

  loadData = async ({ clearCache = false } = {}) => {
    const { Preloader, User } = this.props;

    if (User.Person_id === undefined) {
      setTimeout(this.loadData, 500);
      return false;
    }

    Preloader.show();

    if (clearCache) this.setState({ FilesDataCache: {} });

    const { FilesDataCache } = this.state;
    const requestHash = md5(JSON.stringify({ ...this.request }));

    const FilesData = FilesDataCache[requestHash]
      ? FilesDataCache[requestHash]
      : await SyncApi.fetchFilteredParsedFiles(User.Person_id, this.request);

    FilesDataCache[requestHash] = FilesData;

    this.setState({
      FilesData: FilesData.data,
      FilesDataLength: FilesData.length,
      FilesDataCache,
      // isMainChecked: false,
      // chkBoxModel: [],
    });

    // this.setCheckboxListeners();

    Preloader.hide();
  };

  removeSelectedFiles = () => {
    let { chkBoxModel, FilesData } = this.state;
    const filteredFiles = FilesData.filter((x) => chkBoxModel.includes(x.Server_File_id));

    this.props.showModal("REMOVE_PARSED_FILES", {
      files: filteredFiles,
      onSuccess: () => {
        this.loadData({ clearCache: true });
      },
      onClose: () => {
        this.handleActions({ value: null });
        this.setState({ chkBoxModel: [], isMainChecked: false });
      },
    });
  };
  chooseCaseForSelectedFiles = () => {
    let { chkBoxModel, FilesData } = this.state;
    const filteredFiles = FilesData.filter((x) => chkBoxModel.includes(x.Server_File_id));

    this.props.showModal("CHOOSE_CASE_FOR_PARSED", {
      files: filteredFiles,
      onSuccess: () => {
        this.loadData({ clearCache: true });
      },
      onClose: () => {
        this.handleActions({ value: null });
        // this.setState({ chkBoxModel: [], isMainChecked: false });
      },
    });
  };
  chooseFormForSelectedFiles = () => {
    let { chkBoxModel, FilesData } = this.state;
    const filteredFiles = FilesData.filter((x) => chkBoxModel.includes(x.Server_File_id));

    this.props.showModal("CHOOSE_FORM_FOR_PARSED", {
      files: filteredFiles,
      onSuccess: () => {
        this.loadData({ clearCache: true });
      },
      onClose: () => {
        this.handleActions({ value: null });
        // this.setState({ chkBoxModel: [], isMainChecked: false });
      },
    });
  };

  handleActions = (e) => {
    if (typeof e.value === "function") e.value();

    this.setState({ FILES_ACTION: e.value });
  };

  handleSelectChange = async (val, el, Server_File_id) => {
    const { Preloader } = this.props;
    const { FilesData } = this.state;
    const { name, action } = el;
    const { value } = val;

    Preloader.show();

    const syncFileRow = FilesData.find((x) => x.Server_File_id === Server_File_id);
    
    const response = await SyncApi.putParsedFiles([
      { ...filterObj(syncFileRow, (v, i) => ["Person_id", "File_id", "Computer_id"].includes(i)), [name]: value },
    ]);
    if (response) {
      this.loadData({ clearCache: true });
    }

    Preloader.hide();
  };

  toggleOne = (e, i) => {
    let { chkBoxModel } = this.state;
    const { checked, name } = e.currentTarget;
    const { FilesData } = this.state;
    const value = e.currentTarget.value;

    if (checked === false && chkBoxModel.indexOf(value) >= 0) chkBoxModel.splice(chkBoxModel.indexOf(value), 1);
    if (checked === true) chkBoxModel.push(value);

    this.setState({
      chkBoxModel: chkBoxModel,
      isMainChecked: chkBoxModel.length === FilesData.length,
    });

    if (e.shiftKey) {
      const shiftSelect = this.state.shiftSelect;

      if(shiftSelect.start === null){
        shiftSelect.start = i;
      } else {
        shiftSelect.end = i;
      }

      console.log(shiftSelect.start, shiftSelect.end)

      if(shiftSelect.start !== null && shiftSelect.end !== null){
        FilesData.slice(shiftSelect.start, shiftSelect.end).map((x) => {
          if(!chkBoxModel.includes(x.Server_File_id))
            chkBoxModel.push(x.Server_File_id);
        })
        this.setState({shiftSelect: {start: null, end:null}});
      } else {
        this.setState({shiftSelect});
      }      
    } else {
      this.setState({shiftSelect: {start: null, end:null}});
    }

    
  };

  toggleAll = async (e) => {
    const { Preloader } = this.props;
    const { value, checked, name } = e.currentTarget;
    const { FilesData } = this.state;

    // Preloader.show();

    const chkBoxModel = [];
    const start = Date.now();
    if (checked === true) {
      await mapStep(FilesData, async (x, next, i) => {
        chkBoxModel.push(x.Server_File_id);
        setTimeout(() => next(), 10);
      }, () => {
        this.setState({ chkBoxModel, isMainChecked: checked });
      });

      // await FilesData.map((x) => {
      // });
    } else {
      this.setState({ chkBoxModel, isMainChecked: checked });
    }

    this.setState({shiftSelect: {start: null, end:null}});
    // Preloader.hide();
    // this.setState({ isMainChecked: checked });
  };

  // checkboxClick = (event, i) => {
  //   const { chkBoxModel, FilesData } = this.state;
  //   if (event.ctrlKey) {
  //     chkBoxModel.push(FilesData[i].Server_File_id);
  //   }
  //   if (event.shiftKey) {
  //     const shiftSelect = Object.assign({}, this.state.shiftSelect);

  //     if(shiftSelect.start === null){
  //       shiftSelect.start = i;
  //     } else {
  //       shiftSelect.end = i;
  //     }

  //     if(shiftSelect.start !== null && shiftSelect.end !== null){
  //       FilesData.slice(shiftSelect.start, shiftSelect.end).map((x) => {
  //         if(!chkBoxModel.includes(x.Server_File_id))
  //           chkBoxModel.push(x.Server_File_id);
  //       })
        
  //     }

  //     this.setState({shiftSelect});
  //   } else {
  //   }

  //   this.setState({chkBoxModel});
  // }

  addWrongRowClass = (rowId) => {
    const CLASS = "wrong-row";
    const el = document.getElementById(rowId);
    if (el) {
      el.classList.add(CLASS);
      el.addEventListener(
        "mouseover",
        function (event) {
          const el = event.target;
          el.classList.remove(CLASS);
        },
        { once: true }
      );
    }
  };

  removeAllWrongRowsClass = () => {
    const CLASS = "wrong-row";
    const elements = document.getElementsByClassName(CLASS);
    if (elements.length) {
      for (let x of elements) {
        x.classList.remove(CLASS);
      }
    }
  };

  submitFiles = async () => {
    this.removeAllWrongRowsClass();

    let { chkBoxModel, FilesData } = this.state;
    const filteredFiles = FilesData.filter((x) => chkBoxModel.includes(x.Server_File_id));

    let isValid = true;

    await mapStep(filteredFiles, (file, next) => {
      if (file.Case_NAME === null || file.Form === null) {
        isValid = false;
        this.addWrongRowClass(file.Server_File_id);
      }

      next();
    });

    if (!isValid) {
      this.props.showModal("WRONG_ROWS_FOUND", {
        correctFiles: filteredFiles.filter((x) => x.Case_NAME !== null && x.Form !== null),
        onSuccess: () => {
          this.loadData({ clearCache: true });
        },
        onClose: () => {
          this.setState({ isMainChecked: false, chkBoxModel: [] });
          this.handleActions({ value: null });
          this.setState({ chkBoxModel: [], isMainChecked: false });
        },
      });
      return false;
    }

    this.props.showModal("SUBMIT_PARSED_FILES", {
      files: filteredFiles,
      onSuccess: () => {
        this.loadData({ clearCache: true });
      },
      onClose: () => {
        this.handleActions({ value: null });
        this.setState({ chkBoxModel: [], isMainChecked: false });
      },
    });
  };

  checkNotUploadedFiles = async () => {
    const { User, sysInfo } = this.props;
    const {hostname:Computer_id} = sysInfo.os;

    const isBlocked = ipcRenderer.sendSync("isSyncBlocked", {});

    if(isBlocked) return;
    if(User.Person_id){
      const syncedFiles = await SyncApi.fetchSyncedFiles(User.Person_id, Computer_id, {locations: true});
      
      const notUploaded = syncedFiles.filter((x) => x.Upload_dt === null);
      
      if(notUploaded.length){

        this.setState({
          hasNotUploaded: true,
          notUploaded
        })
      }
    }
  }

  uploadPreviousFiles = async () => {
    const { notUploaded:data } = this.state;

    const { Preloader } = this.props;

    Preloader.show();    
    let totalSize = 0;

    await mapStep(data, (e, next) => {
      totalSize += parseInt(e.Size);
      setTimeout(next, 10);
    });
      
    this.props.showModal("SYNCHRONIZATION", {notUploaded: data, totalSize});
    Preloader.hide();
  }

  componentDidMount() {
    const countDown = new CountDown();
    this.setState({ countDown });    
  }

  componentWillUnmount() {
    const { countDown } = this.state;

    if(countDown)
      countDown.stopCountdown();
  }

  componentDidMount = async () => {
    this.loadData();

    this.props.fetchUser();
    this.props.fetchCases();
    this.props.fetchDocForms();
    this.props.fetchParsingSteps();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps.User !== this.props.User && this.props.User.Person_id && !this.state.isLoading) {
      this.setState({isLoading: true})
      this.props.fetchSyncSharedPersons(this.props.User.Person_id);

      this.checkNotUploadedFiles();      

      await this.loadData();
      this.setState({ pageLoaded: true});
    }
    if (prevProps.cases !== this.props.cases || this.state.Cases_opt.length !== this.props.cases.length) {
      this.setState({
        Cases_opt: this.props.cases.map((x) => ({ value: x.Case_Short_NAME, label: x.Case_Full_NAME })),
      });
    }
    if (prevProps.Doc_forms !== this.props.Doc_forms) {
      this.setState({
        Doc_forms_opt: this.props.Doc_forms.map((x) => ({ value: x.Form, label: `${x.Form} | ${x.Description}` })),
      });
    }

    if (prevProps.Shared_Persons !== this.props.Shared_Persons) {
      let Computers = [];
      mapStep(
        [...this.props.Shared_Persons, this.props.User],
        async (p, next) => {
          const userComputers = await ComputersApi.fetchUserComputers(p.Person_id);
          mapStep(
            userComputers,
            ({ Computer_id }, next) => {
              if (Computers.indexOf(Computer_id) === -1) {
                Computers.push(Computer_id);
              }
              next();
            },
            () => {
              next();
            }
          );
        },
        () => {
          this.setState({ Computers });
        }
      );
    }
  };

  showFilePreview = (event) => {
  };

  render() {
    const {
      FilesData,
      FilesDataLength,
      pageLoaded,
      Cases_opt,
      Doc_forms_opt,
      Computers,
      chkBoxModel,
      isMainChecked,
      FILES_ACTION,
      ParseInfo,
      hasNotUploaded,
      loadParseInfo
    } = this.state;
    const { cases, Personnel, User, Shared_Persons, Parsing_Steps } = this.props;

    const actions = [
      {
        value: this.removeSelectedFiles,
        label: "Remove Selected Files Unfortunately",
      },
      {
        value: this.chooseCaseForSelectedFiles,
        label: "Assign Case to Selected Files",
      },
      {
        value: this.chooseFormForSelectedFiles,
        label: "Assign Form to Selected Files",
      },
      {
        value: this.submitFiles,
        label: "Save files to library"
      }
    ];

    const PageFilterComponents = {
      Search: {
        placeholder: "ex. My First Document",
      },
      Selects: [
        {
          name: "Case_NAME",
          options: [{ value: null, label: "Undefined" }, ...Cases_opt],
          // options: Cases_opt,
          disabled: false,
          label: "Cases",
          isMulti: true,
          col: 3,
        },
        {
          name: "Computer_id",
          options: Computers.map((x) => ({ value: x, label: x })),
          disabled: false,
          label: "Computers",
          isMulti: true,
          col: 2,
        },
        {
          name: "Person_id",
          options: Shared_Persons
            ? Shared_Persons.map((x) => ({ value: x.Person_id, label: x.Share_person_NAME }))
            : null,
          label: "Persons",
          isMulti: true,
          col: 2,
        },
        // {
        //   name: "Parsing_Step_Key",
        //   options: Parsing_Steps.map((x) => ({ value: x.Step_Key, label: x.Step_Desc })),
        //   label: "Parsing Steps",
        //   isMulti: true,
        //   col: 2,
        // },
      ],
      OrderBy: {
        name: "Order_By",
        options: [
          { value: "CREATED_DATE", label: "Created Date" },
          { value: "Upload_dt", label: "Upload Date" },
          { value: "Case_NAME", label: "Case Name" },
          { value: "Sync_Files.Form", label: "Form" },
        ],
        value: "Upload_dt",
        label: "Order By",
        col: 3,
      },
    };

    return (
      <>
        <div className="page-content sync-page">
          <Container fluid className="pageWithSearchTable">
            {hasNotUploaded && (
              <>
                <div className="doc_w_block d-flex align-items-center justify-content-between"> 
                  <span>Warning! You haven't uploaded files from previous synchronizations. Do you want to upload it now?</span>
                  <Button className="ld-button-info" type="submit" onClick={this.uploadPreviousFiles}>
                    Yes. Upload it now!
                  </Button>            
                </div>
              </>
            )}
            
            <PageHeader>Synchronization</PageHeader>
            

            <Card className="documents-block">
              <PageFilters components={{ ...PageFilterComponents }} onSubmit={this.submitFilesFilter} />
            </Card>
            <Pagination
              name="Documents"
              totalRecords={FilesDataLength}
              pageNeighbours={1}
              pageLimit={10}
              onPageChanged={this.onPageChanged}
              markupPosition={["top", "bottom"]}
              isShowAllRecordsButton={true}
            >
              {FilesDataLength ? (
                <>
                  <Card className="documents-block">
                    <CardHeader>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="count-selected">
                            <i className="ri-checkbox-multiple-line font-weight-light mr-2"></i> {chkBoxModel.length} of{" "}
                            {FilesDataLength}
                          </div>
                          <Select
                            styles={actionsStyle}
                            value={FILES_ACTION && actions.find((x) => x.value === FILES_ACTION)}
                            placeholder={Boolean(chkBoxModel.length) ? "Choose action.." : "Check Files at First!"}
                            isMulti={false}
                            options={actions}
                            closeMenuOnSelect={true}
                            onChange={this.handleActions}
                            isDisabled={!Boolean(chkBoxModel.length)}
                          />
                          
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <Button
                            className="d-flex align-items-center ld-button-success text-uppercase ml-2"
                            onClick={this.submitFiles}
                            disabled={!Boolean(chkBoxModel.length)}
                          >
                            <i className="ri-add-line"></i> Submit Files
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="p-0">
                      <AvForm onSubmit={() => this.switch_modal("CONFIRM_SAVING")}>
                        <AvCheckboxGroup name="synced-files" className="m-0">
                          <div className="file-preview"></div>
                          <Table className="customTable flex-table m-0 synced-files-table" attr-type="PARSED_FILES">
                            <thead>
                              <tr>
                                <th className="position-relative p-0 d-flex align-items-center">
                                  <input type="checkbox" checked={isMainChecked} onChange={this.toggleAll}/>
                                  {/* <AvCheckbox customInput onChange={this.toggleAll} checked={isMainChecked} /> */}
                                </th>
                                <th>Person id</th>
                                <th>Computer id</th>
                                <th>File Name</th>
                                <th>Dates</th>
                                <th>Case Name</th>
                                <th>File Form</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pageLoaded ? (
                                <>
                                  {FilesData.map((file, i) => (
                                    <>
                                      <tr id={file.Server_File_id}>
                                        {/* onMouseOver={this.showFilePreview} */}
                                        <td>
                                          {/* <AvCheckbox
                                            customInput
                                            onChange={this.toggleOne}
                                            checked={chkBoxModel.includes(file.Server_File_id)}
                                            value={file.Server_File_id}
                                            // onChange={this.toggleOne}
                                            // checked={chkBoxModel.includes(
                                            //   file.File_hash
                                            // )}
                                          /> */}
                                          <input type="checkbox" checked={chkBoxModel.includes(file.Server_File_id)} value={file.Server_File_id} onClick={(e) => this.toggleOne(e, i)}/>
                                        </td>
                                        <td>{file.Person_id}</td>
                                        <td>{file.Computer_id}</td>
                                        <td title={file.File_name}>{file.File_name}</td>
                                        <td>
                                          <b>Created:</b>
                                          <br />
                                          {file.CREATED_DATE}
                                          <br />
                                          <b>Uploaded:</b>
                                          <br />
                                          {file.Upload_dt}
                                        </td>
                                        <td>
                                          {((Case_NAME) => (
                                            <>
                                              <Select
                                                name="Case_NAME"
                                                attr-id={file.File_id}
                                                options={Cases_opt}
                                                value={Cases_opt.find((x) => x.value === Case_NAME) || null}
                                                // value={row.value || null}
                                                // isDisabled={row.disabled || false}
                                                closeMenuOnSelect={true}
                                                onChange={(val, el) =>
                                                  this.handleSelectChange(val, el, file.Server_File_id)
                                                }
                                                className="w-100"
                                              />
                                            </>
                                          ))(file.Case_NAME)}
                                        </td>
                                        <td>
                                          <Select
                                            name="Form"
                                            attr-id={file.File_id}
                                            // name={row.name}
                                            // id={row.name}
                                            // placeholder={row.placeholder || "Select..."}
                                            // isMulti={row.isMulti}
                                            // isClearable={true}
                                            options={Doc_forms_opt}
                                            value={Doc_forms_opt.find((x) => x.value === file.Form) || null}
                                            // value={row.value || null}
                                            // isDisabled={row.disabled || false}
                                            // closeMenuOnSelect={row.closeMenuOnSelect || false}
                                            // onChange={row.isMulti ? this.handleMultiSelectChange : this.handleSelectChange}
                                            onChange={(val, el) =>
                                              this.handleSelectChange(val, el, file.Server_File_id)
                                            }
                                            className="w-100"
                                          />
                                        </td>
                                      </tr>
                                    </>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td colSpan={8} className="justify-content-center">
                                      <div className="d-flex align-items-center justify-content-center">
                                        <div className="lds-spinner">
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </Table>
                        </AvCheckboxGroup>
                      </AvForm>
                    </CardBody>
                  </Card>
                </>
              ) : (
                <>
                <Card>
                <CardBody>
                  <Row>
                  <div
                    className="d-flex align-items-center justify-content-center w-100 font-weight-bold"
                    style={{ fontSize: "16px", color: "#f44336" }}
                  >
                    <i className="ri-file-warning-line mr-2"></i> Nothing found with the specified filters
                  </div>
                  </Row>
                  </CardBody>
                  </Card>
                </>
              )}
            </Pagination>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  User: state.User.data,
  cases: state.Case.cases,
  Doc_forms: state.Documents.Doc_form,
  Personnel: state.Personnel.personnel,
  Shared_Persons: state.Sync.Shared_Persons,
  Parsing_Steps: state.Sync.Parsing_Steps,

  sysInfo: state.Main.system,
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  fetchCases: () => dispatch(CaseActions.allCasesFetchRequested()),
  fetchDocForms: () => dispatch(DocsActions.docFormsFetchRequested()),

  fetchUser: () => dispatch(UserActions.userFetchRequested()),

  fetchSyncSharedPersons: (Person_id) => dispatch(SyncActions.syncSharedPersonsFetchRequested(Person_id)),
  fetchParsingSteps: () => dispatch(SyncActions.parsingStepsFetchRequested()),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("SYNCHRONIZATION")),
    hide: () => dispatch(PreloaderActions.hidePreloader("SYNCHRONIZATION")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Synchronization);
