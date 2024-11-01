import React, { Component } from "react";
import { Media, Card, CardBody, Col, Row } from "reactstrap";
import { NavLink } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import combine from "../../routes/combine";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import DocsApi from "../../api/DocsApi";

class DocumentBlock extends Component {
  state = {
    Doc_Data: null,

    IN_PARSE: true,
  };

  loadDocumentFiles = async () => {
    const { DOC_ID } = this.props.Doc_Data;
    const Doc_files = await DocsApi.fetchDocFiles(DOC_ID);

    console.log({DOC_ID})
    
    let IN_PARSE = false;
    Doc_files.map((x) => {
      if(x.IN_PARSE) IN_PARSE = true;
    });

    this.setState({ IN_PARSE });
  }

  componentDidMount() {
    this.loadDocumentFiles();
  }

  render() {
    const { Doc_Data } = this.props;
    const { IN_PARSE } = this.state;
    
    const showModal = (type, props) => this.props.showModal(type, props);

    return (
      <>
        <Card
          className={`case-block`}
          style={{
            background: `linear-gradient(150deg, #fff 50%, ${Doc_Data.CaseBg} 100% `,
          }}
        >
          {/* <Tilt  tiltEnable={true} > */}
          <CardBody className={`${this.props.class}`} className="docCard">
            <Media className="d-flex flex-column">
              <div className="case-name d-flex align-items-center justify-content-between">
                <NavLink
                  to={combine("SINGLE_DOCUMENT", { DOC_ID: Doc_Data.DOC_ID })}
                  className="case-name-link"
                  style={{ color: Doc_Data.CaseBg }}
                  title={Doc_Data.DOCUMENT_NAME}
                >
                  {Doc_Data.DOCUMENT_NAME || <i className="ri-subtract-line"></i>}
                </NavLink>
                <div class="case-actions">
                  <div
                    onClick={() =>
                      showModal("ATTACH_TO_EVENT", {
                        Doc_Data
                      })
                    }
                    className="d-inline-flex case-settings"
                    title="Attach to Event"
                  >
                    <i class="ri-attachment-2"></i>
                  </div>
                  <div
                    onClick={() =>
                      showModal("EDIT_DOCUMENT", {
                        DOC_ID: Doc_Data.DOC_ID,
                        onSuccess: () => {
                          this.props.onUpdate();
                          this.render();
                        },
                      })
                    }
                    className="d-inline-flex case-settings ml-2"
                    title="Edit Document"
                  >
                    <i class="  ri-settings-5-line "></i>
                  </div>
                  {!IN_PARSE ? (
                    <div
                    onClick={() =>
                      showModal("DELETE_DOC", {
                        DOC_ID: Doc_Data.DOC_ID,
                        onSuccess: this.props.onDelete,
                      })
                    }
                    className="d-inline-flex case-settings ml-2"
                    title="Delete Document"
                  >
                    <i class="ri-delete-bin-line"></i>
                  </div>
                  ) : (
                    <>
                      <div
                        className="d-inline-flex ml-2 mr-1"
                        title="Some Files of Document are Currently Parsing"
                      >
                        <i class="ri-error-warning-line"></i>
                      </div>
                    </>
                  )}
                  
                </div>
              </div>
              <NavLink to={combine("SINGLE_DOCUMENT", { DOC_ID: Doc_Data.DOC_ID })} className="link-full">
                <div className="case-desc mb-2 w-100 d-flex">
                  {Doc_Data.Case_Full_NAME || <i className="ri-subtract-line"></i>}
                  {Doc_Data.FILED_DATE !== null && (
                    <>
                      <div className="filedDoc">FILED</div>
                    </>
                  )}
                </div>
                <div className="w-100  d-flex justify-content-md-between">
                  <div className="blockWithlabel">
                    <div className="label">Created Date</div>
                    <div className="info">{Doc_Data.CREATED_DATE}</div>
                  </div>
                  {Doc_Data.FILED_DATE !== null && (
                    <>
                      <div className="blockWithlabel">
                        <div className="label">Filed Date</div>
                        <div className="info">{Doc_Data.FILED_DATE}</div>
                      </div>
                    </>
                  )}
                </div>
              </NavLink>
            </Media>
          </CardBody>
          {/* </Tilt> */}
          <ReactTooltip />
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentBlock);
