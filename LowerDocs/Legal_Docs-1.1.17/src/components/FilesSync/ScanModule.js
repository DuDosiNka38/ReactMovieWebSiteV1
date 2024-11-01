import React, { Component } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  CardHeader,
  Button,
  Label,
  Table,
  Input,
  FormGroup,
} from "reactstrap";
import {
  AvForm,
  AvField,
  AvInput,
  AvGroup,
  AvCheckbox,
  AvCheckboxGroup,
} from "availity-reactstrap-validation";
import { connect } from "react-redux";
import * as actions from "../../store/user/actions";
import Slider, { SliderTooltip } from "rc-slider";
import Select from "react-select";
import "rc-slider/assets/index.css";
import { ipcRenderer } from "electron";
import fn from "./../../services/functions";
import Pagination from "./../../services/pagination";
import {Link} from 'react-router-dom'

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={`${value} MB`}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};
class ScanModule extends Component {

  state = {
    fileSize: [],
    extensions: [],
    folderCheckbox: {},
    chkBoxModel: null,
    modalStep: "SCANNED_FILES",
    rangeValue: [0, null],
    dirCheckbox: {},
    toggleAlreadySynced: false,
    toggleTables: {},
    tableSearch: {},
    tablePagination: {},
    order: {},
    hideAllTables: true,
  };

  onSelectChange = this.onSelectChange.bind(this);
  onSliderChange = this.onSliderChange.bind(this);
  onCheckboxChange = this.onCheckboxChange.bind(this);
  onDirCheckboxChange = this.onDirCheckboxChange.bind(this);
  setCheckedFiles = this.setCheckedFiles.bind(this);
  tableSearch = this.tableSearch.bind(this);
  clearSearch = this.clearSearch.bind(this);
  searchFilter = this.searchFilter.bind(this);
  getPageRows = this.getPageRows.bind(this);

  onSelectChange(el, e) {
    this.setState({ extensions: el });
  }

  onSliderChange(value) {
    this.setState({
      rangeValue: value,
    });
  }

  onValidSubmit = (event, values) => {
    const { personeData } = this.props;
    const { chkBoxModel, extensions, rangeValue } = this.state;

    const { getGlobal, data } = this.props;
    const {
      CHECK_LOCATIONS,
      FINDED_FILES,
      EXITING_ON_SERVER,
      MAX_FILE_SIZE,
      MAX_FILE_SIZE_MB,
    } = data;

    const formats = getGlobal.File_Formats;
    const formatsArr =
      extensions.length === 0
        ? formats.map((x) => `.${x.Format}`)
        : extensions.map((x) => `.${x.value}`);

    if (rangeValue[1] === 0 || rangeValue[1] === null)
      rangeValue[1] = MAX_FILE_SIZE_MB;

    const minSize = rangeValue[0] * 1024 * 1024;
    const maxSize = rangeValue[1] * 1024 * 1024;

    let filtered = {};

    for (let dir in chkBoxModel) {
      filtered[dir] = [];
      chkBoxModel[dir].forEach((fPath) => {
        const fData = FINDED_FILES.find((x) => x.dir === dir).files.find(
          (x) => x.File_path === fPath
        );
        if (
          formatsArr.includes(fData.File_ext) === true &&
          fData.File_size_bytes >= minSize &&
          fData.File_size_bytes <= maxSize
        )
          filtered[dir].push(fPath);
      });
    }

    ipcRenderer.send("startSync", {
      Person_id: personeData.Person_id,
      data: filtered,
    });
  };

  onCheckboxChange(e, v) {
    let { chkBoxModel } = this.state;
    const { value, checked, name } = e.currentTarget;
    if (name === "check-dir") {
      e.currentTarget.checked = false;
    } else {
      const folder = e.currentTarget.getAttribute("attr-folder");

      if (checked === false)
        chkBoxModel[folder] = chkBoxModel[folder].filter((x) => x !== value);

      if (checked === true) chkBoxModel[folder].push(value);

      this.setState({ chkBoxModel: chkBoxModel });
    }
  }

