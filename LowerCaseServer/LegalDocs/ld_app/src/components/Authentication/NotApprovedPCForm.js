import React, { Component } from "react";
import PreloaderLD from "../Preloader/preloader-core";

import "./styles.scss";

class NotApprovedPCForm extends Component {
    state = {
    }
    Preloader = new PreloaderLD(this);

    componentDidMount() {
        setTimeout(() => this.props.switchForm('SIGN_IN_FORM'), 10000);
    }

    render (){
        return (
            <>
                <div className="notApprovedPCForm">
                    <h2 className=" check-title text-center mb-1" >
                        Please ask the Legal Docs admin to approve your Computer. <br/> 
                        Then You can exit the Application or wait for approval.
                    </h2>
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                </div>
                
            </>
        );
    }
}

export default NotApprovedPCForm;


