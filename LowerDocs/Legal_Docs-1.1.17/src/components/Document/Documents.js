import React, { Component } from "react";
import {  Button,Col  } from "reactstrap";
import { NavLink,  } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
let idC;

class Documents extends Component {
  state = {
    case: ""
  };


  limitStr(str, n, symb) {
    if (!n && !symb) return str;
    symb = symb || "...";
    return str.substr(0, n - symb.length) + symb;
  }
  render() {
    idC = this.props.CaseId;
    // this.props.setCaseId() 
    return (
      <>
       
          {/* <NavLink to={`/document/${this.props.params.docId}`} > */}
         <Col className="document-block" lg={4}>
         <NavLink to={`/app/case-explorer/case/${this.props.CaseId}/document/${this.props.DocimentView}`}className=" linkToEvent d-flex flex-column my-2"  title={this.props.docName}>
            {/* <Button color="info" className="my-2 d-flex align-items-center" >
              <i className="ri-file-line font-size-20 mr-1  auti-custom-input-icon"></i>
              {this.limitStr(this.props.docName, 20)}
            </Button> */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="document-name">{this.props.docName}</div>

        <ul className="eventMoreInfo">
        
        {/* <li>
        Tentative Date: {this.props.Tentative_date_human}
        </li> */}
        </ul>
        <span><i className="ri-information-line eventIcon"></i></span>
        </div>
          </NavLink>
         </Col>
      
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,


  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    // setCaseId: () => dispatch(actions.setLocalDocuments (idC)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Documents);