  onDirCheckboxChange(e, v) {
    const { getGlobal, data } = this.props;
    let { chkBoxModel, dirCheckbox, rangeValue, extensions } = this.state;
    const {
      CHECK_LOCATIONS,
      FINDED_FILES,
      EXITING_ON_SERVER,
      MAX_FILE_SIZE,
      MAX_FILE_SIZE_MB,
    } = data;
    const formats = getGlobal.File_Formats;
    const formatsArr =
      extensions.length === 0
        ? formats.map((x) => `.${x.Format}`)
        : extensions.map((x) => `.${x.value}`);
    const { value, checked, name } = e.currentTarget;
    if (rangeValue[1] === 0 || rangeValue[1] === null)
      rangeValue[1] = MAX_FILE_SIZE_MB;

    const minSize = rangeValue[0] * 1024 * 1024;
    const maxSize = rangeValue[1] * 1024 * 1024;

    dirCheckbox[name] = checked;

    this.setState({ dirCheckbox: dirCheckbox });

    if (checked === false) {
      chkBoxModel[name] = [];
    } else {
      chkBoxModel[name] = [];

      FINDED_FILES.find((x) => x.dir === name).files.forEach((file) => {
        if (
          formatsArr.includes(file.File_ext) &&
          file.File_size_bytes >= minSize &&
          file.File_size_bytes <= maxSize
        )
          chkBoxModel[name].push(file.File_path);
      });
    }

    this.setState({ chkBoxModel: chkBoxModel });
  }

  setCheckedFiles() {
    let { folderCheckbox, rangeValue, extensions, order, toggleTables } = this.state;
    const { getGlobal, data } = this.props;
    const {
      CHECK_LOCATIONS,
      FINDED_FILES,
      EXITING_ON_SERVER,
      MAX_FILE_SIZE,
      MAX_FILE_SIZE_MB,
    } = data;
    const formats = getGlobal.File_Formats;
    const formatsArr =
      extensions.length === 0
        ? formats.map((x) => `.${x.Format}`)
        : extensions.map((x) => `.${x.value}`);

    if (rangeValue[1] === 0 || rangeValue[1] === null)
      rangeValue[1] = MAX_FILE_SIZE_MB;

    const minSize = rangeValue[0] * 1024 * 1024;
    const maxSize = rangeValue[1] * 1024 * 1024;

    let chkBoxModel = {};

    FINDED_FILES.forEach((row) => {
      chkBoxModel[row.dir] = [];
      order[row.dir] = {orderField: "File_create_date", orderType: "DESC"};
      toggleTables[row.dir] = true;

      row.files.forEach((file) => {
        if (
          formatsArr.includes(file.File_ext) &&
          file.File_size_bytes >= minSize &&
          file.File_size_bytes <= maxSize && 
          file.File_status === "NEW"
        )
          chkBoxModel[row.dir].push(file.File_path);
      });
    });

    this.setState({ chkBoxModel: chkBoxModel, order: order, toggleTables: toggleTables });
  }

