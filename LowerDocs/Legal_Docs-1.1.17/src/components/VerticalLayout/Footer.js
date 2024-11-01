import React, { Component } from 'react';
import { Row, Col, Container } from "reactstrap";
// import * as actions from "./../../store/user/actions"
import { connect } from "react-redux";





class Footer extends Component {
    state = {  }



    // getGlobalInfo() {
    //     this.props.onCaseLoad();
    //     this.props.onDepartmentLoad();
    //     this.props.onCaseTypeLoad();
    //     this.props.onPersoneLoad();
    //   }
    
    
    // componentDidUpdate() {
    //   this.getGlobalInfo()
    // }

    render() { 
        return ( 
          <>
          <footer className="footer">
                <Container fluid>
                      <Row>
                          <Col sm={6}>
                              {new Date().getFullYear()} © DBI Legal Docs.
                          </Col>
                          <Col sm={6}>
                              <div className="text-sm-right d-none d-sm-block">
                                  Crafted with DBI 
                              </div>
                          </Col>
                      </Row>
                </Container>

            </footer>
          </>
         );
    }
}
 


// const mapDispatchToProps = (dispatch) => ({
//     onCaseLoad: () => dispatch(actions.getCase()),
//     onDepartmentLoad: () => dispatch(actions.getDepartament()),
//     onCaseTypeLoad: () => dispatch(actions.getCasesType()),
//     onPersoneLoad: () => dispatch(actions.getPersonData()),
//   });



  export default connect( )(Footer);
