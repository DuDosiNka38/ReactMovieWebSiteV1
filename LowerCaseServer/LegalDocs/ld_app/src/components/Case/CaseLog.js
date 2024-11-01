import React, { Component } from "react";
import { CardBody, Card, CardHeader, Media, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

class CaseLog extends Component {
  state = {};
  render() {
    return (
      <>
        <Card>
          <CardHeader></CardHeader>
          <CardBody>
            <Media>
       
                <div className="timeline" >
                  <div className="timeline-item timeline-left">
                    <div className="timeline-block">
                      <Card className="timeline-box">
                        <CardBody>
                          <span className="timeline-icon"></span>
                          <div className="timeline-date">
                            <i className="mdi mdi-circle-medium circle-dot"></i>{" "}
                            21 April
                          </div>
                          <h5 className="mt-3 foont-size-15">
                            {" "}
                            Timeline event Two
                          </h5>
                          <div className="text-muted">
                            <p className="mb-0">
                              To achieve this, it would be necessary to have
                              more common words.
                            </p>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>

                  <div className="timeline-item timeline-left">
                    <div className="timeline-block">
                      <Card className="timeline-box">
                        <CardBody>
                          <span className="timeline-icon"></span>
                          <div className="timeline-date">
                            <i className="mdi mdi-circle-medium circle-dot"></i>{" "}
                            09 April
                          </div>
                          <h5 className="mt-3 foont-size-15">
                            {" "}
                            Timeline event Four
                          </h5>
                          <div className="text-muted">
                            <p className="mb-0">
                              Sed ut perspiciatis unde omnis iste natus error
                              sit voluptatem accusantium doloremque laudantium,
                              ab illo inventore veritatis et
                            </p>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </div>
          
            </Media>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default CaseLog;