  getExtIcon(ext) {
    // const {ext} = props;
    const icons = {
      ".csv": (
        <>
          <i style={{ color: "#009688" }} class="fas fa-file-csv"></i>
        </>
      ),
      ".doc": (
        <>
          <i style={{ color: "#2196f3" }} class="fas fa-file-word"></i>
        </>
      ),
      ".docx": (
        <>
          <i style={{ color: "#2196f3" }} class="fas fa-file-word"></i>
        </>
      ),
      ".jpeg": (
        <>
          <i style={{ color: "#e69325" }} class="fas fa-file-image"></i>
        </>
      ),
      ".pdf": (
        <>
          <i style={{ color: "#F44336" }} class="fas fa-file-pdf"></i>
        </>
      ),
      ".pdf_ocr": (
        <>
          <i style={{ color: "#F44336" }} class="fas fa-file-pdf"></i>
        </>
      ),
      ".xls": (
        <>
          <i style={{ color: "#009688" }} class="fas fa-file-excel"></i>
        </>
      ),
      ".xlsx": (
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

  printCurrentFile(event, args) {
    console.log(args);
  }

  tableSearch(e) {
    const { tableSearch } = this.state;
    const { name, value } = e.currentTarget;
    tableSearch[name] = value;
    this.setState({ tableSearch: tableSearch });
  }

  clearSearch(e) {
    const { tableSearch } = this.state;
    const name = e.currentTarget.getAttribute("name");
    tableSearch[name] = "";
    this.setState({ tableSearch: tableSearch });
  }

  searchFilter(dir, files) {
    const { tableSearch } = this.state;

    if (!tableSearch.hasOwnProperty(dir)) return files;

    const needle = tableSearch[dir].toLowerCase();

    return files.filter((x) => {
      let result = false;

      for (let k in x) {
        if (typeof x[k] === "string") {
          const tmp = x[k].toLowerCase();
          if (tmp.indexOf(needle) !== -1) result = true;
        }
      }

      return result;
    });
  }

  getPageRows(dir, files) {
    let { tablePagination, order } = this.state;

    let RESULT = files;

    if(tablePagination.hasOwnProperty(dir) && files.length > 10){
      const { offset, pageLimit } = tablePagination[dir];

      RESULT = files.slice(offset, offset + pageLimit);      
    }

    if(order.hasOwnProperty(dir)){
      const {orderType, orderField} = order[dir];

      if(orderType === "ASC")
        RESULT = RESULT.sort((a, b) => a[orderField] > b[orderField] ? 1 : -1);

      if(orderType === "DESC")
        RESULT = RESULT.sort((a, b) => a[orderField] < b[orderField] ? 1 : -1);
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
    const { order } = this.state;
    const DIR = e.currentTarget.getAttribute("name");
    const orderField = e.currentTarget.getAttribute("value");

    if(!order.hasOwnProperty(DIR)){
      order[DIR] = {orderField: orderField, orderType: "ASC"};
    }

    if(order[DIR].orderField === orderField){
      order[DIR].orderType = order[DIR].orderType === "ASC" ? "DESC" : "ASC";
    } else {
      order[DIR].orderField = orderField;
      order[DIR].orderType = "ASC";
    }

    this.setState({order: order});
  }

  getOrderArrow = (dir, field) => {
    const { order } = this.state;

    if(!order.hasOwnProperty(dir) || order.hasOwnProperty(dir) && order[dir].orderField !== field)
      return null;

    const { orderType } = order[dir];
    
    if(orderType === "ASC")
      return <><i class="ri-sort-asc"></i></>

    if(orderType === "DESC")
      return <><i class="ri-sort-desc"></i></>

    return null;
  }

  getToggleTableIcon = (dir) => {
    const { toggleTables } = this.state;

    if(toggleTables.hasOwnProperty(dir))
      return toggleTables[dir] === true ? <><i class="ri-eye-line" attr-folder={dir} onClick={this.toggleTable}></i></> : <><i class="ri-eye-off-line" attr-folder={dir} onClick={this.toggleTable}></i></>;

    return <><i class="ri-eye-line" attr-folder={dir} onClick={this.toggleTable}></i></>;
  }

  toggleTable = (e) => {
    const dir = e.currentTarget.getAttribute("attr-folder");
    const { toggleTables } = this.state;

    if(toggleTables.hasOwnProperty(dir))
      toggleTables[dir] = !toggleTables[dir];
    else 
      toggleTables[dir] = false;

    this.setState({toggleTables: toggleTables});
  }

  hideAllTables = () => {
    const { toggleTables, hideAllTables } = this.state;
    const set = !hideAllTables;

    for(let key in toggleTables){
      toggleTables[key] = set;
    }

    this.setState({toggleTables: toggleTables, hideAllTables: set})
  }
  componentDidMount() {
    const { MAX_FILE_SIZE_MB } = this.props.data;
    this.setCheckedFiles();
    ipcRenderer.on("currentUploadedFile", this.printCurrentFile);
    this.setState({ rangeValue: [0, MAX_FILE_SIZE_MB] });
  }

  render() {
    const {
      chkBoxModel,
      rangeValue,
      extensions,
      dirCheckbox,
      toggleAlreadySynced,
      toggleTables      
    } = this.state;
    const minSize = rangeValue[0] * 1024 * 1024;
    const maxSize = rangeValue[1] * 1024 * 1024;

    if (chkBoxModel === null) return <></>;

    const { getGlobal, data } = this.props;
    const {
      CHECK_LOCATIONS,
      FINDED_FILES,
      EXITING_ON_SERVER,
      MAX_FILE_SIZE,
      MAX_FILE_SIZE_MB,
      TOTAL_FILES_SIZE,
      TOTAL_FILES,
      TOTAL_SCANNED_DIRS,
    } = data;
    const formats = getGlobal.File_Formats;
    const formatsArr =
      extensions.length === 0
        ? formats.map((x) => `.${x.Format}`)
        : extensions.map((x) => `.${x.value}`);

    const formatOptions = formats
      .filter((x) => x.Format !== "DEFAULT")
      .map((x) => ({
        name: "File_ext",
        label: x.Format,
        value: x.Format,
      }));

    const filterFiles = (files) => {
      return files
        .filter(
          (file) =>
            (file.File_status === "NEW" && toggleAlreadySynced === true) ||
            toggleAlreadySynced === false
        )
        .filter((x) => formatsArr.includes(x.File_ext) === true)
        .filter(
          (x) => x.File_size_bytes >= minSize && x.File_size_bytes <= maxSize
        );
    };

    const filterUploaded = (files) => {
      return files.filter((x) => x.File_status === "NEW");
    };

    const filterChecked = (dir, files) => {
      return files.filter((x) => chkBoxModel[dir].includes(x.File_path));
    };

    return (
      <>
        <Card>
          <CardBody>
            <div className="SyncHolder">
              <div className="toolbar"></div>
              <div className="selectionSyncFiles">
                <AvForm onValidSubmit={this.onValidSubmit}>
                  <h5>SELECT FILES TO Synchronize </h5>
                  <div className="scanInfo my-3">
                    <h6>Scan Information</h6>
                    <Row>
                      <Col lg={4} className="scan-info-label">
                       <Link to ="/app/settings">
                       <i class="ri-folders-line"></i> total scanned dirs:
                       </Link>
                      </Col>
                      <Col className="scan-info-value">
                        {TOTAL_SCANNED_DIRS}
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col lg={4} className="scan-info-label">
                        <i class="ri-file-search-line"></i> TOTAL FILES to Synchronize:
                      </Col>
                      <Col className="scan-info-value">{TOTAL_FILES}</Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col lg={4} className="scan-info-label">
                        <i class="ri-u-disk-line"></i> TOTAL SIZE  to Synchronize:
                      </Col>
                      <Col className="scan-info-value">{TOTAL_FILES_SIZE}</Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col lg={4} className="scan-info-label">
                        <i class="ri-file-add-fill"></i> TOTAL SELECTED FILES:
                      </Col>
                      <Col className="scan-info-value">
                        {(() => {
                          let count = 0;
                          FINDED_FILES.map((x) => {
                            count += filterChecked(
                              x.dir,
                              filterUploaded(filterFiles(x.files))
                            ).length;
                          });

                          return count;
                        })()}
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col lg={4} className="scan-info-label">
                        <i class="ri-u-disk-line"></i>total selected files size:
                      </Col>
                      <Col className="scan-info-value">
                        {(() => {
                          let totalSize = 0;
                          FINDED_FILES.map((x) => {
                            filterChecked(
                              x.dir,
                              filterUploaded(filterFiles(x.files))
                            ).map((file) => {
                              totalSize += file.File_size_bytes;
                            });
                          });

                          return fn.convertBytesToNormal(totalSize);
                        })()}
                      </Col>
                    </Row>
                  </div>
                  <div className="fileFilters my-3">
                    <h6>Filters</h6>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Label>by File EXTENSION </Label>
                          <Select
                            placeholder="Select file extensions"
                            options={formatOptions}
                            isMulti={true}
                            onChange={this.onSelectChange}
                            name="File_ext"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            closeMenuOnSelect={false}
                          ></Select>
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <Label>by File Size</Label>
                          <div>
                            {`${this.state.rangeValue[0]} MB`} -{" "}
                            {`${this.state.rangeValue[1]} MB`}
                          </div>
                          <Range
                            onChange={this.onSliderChange}
                            min={0}
                            max={MAX_FILE_SIZE_MB}
                            defaultValue={this.state.rangeValue}
                            tipFormatter={(value) => `${value} MB`}
                            allowCross={false}
                            trackStyle={[{ backgroundColor: "#5664d2" }]}
                            railStyle={{ backgroundColor: "#dcdcdc" }}
                            activeDotStyle={{ backgroundColor: "#5664d2" }}
                            handleStyle={[{ backgroundColor: "#5664d2" }]}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={3}>
                        <FormGroup>
                          <Label>Show ALREADY SYNCED FILES?</Label>
                          <div className="d-flex align-items-center">
                            <Label className="mr-2">No</Label>
                            <div
                              className="custom-control custom-switch mb-2 d-flex "
                              // dir="ltr"
                            >
                              <Input
                                type="checkbox"
                                className="custom-control-input"
                                id="customSwitch2"
                                defaultChecked 
                              />
                              <Label
                                className="custom-control-label"
                                htmlFor="customSwitch2"
                                onClick={(e) => {
                                  this.setState({
                                    toggleAlreadySynced:
                                      !this.state.toggleAlreadySynced,
                                  });
                                }}
                              >
                                Yes
                              </Label>
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg={3}>
                        <FormGroup>
                          <Label>Collapse all tables? </Label>
                          <div className="d-flex align-items-center">
                            <Label className="mr-2">
                            <i class="ri-eye-line"></i>
                            </Label>
                            <div
                              className="custom-control custom-switch hideAllTables mb-2 d-flex "
                              // dir="ltr"
                            >
                              <Input
                                type="checkbox"
                                className="custom-control-input"
                                id="hideAllTables"
                                // defaultChecked = {}
                              />
                              <Label
                                className="custom-control-label"
                                htmlFor="hideAllTables"
                                onClick={this.hideAllTables}
                              >
                                <i class="ri-eye-off-line"></i>
                              </Label>
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  {FINDED_FILES.map((x) => (
                    <>
                      {filterFiles(x.files).length > 0 && (
                        <>
                          <Row>
                            <Col lg={9}>
                              <h4 className=" d-flex align-items-center scaningDirHeader">
                                <span className="scaningDir">
                                  {x.dir}{" "}
                                  <span className="folder-files-count">
                                    {filterFiles(x.files).length}
                                  </span>
                                  <span className="folder-files-toggle">
                                    {this.getToggleTableIcon(x.dir)}
                                  </span>
                                </span>
                              </h4>
                            </Col>
                            <Col className="search-row">
                              <Input
                                className="table-search"
                                onChange={this.tableSearch}
                                name={x.dir}
                                value={
                                  this.state.tableSearch.hasOwnProperty(x.dir)
                                    ? this.state.tableSearch[x.dir]
                                    : ""
                                }
                                type="text"
                                placeholder="Click to Search"
                              />
                              <i
                                class="ri-close-line"
                                onClick={this.clearSearch}
                                name={x.dir}
                              ></i>
                            </Col>
                          </Row>

                          <AvCheckboxGroup
                            name={x.dir}
                            className="scrollHolder"
                          >
                            {/* <HorizontalScroll className="noAbs"> */}
                            <Table
                              className={`table d-block table-striped table-hover h-auto table-sm responsive syncTable`}
                            >
                              <thead>
                                <tr>
                                  <td className="text-center pl-2 nowrap sync-file-chk">
                                    <AvCheckbox
                                      checked={
                                        this.state.hasOwnProperty(
                                          "dirCheckbox"
                                        ) &&
                                        this.state.dirCheckbox[x.dir] !==
                                          undefined
                                          ? this.state.dirCheckbox[x.dir]
                                          : true
                                      }
                                      customInput
                                      value={x.dir}
                                      name={x.dir}
                                      onChange={this.onDirCheckboxChange}
                                    />
                                  </td>
                                  <td className="sync-file-name order-button" name={x.dir} value={"File_name"} onClick={this.orderBy}>Name {this.getOrderArrow(x.dir, "File_name")}</td>
                                  <td className="sync-file-path order-button" name={x.dir} value={"File_path"} onClick={this.orderBy}>Path {this.getOrderArrow(x.dir, "File_path")}</td>
                                  <td className="sync-file-size order-button" name={x.dir} value={"File_size_bytes"} onClick={this.orderBy}>Size {this.getOrderArrow(x.dir, "File_size_bytes")}</td>
                                  <td className="sync-file-date order-button" name={x.dir} value={"File_create_date"} onClick={this.orderBy}>Create Date {this.getOrderArrow(x.dir, "File_create_date")}</td>
                                </tr>
                              </thead>
                              <tbody className={toggleTables[x.dir] !== undefined && toggleTables[x.dir] === false ? "hideSyncTable" : "showSyncTable"}>
                                {this.getPageRows(
                                  x.dir,
                                  this.searchFilter(x.dir, filterFiles(x.files))
                                ).map((file) => (
                                  <>
                                    <tr key={file.File_hash}>
                                      <td className="text-center pl-2 nowrap sync-file-chk">
                                        {file.File_status === "NEW" ? (
                                          <>
                                            <AvCheckbox
                                              customInput
                                              value={file.File_path}
                                              name={file.File_path}
                                              attr-folder={x.dir}
                                              onChange={this.onCheckboxChange}
                                              checked={
                                                chkBoxModel[x.dir].includes(
                                                  file.File_path
                                                )
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </>
                                        ) : (
                                          <>
                                            <i class="ri-check-line"></i>
                                          </>
                                        )}
                                      </td>
                                      <td
                                        className="sync-file-name"
                                        title={file.File_name}
                                      >
                                        <a
                                          href="#"
                                          onClick={() =>
                                            fn.openFile(file.File_path)
                                          }
                                        >
                                          {this.getExtIcon(file.File_ext)}{" "}
                                          {file.File_name}
                                        </a>
                                      </td>
                                      <td
                                        className="sync-file-path"
                                        title={file.File_path.replace(
                                          file.File_name,
                                          ""
                                        )}
                                      >
                                        <a
                                          href="#"
                                          onClick={() =>
                                            fn.openFolder(
                                              file.File_path.replace(
                                                file.File_name,
                                                ""
                                              )
                                            )
                                          }
                                        >
                                          {file.File_path.replace(
                                            x.dir,
                                            "..."
                                          ).replace(file.File_name, "")}
                                        </a>
                                      </td>
                                      <td className="sync-file-size">
                                        {file.File_size}
                                      </td>
                                      <td className="sync-file-date">
                                        {file.File_create_date}
                                      </td>
                                    </tr>
                                  </>
                                ))}
                              </tbody>
                            </Table>
                            {/* </HorizontalScroll> */}
                          </AvCheckboxGroup>
                          {this.searchFilter(x.dir, filterFiles(x.files)).length > 10 && (toggleTables[x.dir] === true || toggleTables[x.dir] === undefined) && 
                          <>
                            <Pagination
                              name={x.dir}
                              totalRecords={this.searchFilter(x.dir, filterFiles(x.files)).length}
                              pageLimit={10}
                              pageNeighbours={1}
                              onPageChanged={this.onPageChanged}
                            />
                          </>
  }
                          <hr/>
                        </>
                      )}
                    </>
                  ))}
                  <Button type="submit" color="success">
                    Submit
                  </Button>
                </AvForm>
              </div>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    getGlobal: state.User.globalData,
    personeData: state.User.persone,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanModule);
