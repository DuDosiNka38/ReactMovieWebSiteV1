import React, { Component } from 'react';
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

//Import images
import errorImg from "../../assets/images/error-img.png";

class Error404 extends Component {
    render() {
        return (
            <React.Fragment>
            <div className="my-5 pt-5">
                <Container>
                    <Row>
                        <Col lg={12} className="mt-5">
                            <div className="text-center my-5">
                                <h1 className="font-weight-bold text-error">4 <span className="error-text">0<img src={errorImg} alt="" className="error-img"/></span> 4</h1>
                                <h3 className="text-uppercase">Sorry, page "{this.props.location.pathname} " not found</h3>
                                <div className="mt-5 text-center">
                                    <Link to="/home" className="btn btn-primary waves-effect waves-light" >Back to General</Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            </React.Fragment>
        );
    }
}

export default Error404;