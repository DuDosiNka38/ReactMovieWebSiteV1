import React, { Component } from "react";
import PropTypes from "prop-types";
import {Col, Container, Row, } from "reactstrap"

class TrotlingBlocks extends Component {
  state = {};

  componentDidMount() {}
  render() {
    return (
      <>
        {this.props.TRtype === "line" && (
          <>
            <div className="trotling-holder d-flex flex-column">
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
            </div>
          </>
        )}

        {this.props.TRtype === "menu" && (
          <>
            <div className="trotling-menu d-flex justify-content-lg-between align-items-center">
              <div className="trotling-round"></div>
              <div className="trotling-line "></div>
            </div>
          </>
        )}

        {this.props.TRtype === "page" && (
          <>
           <Container fluid>
             <Row>
               <Col lg={9}>
               <div className="trotling-holder d-flex flex-column">
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
            </div>
            <div className="mt-3"></div>
            <div className="trotling-holder d-flex flex-column">
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
            </div>
            <div className="mt-3"></div>
            <div className="trotling-holder d-flex flex-column">
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
            </div>
               </Col>
               <Col lg = {3}>
               <div className="trotling-holder d-flex flex-column">
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>

            </div>
            <div className="mt-3"></div>
            <div className="trotling-holder d-flex flex-column">
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              <div className="trotling-line my-2"></div>
              </div>

               </Col>
             </Row>
           </Container>
          </>
        )}
      </>
    );
  }
}

export default TrotlingBlocks;
