import React, { Component } from "react";
import {
  Row,
  Container,
  Col,
  Card,
  CardBody,
  Media,
  Table,
  CardHeader,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
} from "reactstrap";

import * as ModalActions from "../../store/modal/actions";
import * as ProgressModalActions from "../../store/progress-modal/actions";

import DocsApi from "./../../api/DocsApi";
import { connect } from "react-redux";
import * as DocsActions from "./../../store/documents/actions";
import Select from "react-select";
import TrotlingBlocks from "../StyledComponents/TrotlingBlocks";
import { ipcRenderer } from "electron";
import DocNotes from "./DocNotes";
import DocLog from "./DocLog";
import ReactTooltip from "react-tooltip";
import { NavLink } from "react-router-dom";
import Icon from "react-icofont";
import combine from "../../routes/combine";

import NoImg from "./../../assets/images/noimg.png";

class DocumentsViewBlock extends Component {
  state = {
    chkBoxModel: [],
    isMainChecked: false,
    fileInd: 0,
    contextMenu: false,
    firstFile: {},
    ToShow: null,
    CurrentFilleId: null,
    DocumentEvents: [],
  };

  toggleOne = (e) => {
    let { chkBoxModel } = this.state;
    const { checked, name } = e.currentTarget;
    const { DocData } = this.state;
    const value = parseInt(e.currentTarget.value);

    if (checked === false && chkBoxModel.indexOf(value) >= 0)
      chkBoxModel.splice(chkBoxModel.indexOf(value), 1);
    if (checked === true) chkBoxModel.push(value);
    this.setState({
      chkBoxModel: chkBoxModel,
      isMainChecked: chkBoxModel.length === DocData.length,
    });
  };

  toggleAll = (e) => {
    let { chkBoxModel } = this.state;
    const { value, checked, name } = e.currentTarget;
    const { DocData } = this.state;

    chkBoxModel = [];
    if (checked === true) {
      DocData.map((x) => {
        chkBoxModel.push(parseInt(x.DOC_ID));
      });
    }
    this.setState({ chkBoxModel: chkBoxModel, isMainChecked: checked });
  };
  loadDocumentEvents = async () => {
    const { DOC_ID } = this.props.DOC_ID;
    const DocumentEvents = await DocsApi.fetchDocumentEvents(DOC_ID);
    this.setState({ DocumentEvents });
  };

  downloadFile = (downloadUrl) => {
    const { showProgressModal, hideProgressModal, User, sysInfo } = this.props;
    const { hostname: Computer_id } = sysInfo.os;
    const { Doc_files, CurrentFilleId } = this.state;
    const CurrentFile = Doc_files.find((x) => x.File_id === CurrentFilleId);
    const CurrentFileLocations = CurrentFile.locations.filter((x) => x.Computer_id !== "SERVER");

    let fileName = "";
    const Format = `${CurrentFile.Format}`;

    if(CurrentFileLocations.length){
      fileName = CurrentFileLocations[0].File_name;
    }

    showProgressModal("DOWNLOAD_FILE", {downloadUrl, Format, fileName, File_id: CurrentFilleId, Person_id: User.Person_id, Computer_id  });    
  }

  handleSelectChange = (el, e) => {
    const { value } = el;
    const { name } = e;
    this.setState({ [name]: value });
  };

  showFilePreview = (file) => {
    ipcRenderer.send("previewModal", { file });
  };

  openFile = (path) => {
    ipcRenderer.send("openFile", {path});
  }

