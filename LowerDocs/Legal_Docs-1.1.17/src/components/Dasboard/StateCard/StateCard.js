    import React, {Component} from "react";
    import { Media, Card, CardBody, Row, Col, Button } from "reactstrap";
    import {NavLink} from 'react-router-dom';
    import {connect} from "react-redux";
    

class StateCaerd extends Component {
  state = {  }
  render() { 
    const caseCount = this.props.logCase.length
    return ( 
      <>
          <Row>
            <Col lg={4}>
              <Card>
                <CardBody>
                  <Media>
                    <Media body className="overflow-hidden">
                      <p className="text-truncate font-size-14 mb-2">
                      Current cases
                      </p>
                      <h4 className="mb-3">{caseCount}</h4>
                    </Media>
                    <div className="text-primary">
                      <i className={"ri-briefcase-line" + " font-size-24"}></i>
                    </div>
                  </Media>
                  <CardBody className="border-top px-0 pb-0">
                    <NavLink to = "/allcases">
                    <Button className="w-100 m-0" color="info">
                    Current cases
                    </Button>
                    </NavLink>
                  </CardBody>
                </CardBody>
              </Card>
            </Col>
            {/* <Col lg={4}>
              <Card>
                <CardBody>
                  <Media>
                    <Media body className="overflow-hidden">
                      <p className="text-truncate font-size-14 mb-2">Past cases</p>
                      <h4 className="mb-3">0</h4>
                    </Media>
                    <div className="text-primary">
                      <i className={"ri-briefcase-line" + " font-size-24"}></i>
                    </div>
                  </Media>
                  <CardBody className="border-top px-0 pb-0">
                    <Button className="w-100 m-0" color="info">
                      View Past cases
                    </Button>
                  </CardBody>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card>
                <CardBody>
                  <Media>
                    <Media body className="overflow-hidden">
                      <p className="text-truncate font-size-14 mb-2">
                        Current cases
                      </p>
                      <h4 className="mb-3">{caseCount}</h4>
                    </Media>
                    <div className="text-primary">
                      <i className={"ri-briefcase-line" + " font-size-24"}></i>
                    </div>
                  </Media>
                  <CardBody className="border-top px-0 pb-0">
                    <Button className="w-100 m-0" color="info">
                      View Current cases
                    </Button>
                  </CardBody>
                </CardBody>
              </Card> */}
            {/* </Col> */}
          </Row>
        </>
     );
  }
}

const mapStateToProps = (state) => {
  return {
    logCase: state.User.caseData.cases
  };
};
 
export default connect(mapStateToProps) (StateCaerd);

