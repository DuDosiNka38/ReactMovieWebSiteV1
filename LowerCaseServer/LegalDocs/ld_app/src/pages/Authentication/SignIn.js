import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";

//Components
import Preloader from "./../../components/Preloader/preloader-core";
import SingInForm from "./../../components/Authentication/SignInForm"
import SetNewPasswordForm from './../../components/Authentication/SetNewPasswordForm'
import NotApprovedPCForm from './../../components/Authentication/NotApprovedPCForm'
import HostManager from './../../components/HostManager/HostManager'

import logo from "./../../assets/images/logo-dark.png";

import "./style.scss"
import ModalService from "../../services/ModalService";

class SignIn extends Component {
    state = {
        SignInStep: 'SIGN_IN_FORM'
    }
    Preloader = new Preloader(this);

    switchForm = (action) => {
        this.setState({SignInStep: action});
    }

    switchForms = () => {
        const { SignInStep } = this.state;

        switch(SignInStep){
            case 'SIGN_IN_FORM':
                return (<>
                            <HostManager />
                            <SingInForm switchForm={this.switchForm}/>
                        </>);

            case 'SET_NEW_PASSWORD_FORM':
                return <SetNewPasswordForm switchForm={this.switchForm}/>;

            case 'NOT_APPROVED_PC_FORM':
                return <NotApprovedPCForm switchForm={this.switchForm}/>;
            default:
                return null;
        }
    }

    render (){
        this.Preloader.showOnStart();        

        return (
            <>
                {ModalService.renderModal(this.props.history)}
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

                                <div className="p-2 mt-2">
                                    {this.switchForms()}
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default SignIn;