  async componentDidMount() {
    this.setState({ ...this.props.documentData });
    // this.setState({ToShow: })
    await this.loadDocumentEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.documentData !== this.props.documentData) {
      this.setState({ ...this.props.documentData });
      if (this.props.documentData.Doc_files.length) {
        this.setState({
          CurrentFilleId: this.props.documentData.Doc_files[0].File_id,
        });
      }
    }
  }

  render() {
    const {
      Doc_files,
      fileInd,
      CurrentFilleId,
      DOCUMENT_NAME,
      Description,
      CREATED_DATE,
      FILED_DATE,
      CaseBg,
      File_dir,
      ToShow,
      Case_NAME,
      Case_Full_NAME,
      DOC_ID,
      firstFile,
      Person_id,
      Form,
      keywords,
      DocumentEvents,
      IN_PARSE,
    } = this.state;

    const { sysInfo } = this.props;
    const FilterMeta = [
      "SourceFile",
      "Title",
      "pages",
      "FilePermissions",
      "FileName",
      "FileModifyDate",
      "FileInodeChangeDate",
      "FileAccessDate",
      "Directory"
    ]
    const {hostname:Computer_id} = sysInfo.os;

    // const GetEvents = async () => {
    //   const DocsEvents = await DocsApi.fetchDocumentEvents(DOC_ID)
    //  console.log(DocsEvents);

    //   return DocsEvents
    // }
    //  GetEvents();
    const Preview =
      Doc_files && Doc_files.length ? Doc_files[0].Preview_img : false;

    const { hostInfo } = this.props;

    if (Doc_files === undefined) return null;
    const CurrentFile = Doc_files.find((x) => x.File_id === CurrentFilleId);
    if (CurrentFile === undefined)
      return (
        <>
          <TrotlingBlocks TRtype="page" />
        </>
      );
    const CurrentFileLocations = CurrentFile.locations.find((x) => x.Computer_id === "SERVER");
    const CurrentFileMeta = CurrentFile.meta;
    const ActuaFile = CurrentFileLocations ? 
      hostInfo.host.substr(0, hostInfo.host.length-1) + CurrentFileLocations.File_dir  + "/"  + CurrentFileLocations.File_name :
      null;
      
    return (
      <>
        <Row>
          <Col lg={9}>
            <Card>
              <CardBody className="docBar">
                <div className="d-flex flex-column justify-content-center">
                  <span className="AccentFont">File Version:</span>
                  <Select
                    onChange={this.handleSelectChange}
                    className="fileSelect"
                    name="CurrentFilleId"
                    options={Doc_files.map((x) => ({
                      label: x.CREATED_DATE,
                      value: x.File_id,
                    }))}
                    defaultValue={
                      Doc_files.map((x) => ({
                        label: x.CREATED_DATE,
                        value: x.File_id,
                      }))[0]
                    }
                  />
                </div>
                <div className="filesCount d-flex align-items-center mx-3">
                  <i className=" ri-git-branch-line font-size-22"></i>
                  {Doc_files.length} {Doc_files.length > 1 ? "files" : "file"}
                </div>
                {/* <div className="btns d-flex ">
                  <div className="font-size-12 AccentFont d-flex align-items-center pointer mr-2 nav_btns">
                    {" "}
                    <span className="ri-arrow-left-s-line font-size-16">
                      {" "}
                    </span>{" "}
                    Prev Version{" "}
                  </div>
                  <div className="font-size-12 AccentFont d-flex align-items-center pointer nav_btns">
                    Next Version{" "}
                    <span className="ri-arrow-right-s-line font-size-16">
                      {" "}
                    </span>
                  </div>
                </div> */}
                <div className="btns-block d-flex align-items-center">
                  <span
                    onClick={() =>
                      this.props.showModal("ATTACH_TO_EVENT", {
                        Doc_Data: this.state,
                      })
                    }
                    style={{ cursor: "pointer" }}
                    title="Attach to Event"
                  >
                    <i class="ri-attachment-2 font-size-22 "></i>
                  </span>
                  <span className="ml-2" style={{ cursor: "pointer" }}>
                    <i className="font-size-22   ri-folder-open-line "></i>
                  </span>
                  <span
                    className="ml-2 "
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.props.showModal("SHOW_FILE_PREIVIEW", {
                        ActuaFile: ActuaFile,
                        Format: CurrentFile.Format,
                      });
                    }}
                  >
                    <i className="font-size-22   ri-eye-line font-size"></i>
                  </span>
                  <span
                    // href={ActuaFile}
                    className="ml-2"
                    style={{ cursor: "pointer" }}
                    title="Download file"
                    onClick={() => this.downloadFile(ActuaFile)}
                  >
                    <i className="font-size-22   ri-file-download-line"></i>
                  </span>
                  {!IN_PARSE && (
                    <>
                      <span
                        className="ml-2"
                        style={{ cursor: "pointer" }}
                        title={`Delete ${CurrentFileLocations.File_name}`}
                      >
                        <i className="font-size-22   ri-delete-bin-line delIcon"></i>
                      </span>
                    </>
                  )}
                  
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-0">
                <Table className="customTable mb-0 ">
                  <thead>
                    <tr className="mx-3">
                      <td>Computer</td>
                      <td>Directory</td>
                      <td>Name</td>
                      <td>Format</td>
                      <td>Person</td>
                      <td>Upload Date</td>
                    </tr>
                  </thead>
                  <tbody>
                    {CurrentFile.locations.filter((x) => x.Computer_id !== "SERVER").length ?
                      CurrentFile.locations.filter((x) => x.Computer_id !== "SERVER").map((d) => (
                        <>
                          <tr className="mx-4">
                            <td>{d.Computer_id}</td>
                            <td>
                              {d.Computer_id === Computer_id ? (
                                <>
                                  <a href="#" onClick={() => this.openFile(`${d.File_dir}`)}>{d.File_dir}</a>
                                </>
                              ) : (
                                <>
                                   ${d.File_dir}
                                </>
                              )}
                            </td>
                            <td data-tip data-for="metadata">
                              {d.Computer_id === Computer_id ? (
                                <>
                                  <a href="#" onClick={() => this.openFile(`${d.File_dir}/${d.File_name}`)}>{d.File_name}</a>
                                </>
                              ) : (
                                <>
                                  {d.File_name} 
                                </>
                              )}
                              
                            </td>
                            <td>{CurrentFile.Format}</td>
                            <td>{d.Person_id}</td>
                            <td>{d.loaded_dt}</td>
                          </tr>
                        </>
                      )) : (
                        <>
                          <tr>
                            <td colSpan={6}>
                              File exists only on Server
                            </td>
                          </tr>
                        </>
                      )}
                  </tbody>
                </Table>
                <ReactTooltip id="metadata" aria-haspopup="true" role="example">
                  <div>
                    Pages:{" "}
                    {CurrentFileMeta.find((x) => x.Name === "pages") &&
                      CurrentFileMeta.find((x) => x.Name === "pages").Value}
                  </div>
                  <div>
                    Size:{" "}
                    {CurrentFileMeta.find((x) => x.Name === "file_size") &&
                      CurrentFileMeta.find((x) => x.Name === "file_size").Value}
                  </div>
                  <div>
                    Producer:{" "}
                    {CurrentFileMeta.find((x) => x.Name === "producer") &&
                      CurrentFileMeta.find((x) => x.Name === "producer").Value}
                  </div>
                </ReactTooltip>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Row>
                  <Col lg={8} style={{ borderRight: "1px solid #dadada" }}>
                    <DocNotes description={Description} DOC_ID={DOC_ID} Update={this.props.loadDocument}/>
                  </Col>
                  <Col lg={4}>
                    <DocLog />
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-0">
                <Table className="customTable mb-0 ">
                  <tbody>
                    <tr>
                      <td colSpan={2}>
                        <div className=" AccentFont">Document Metadata</div>
                      </td>
                    </tr>
                    {CurrentFileMeta.filter((x) => !FilterMeta.includes(x.Name)).map((x) => (
                      <tr>
                        <td className="AccentFont">{x.Name}</td>
                        <td>{x.Value}</td>
                      </tr>
                    ))}
                    {CurrentFileMeta.filter((x) => !FilterMeta.includes(x.Name)).length === 0 && (
                      <>
                        <tr>
                          <td colSpan={2}>No Metadata for this file</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col lg={3}>
            <Card>
              <CardBody>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="AccentFont mb-0">About</h5>
                    <Dropdown
                      isOpen={this.state.contextMenu}
                      direction="left"
                      toggle={() =>
                        this.setState({ contextMenu: !this.state.contextMenu })
                      }
                      className="contextMenuDrop"
                    >
                      <DropdownToggle tag="span">
                        <span className="" style={{ cursor: "pointer" }}>
                          <i className="font-size-22   ri-settings-5-line"></i>
                        </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          className="editDD d-flex align-items-center"
                          onClick={() => {
                            this.props.showModal("EDIT_DOCUMENT", {
                              DOC_ID: DOC_ID,
                              Case_NAME: Case_NAME,
                            });
                          }}
                        >
                          <i className="font-size-16    ri-pencil-line"></i>
                          Edit
                        </DropdownItem>
                        <DropdownItem className="editDD flex align-items-center ">
                          <NavLink to={`/file/${hostInfo.host + Preview}`}>
                            <i className="font-size-16    ri-hammer-line "></i>
                            Form Tools
                          </NavLink>
                        </DropdownItem>
                        <DropdownItem className="deleteDD d-flex align-items-center">
                          <i className="font-size-16   ri-delete-bin-line"></i>
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  <span className="AccentFont">{DOCUMENT_NAME}</span>
                  {true && (
                    <>
                      <div
                        className="document-preview-block d-flex justify-content-center position-relative my-2"
                        style={{ maxWidth: "100%" }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center document-preview-block-image"
                          style={{
                            overflow: "hidden",
                            maxWidth: "100%",
                            maxHeight: "150px",
                            paddingBottom: "10px",
                          }}
                        >
                          <img
                            src={Preview ? hostInfo.host + Preview.substr(1) : NoImg}
                            alt={DOCUMENT_NAME}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div
                          className="document-preview-block-overlay position-absolute"
                          onClick={() => {
                            this.props.showModal("SHOW_FILE_PREIVIEW", {
                              ActuaFile: ActuaFile,
                              Format: CurrentFile.Format,
                            });
                          }}
                        >
                          <i className="ri-zoom-in-line"></i>
                        </div>
                      </div>
                    </>
                  )}
                  {/* <div className="">{Description}</div> */}
                  <div className="mt-2">
                    <div className="AccentFont">Case</div>
                    <span>{Case_Full_NAME}</span>

                    <div className="fastEditField ">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="AccentFont">Form</div>
                        {Form === "UNCLASSIFIED" && (
                          <>
                            <div>
                              <Icon
                                icon="icofont-edit-alt pointer"
                                onClick={() => {
                                  this.props.showModal("CHANGE_DOC_FORM", {
                                    DOC_ID: DOC_ID,
                                    DocName: DOCUMENT_NAME,
                                  });
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <span>{Form}</span>
                  </div>

                  <hr />
                </div>
                <div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="AccentFont">Created Date</span>
                  </div>
                  <span className="">{CREATED_DATE}</span>
                  {FILED_DATE !== null && (
                    <>
                      <div
                        className="d-flex align-items-center justify-content-between"
                        style={{ color: "#e91e63" }}
                      >
                        <span className="AccentFont">Filed Date</span>
                      </div>
                      <span className="">{FILED_DATE}</span>
                    </>
                  )}

                  <hr />
                </div>

                <div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="AccentFont">Keywords</span>
                  </div>

                  <div className="mt-1 keyworsHolder">
                    {keywords.map((x) => (
                      <div
                        className="keywordTag"
                        key={x}
                        onClick={() => {
                          this.props.showModal("DELETE_KEYWORD", {
                            DOC_ID: DOC_ID,
                            Keyword: x,
                            onSuccess: () => {
                              this.setState({
                                keywords: keywords.filter((key) => key !== x),
                              });
                            },
                          });
                        }}
                      >
                        {x}
                      </div>
                    ))}

                    <div
                      className="addKeyword"
                      onClick={() => {
                        this.props.showModal("ADD_KEYWORDS", {
                          DOC_ID: DOC_ID,
                          DOCUMENT_NAME: DOCUMENT_NAME,
                          onSuccess: (NEW_KEYWORDS) => {
                            this.setState({
                              keywords: [...keywords, ...NEW_KEYWORDS],
                            });
                          },
                        });
                      }}
                    >
                      <i className=" ri-add-line"></i> Add More
                    </div>
                  </div>
                  <hr />
                </div>

                <div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="AccentFont">Owner</span>
                  </div>
                  <span className="">{Person_id}</span>
                </div>
                {DocumentEvents.length > 0 && (
                  <div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="AccentFont">Document Events</span>
                  </div>
                  {DocumentEvents.map((x) => (
                    <NavLink to={combine("SINGLE_EVENT", {Activity_Name: x.Activity_Name})}> {x.Activity_Title} </NavLink>
                  ))}
                </div>
          )}
              </CardBody>
            </Card>
          </Col>
          {/* <ViewFileModal/> */}
        </Row>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  hostInfo: state.Main.hostInfo,
  User: state.User.data,

  sysInfo: state.Main.system,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  showProgressModal: (type, props) => dispatch(ProgressModalActions.showModal(type, props)),
  hideProgressModal: ({type, props, _id}) => dispatch(ProgressModalActions.hideModal({type, props, _id})),
  fetchDocForms: () => dispatch(DocsActions.docFormsFetchRequested()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsViewBlock);
