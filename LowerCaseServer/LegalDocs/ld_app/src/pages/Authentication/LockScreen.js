import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";

//Components
import Preloader from "../../components/Preloader/preloader-core";
import LockScreenForm from "../../components/Authentication/LockScreenForm"

import logo from "./../../assets/images/logo-dark.png";

import "./style.scss"

class LockScreen extends Component {
    state = {
        SignInStep: 'SIGN_IN_FORM'
    }
    Preloader = new Preloader(this);





    render (){
        this.Preloader.showOnStart();        

        return (
            <>
                <Container fluid className="p-0">
                    <Row className="no-gutters">
                        <Col lg={12} className="d-flex justify-content-center align-items-center min-vh-100 auth-page-containter">
                            <Col lg={4} className="auth-block">
                                <div className="text-center">
                                    <div>
                                        <Link to="/" className="logo logo-dark-d">
                                        <img src={logo} height="40" alt="logo" />
                                        </Link>
                                    </div>
                                </div>
                                <h4 className= "h4 text-center my-2">Welcome back</h4>
                                <div className="p-2 mt-2">
                                   <LockScreenForm/>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default LockScreen;

