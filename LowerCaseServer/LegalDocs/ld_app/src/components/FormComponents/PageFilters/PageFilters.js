import {
  AvForm,
  AvField,
  AvGroup,
  AvInput,
  AvFeedback,
  AvRadioGroup,
  AvRadio,
  AvCheckboxGroup,
  AvCheckbox,
} from "availity-reactstrap-validation";

import React, { Component } from "react";
import Select from "react-select";
import {
  CardBody,
  Col,
  FormGroup,
  Label,
  Row,
  Button,
  CustomInput,
} from "reactstrap";
import DatePicker from "react-datepicker";

import "./styles.scss";
import "react-datepicker/dist/react-datepicker.css";

class PageFilters extends Component {
  constructor(props) {
    super(props);
    this.setComponents();
  }

  params = {};
  state = {
    firstMount: true,
    Search: "",
  };

  setComponents = () => {
    const { firstMount } = this.state;

    const PageFilterComponents = this.props.components || {};

    this.params.Search = PageFilterComponents.Search || null;
    this.params.Searches = PageFilterComponents.Searches || null;
    this.params.Selects = PageFilterComponents.Selects || null;
    this.params.DatePickers = PageFilterComponents.DatePickers || null;
    this.params.OrderBy = PageFilterComponents.OrderBy || null;

    if (this.params.Search && this.params.Search.SearchFields) {
      const checked = this.params.Search.SearchFields.filter(
        (x) => x.isChecked
      );
      this.setState({ SearchFields: [...checked.map((x) => x.value)] });
    }

    if (this.params.Searches && firstMount) {
      this.params.Searches.map((srch) => {
        const { name } = srch;
        this.setState({ [name]: this.params.Searches.defaultValue || null });
      });
    }

    if (this.params.Selects && firstMount) {
      this.params.Selects.map((sel) => {
        const { name } = sel;
        this.setState({ [name]: this.params.Selects.defaultValue || null });
      });
    }

    if (this.params.OrderBy && firstMount) {
      const { name } = this.params.OrderBy;
      if (this.state[name] === undefined) {
        this.setState({
          [name]: {
            field: this.params.OrderBy.value || null,
            type: this.params.OrderBy.defaultType || "ASC",
          },
        });
      }
    }

    if (this.params.DatePickers && firstMount) {
      this.params.DatePickers.map((sel) => {
        const { type, name } = sel;

        if (type === "RANGE") {
          const { start, end } = sel;
          this.setState({
            [name]: {
              start: new Date(start.minDate),
              end: new Date(end.maxDate),
            },
          });
        }
      });
    }

    if(firstMount)
      this.setState({firstMount: false})
  };

  handleInputChange = (e, val) => {
    const { name } = e.currentTarget;
    this.setState({ [name]: val });
  };

  clearInput = (name) => {
    this.setState({ [name]: "" });
  };

