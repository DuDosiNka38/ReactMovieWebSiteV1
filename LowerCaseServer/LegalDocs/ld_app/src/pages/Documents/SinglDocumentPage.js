import React, { Component,Suspense, lazy } from 'react';
import {Row, Container, Col, Card, CardBody, Media,   Table,} from "reactstrap"
import PageHeader from './../../components/PageHader/PageHeader';
import DocsApi from "./../../api/DocsApi"
import { connect } from "react-redux";
import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";
import * as PersonnelActions from "./../../store/personnel/actions";
import * as DocsActions from "./../../store/documents/actions";
import ReactTooltip from 'react-tooltip';
import TrotlingBlocks from '../../components/StyledComponents/TrotlingBlocks';
import DocumentsViewBlock from './../../components/Documents/DocumentsViewBlock'
 
class SinglDocumentPage extends Component {
  state = {
    Doc_files: [],  
 
  }

  loadDocument = async () => {
    const {DOC_ID } = this.props.match.params;
    const documentData = await DocsApi.fetchDocument(DOC_ID);
    this.setState({ ...documentData });
  }

  loadDocumentFiles = async () => {
    const {DOC_ID } = this.props.match.params;
    const Doc_files = await DocsApi.fetchDocFiles(DOC_ID);
    
    let IN_PARSE = false;
    Doc_files.map((x) => {
      if(x.IN_PARSE) IN_PARSE = true;
    });

    this.setState({ Doc_files, IN_PARSE });
  }

  componentDidMount = async () => {
     await this.loadDocument();
     await this.loadDocumentFiles();
  };

  render() { 
  const {DOCUMENT_NAME, CaseBg, IN_PARSE } = this.state
  const showModal = (type, props) => this.props.showModal(type, props);
    return ( 
      <>
     <div className="page-content">
       <Container fluid>
        {IN_PARSE && (
          <>
           <div className="doc_w_block"> 
            <span className="d-flex align-items-center"><i className="ri-error-warning-line mr-2"></i>Warning! Some files of this document are currently parsing. Some information may not be able.</span>            
          </div>
          </>
        )}
        
         <PageHeader>
          <span style ={{color: CaseBg, fontWeight: "400", opacity: ".8"}} className="font-size-18">{DOCUMENT_NAME}</span>
         </PageHeader>
       <Suspense fallback={<TrotlingBlocks TRtype="line"/>}>
           <DocumentsViewBlock documentData = {this.state} DOC_ID = {this.props.match.params} loadDocument={this.loadDocument}/>
       </Suspense>
       </Container>
     </div>
      </>
     );
  }
}
const mapStateToProps = (state) => ({
  modalType: state.Modal.type,
  cases: state.Case.cases,
  isCasesInit: state.Case.isInit,
  Personnel: state.Personnel.personnel,
  isPersonnelInit: state.Personnel.isInit,
  DocsInfo: state.Documents.info,
  isDocumentsInfoInit: state.Documents.isInit
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),
  fetchPersonnel: () => dispatch(PersonnelActions.personnelFetchRequested()),

  fetchDocsInfo: () => dispatch(DocsActions.documentsInfoFetchRequested()),
  // fetchDocFiles: (DOC_ID) => dispatch(DocsActions.docFilesFetchRequested(DOC_ID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SinglDocumentPage);