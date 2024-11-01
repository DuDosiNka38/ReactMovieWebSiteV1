import React, { Component } from "react";
import { Card, CardBody, Button, Col } from "reactstrap";
import PRIVILEGE from "../../services/privileges";

class CaseCard extends Component {
  state = {};

  render() {
    function limitStr(str, n, symb) {
      if (n === undefined || str === undefined) return str;
      symb = symb || "...";
      if (str.length < n) symb = "";
      return str.substr(0, n - symb.length) + symb;
    }

    return (
      <>
        <Card>
          <CardBody className="row">
            <Col lg={4}>
              <h6>Case Full Name:</h6>
              <p
                className="mr-1   font-size-16 customTitle "
                title={this.props.CaseName}
              >
                {limitStr(this.props.CaseName, 40)}{" "}
              </p>
            </Col>

            <Col lg={4}>
              <h6>Case Short Name:</h6>
              <p className="mr-1   font-size-16 customTitle ">
                {this.props.Case_Short_NAME}
              </p>
            </Col>
           

            <Col lg={4}>
              <h6>Case Number:</h6>
              <p className="mr-1   font-size-16 customTitle ">
                {this.props.Case_Number}
              </p>
            </Col>

            <Col lg={4}>
              <h6>Calendar Name: </h6>
              <p className="mr-1   font-size-16 customTitle ">
                {this.props.Calendar_name}
              </p>
            </Col>

            <Col lg={4}>
              <h6>Case Type: </h6>
              <p className="mr-1   font-size-16 customTitle ">
                {this.props.Case_Type}
              </p>
            </Col>

            <Col lg={4}>
              <h6>Court Name: </h6>
              <p className="mr-1   font-size-16 customTitle ">
                {this.props.Court_name}
              </p>
            </Col>

            <Col lg={4}>
              <h6> Department Name: </h6>
              <p className="mr-1   font-size-16 customTitle ">
                {this.props.Department_Name}
              </p>
            </Col>

            <Col lg={4}>
              <h6> Judge Name: </h6>
              <p className="mr-1   font-size-16 customTitle ">
                {this.props.Judge_name}
              </p>
            </Col>

            <Col lg={4}>
              <h6> Case Type Description </h6>
              <p className="mr-1   font-size-16 customTitle ">
              {this.props.Case_Type_Description}

              </p>
            </Col>
            <Col lg={4}>
              <h6> Description: </h6>
              <p className="mr-1   font-size-16 customTitle ">
              {this.props.DESCRIPTION}

              </p>
            </Col>

            <Col lg={4}>
              <h6> Status: </h6>
              <p className="mr-1   font-size-16 customTitle ">
              {this.props.Status}


              </p>
            </Col>


            {this.props.isUserCanEdit && (
              <>
                <div className="toolbar col-lg-12">
                  <hr />
                  <div className="btnbar d-flex">
                    <Button
                      color="info"
                      attr-action="edit"
                      onClick={this.props.switch_modal}
                      className="d-flex align-items-center mr-3"
                    >
                      <i className=" ri-pencil-line font-size-20 mr-1  auti-custom-input-icon "></i>{" "}
                      Edit Case
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </>
    );
  }
}

export default CaseCard;