  handleCheckboxChange = (e, value) => {
    const { name } = e.currentTarget;
    const stateName = e.currentTarget.getAttribute("attr-state-name");
    if (stateName) {
      const data = this.state[stateName];

      if (value) {
        if (data.indexOf(name) === -1) data.push(name);
      } else {
        if (data.indexOf(name) !== -1) data.splice(data.indexOf(name), 1);
      }

      this.setState({ [stateName]: data });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleSelectChange = (val, el) => {
    const { name, action } = el;

    switch (action) {
      case "select-option":
        const { value } = val;
        this.setState({ [name]: value });
        break;

      case "clear":
        this.setState({ [name]: null });
        break;

      default:
        break;
    }
  };

  handleMultiSelectChange = (values, el) => {
    const { name, action } = el;

    switch (action) {
      case "select-option":
        this.setState({ [name]: [...values.map((x) => x.value)] });
        break;

      case "clear":
        this.setState({ [name]: null });
        break;

      default:
        const val = [...values.map((x) => x.value)];
        this.setState({ [name]: val.length > 0 ? val : null });
        break;
    }
  };

  handleOrderChange = (val, el) => {
    const { name, action } = el;

    switch (action) {
      case "select-option":
        const { value } = val;
        this.setState({ [name]: { ...this.state[name], field: value } });
        break;

      default:
        break;
    }
  };

  handleDateChange = (e, name, type) => {
    const stateVal = this.state[name] || {};
    stateVal[type] = new Date(e);

    this.setState({ [name]: stateVal });
  };

  submitFilters = () => {
    const { onSubmit } = this.props;

    console.log({state: this.state})

    if(this.props.name)
      sessionStorage.setItem(`PageFilters/${this.props.name}`, JSON.stringify(this.state));

    if (onSubmit) {
      onSubmit(this.state);
    }
  };

  toggleOrderSort = (type, name) => {
    const order = this.state[name];
    this.setState({ [name]: { ...order, type } });
  };

  componentDidMount() {
    this.setComponents();

    // if(this.props.name){
    //   const data = sessionStorage.getItem(`PageFilters/${this.props.name}`);

    //   setTimeout( () => {
    //     this.setState({...JSON.parse(data)});
    //   }, 500);      
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.components !== this.props.components) {
      this.setComponents();
    }
  }

  componentWillUnmount() {
    console.log("unmount")
  }
  

  render() {
    const { Search, Searches, Selects, DatePickers, OrderBy } = this.params;
    // const {  } = this.state;

    return (
      <>
        <CardBody className="page-filters">
          <AvForm>
            <div className="filters-grid">
              {Search && (
                <FormGroup
                  className={`filter-form-group-custom ${
                    Search.SearchFields && "with-padding"
                  } filter-search-grid`}
                >
                  <div className="position-relative">
                    <i class="ri-search-2-line"></i>
                    <Label htmlFor="Search" className="input-label">
                      Search
                    </Label>
                    <AvField
                      name="Search"
                      type="text"
                      className="form-control mb-0"
                      id="Search"
                      value={this.state.Search}
                      placeholder={Search.placeholder}
                      onChange={this.handleInputChange}
                    />
                    <i
                      class="ri-close-line"
                      style={{ left: "auto", right: "10px" }}
                      onClick={() => this.clearInput("Search")}
                    ></i>
                  </div>
                  {Search.SearchFields && (
                    <>
                      <div className="d-flex align-items-center">
                        {Search.SearchFields.map((field) => (
                          <AvInput
                            tag={CustomInput}
                            type="checkbox"
                            attr-state-name="SearchFields"
                            label={field.label}
                            name={field.value}
                            disabled={field.isDisabled || false}
                            value={field.isChecked || false}
                            onChange={this.handleCheckboxChange}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </FormGroup>
              )}
              {Searches && Searches.map((row) => (
                <>
                  <FormGroup
                    className={`filter-form-group-custom`}
                  >
                    <div className="position-relative">
                      <i class="ri-search-2-line"></i>
                      <Label htmlFor="Search" className="input-label">
                        {row.label || "-"}
                      </Label>
                      <AvField
                        name={row.name || null}
                        type="text"
                        className="form-control mb-0"
                        id={row.name || null}
                        value={this.state[row.name]}
                        placeholder={row.placeholder || null}
                        onChange={this.handleInputChange}
                      />
                      <i
                        class="ri-close-line"
                        style={{ left: "auto", right: "10px" }}
                        onClick={() => this.clearInput(row.name)}
                      ></i>
                    </div>
                  </FormGroup>
                </>
              ))}
            </div>
            <div className="filters-grid">
              {Selects &&
                Selects.map((row) => (
                  <>
                    <FormGroup
                      className="with-padding"
                      style={
                        row.overlay
                          ? { border: `1px solid ${row.overlayColor}` }
                          : null
                      }
                    >
                      <Label for={row.name}>{row.label}</Label>
                      <Select
                        name={row.name}
                        id={row.name}
                        placeholder={row.placeholder || "Select..."}
                        isMulti={row.isMulti}
                        isClearable={true}
                        options={row.options || null}
                        defaultValue={row.defaultValue || null}
                        // value={row.value || null}
                        // menuIsOpen={true}
                        isDisabled={row.disabled || false}
                        closeMenuOnSelect={row.closeMenuOnSelect || false}
                        onChange={
                          row.isMulti
                            ? this.handleMultiSelectChange
                            : this.handleSelectChange
                        }
                        className="Select_Statick"
                      />
                    </FormGroup>
                  </>
                ))}
              {DatePickers &&
                DatePickers.map((row) =>
                  row.type === "RANGE" ? (
                    <FormGroup
                      className="datepicker-form with-padding range"
                      style={
                        row.overlay
                          ? { border: `1px solid ${row.overlayColor}` }
                          : null
                      }
                    >
                      <Label for={row.name}>{row.label}</Label>
                      <Row>
                        <Col className="d-flex justify-content-between">
                          <div className="position-relative w-100">
                            <i class="ri-calendar-2-line"></i>
                            <Label className="start">Start Date</Label>
                            <DatePicker
                              selected={
                                this.state[row.name]
                                  ? this.state[row.name].start
                                  :  ( row.start.selectedDate || new Date())
                              }
                              onChange={(e) =>
                                this.handleDateChange(e, row.name, "start")
                              } //only when value has changed
                              minDate={row.start.minDate || null}
                              maxDate={row.start.maxDate || null}
                              dateFormat="MMMM d, yyyy"
                            />
                            <i
                              class="ri-close-line"
                              style={{ left: "auto", right: "10px" }}
                              onClick={this.clearDate}
                            ></i>
                          </div>
                          <div style={{ opacity: "0" }}>{"__"}</div>
                          <div className="position-relative w-100">
                            <i class="ri-calendar-2-line"></i>
                            <Label className="end">End Date</Label>
                            <DatePicker
                              selected={
                                this.state[row.name]
                                  ? this.state[row.name].end ||
                                    row.end.selectedDate
                                  : row.end.selectedDate
                              }
                              // onSelect={handleDateSelect} //when day is clicked
                              onChange={(e) =>
                                this.handleDateChange(e, row.name, "end")
                              } //only when value has changed
                              minDate={row.end.minDate || null}
                              maxDate={row.end.maxDate || null}
                              dateFormat="MMMM d, yyyy"
                            />
                            <i
                              class="ri-close-line"
                              style={{ left: "auto", right: "10px" }}
                              onClick={this.clearDate}
                            ></i>
                          </div>
                        </Col>
                      </Row>
                    </FormGroup>
                  ) : (
                    <FormGroup
                      className="datepicker-form with-padding"
                      style={
                        row.overlay ? { background: row.overlayColor } : null
                      }
                    >
                      <Label for={row.name}>{row.label}</Label>
                      <DatePicker
                        selected={new Date()}
                        // onSelect={handleDateSelect} //when day is clicked
                        // onChange={handleDateChange} //only when value has changed
                      />
                    </FormGroup>
                  )
                )}
              {OrderBy &&
                (() => {
                  const stateData = this.state[OrderBy.name] || {
                    field: OrderBy.value,
                    type: "ASC",
                  };
                  return (
                    <>
                      <FormGroup
                        className="with-padding"
                        style={
                          OrderBy.overlay
                            ? { border: `1px solid ${OrderBy.overlayColor}` }
                            : null
                        }
                      >
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <Label for={OrderBy.name} className="mb-0">
                            {OrderBy.label}
                          </Label>
                          {stateData.type === "ASC" && (
                            <>
                              <div
                                className="order-type d-flex align-items-center"
                                onClick={() =>
                                  this.toggleOrderSort("DESC", OrderBy.name)
                                }
                              >
                                Ascending <i className="ri-sort-asc ml-1"></i>
                              </div>
                            </>
                          )}
                          {stateData.type === "DESC" && (
                            <>
                              <div
                                className="order-type d-flex align-items-center"
                                onClick={() =>
                                  this.toggleOrderSort("ASC", OrderBy.name)
                                }
                              >
                                Descending <i className="ri-sort-desc ml-1"></i>
                              </div>
                            </>
                          )}
                        </div>

                        <Select
                          type="Order_By"
                          name={OrderBy.name}
                          id={OrderBy.name}
                          placeholder={OrderBy.placeholder || "Select..."}
                          options={OrderBy.options || null}
                          defaultValue={OrderBy.defaultValue || null}
                          value={
                            OrderBy.options.find(
                              (x) => x.value === stateData.field
                            ) || null
                          }
                          closeMenuOnSelect={true}
                          onChange={this.handleOrderChange}
                          className="Select_Statick"
                        />
                      </FormGroup>
                    </>
                  );
                })()}
            </div>
            <Row>
              <Col>
                <Button
                  type="submit"
                  className="ld-button-success"
                  onClick={this.submitFilters}
                >
                  <i class="ri-filter-line"></i> Search
                </Button>
              </Col>
            </Row>
          </AvForm>
        </CardBody>
      </>
    );
  }
}

export default PageFilters;
