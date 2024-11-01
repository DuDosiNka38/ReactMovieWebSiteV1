import React, { Component } from "react";
import { FormGroup, Label, Row, Col, Card, CardBody, Input } from "reactstrap";
import { AvField } from "availity-reactstrap-validation";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { connect } from "react-redux";

class DocumentModal extends Component {
  state = {
    dt: "",
  };
  componentDidMount() {
  }
  render() {
    // types
    const options = this.props.types.filter((y)=> y.visible !== false).map((o) => ({
      name: "DOCUMENT_TYPE",
      value: o.DOCUMENT_TYPE,
      label: o.TYPE_DESCRIPTION,
    }));
    const keywords = this.props.keywords.map((o)=> ({
      value: o.KEYWORDS,
      label: o.KEYWORDS,
    }))

    const {cases} = this.props

    const casesList = cases.filter((y)=> y.visible !== false).map((x)=> ( {
      name: "Case_NAME",
      value: x.Case_Short_NAME,
      label: x.Case_Full_NAME
    }))
    


    
    return (
      <>
        <Row>
         

          <Col lg={12}>
            <Card>
              <CardBody>
              <FormGroup className="auth-form-group-custom mb-4">
              <i className=" ri-hashtag auti-custom-input-icon"></i>
              <Label htmlFor="username">DOCUMENT NAME </Label>
              <AvField
                name="DOCUMENT_NAME"
                value={this.props.DOCUMENT_NAME}
                type="text"
                className="form-control"
                id="DOCUMENT_NAME"
                onChange={this.props.handleChange}
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
                placeholder="Document Name"
              />
            </FormGroup>
              </CardBody>
            </Card>
          </Col>

       
           <>
            <Col lg={12}>
            <Card>
              <CardBody>
              <FormGroup className=" mb-4">
              <Label htmlFor="username">Select Case </Label>
            <Select
              options={casesList}
              className="basic-multi-select"
              defaultValue={this.props.whereopen === "inside_case" ? casesList.find((x) => x.value === this.props.Case_NAME) : null}
              name="Caes_NAME"
              isDisabled={this.props.whereopen === "inside_case" && true}
              classNamePrefix="select"
              onChange={this.props.onSelectChange}
            />
            </FormGroup>
              </CardBody>
            </Card>
          </Col>
           </>
         
          <Col lg={12}>
         <Card>
           <CardBody>
           <FormGroup className=" mb-4">
            
            <Label htmlFor="username">Keywords </Label>
          <CreatableSelect
            isMulti
            onChange={this.props.createbleSelectHandler}
            placeholder = "Add keyword and press enter"
            options={keywords}
          />
          </FormGroup>
           </CardBody>
         </Card>
          </Col>
          <Col lg={12}>
            <Card>
              <CardBody>
              <FormGroup className="mb-4 mt-2">
              <Label htmlFor="billing-address">Description</Label>
              <textarea
                className="form-control custom-textarea"
                id="Description"
                rows="3"
                name="Description"
                value={this.props.Description}
                placeholder="Enter Description"
                onChange={this.props.handleChange}
              ></textarea>
            </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg={12}>
            <Card>
              <CardBody>
             <FormGroup className="mb-4 mt-2">
              <Label htmlFor=""> DOCUMENT TYPE</Label>
            <Select
              options={options}
              className="basic-multi-select"
              name="Owner"
              classNamePrefix="select"
              onChange={this.props.onSelectChange}
            />
            </FormGroup>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
              <FormGroup className="mb-4 mt-2">
              <Label htmlFor="CREATED_DATE">CREATED DATE</Label>
              <AvField
                name="CREATED_DATE"
                value={this.props.CREATED_DATE}
                type="datetime-local"
                id="CREATED_DATE"
                onChange={this.props.handleChange}
                validate={{
                  required: {
                    value: true,
                  },
                }}
                placeholder="Event Name"
              />
            </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
              <FormGroup className="mb-4 mt-2">
              <Label htmlFor="FILED_DATE">FILED DATE</Label>
              <AvField
                name="FILED_DATE"
                value={this.props.FILED_DATE}
                type="datetime-local"
                // defaultValue="2020-03-14T13:45:00"
                id="FILED_DATE"
                onChange={this.props.handleChange}
                // validate={{
                //   required: {
                //     value: true,
                //   },
                // }}
                placeholder="Event Name"
              />
            </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     // onCaseLoad: () => dispatch(actions.getCase()),
//     onGlobalLoad: () => dispatch(actions.getGlobalData()),
//   };
// };

export default connect(mapStateToProps, null)(DocumentModal);
