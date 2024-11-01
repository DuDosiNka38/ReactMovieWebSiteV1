import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Media, Button, Input, CardHeader, FormGroup, Label } from "reactstrap";
import { NavLink } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import combine from "../../routes/combine";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import DeleteEvent from "../Calendar/modals/DeleteEvent";
import EventsApi from "../../api/EventsApi";

class EventBlock extends Component {
  state = {
    EventData: {}
  };

  // fetchEvent = async () => {
  //   const { Activity_Name } = this.state.EventData;
  //   const EventData = await EventsApi.fetchEvent(Activity_Name);
  //   this.setState({EventData});
  // }

  // componentDidMount() {
  //   const { EventData } = this.props;
  //   this.setState({EventData});
  // }


  render() {
    const { EventData } = this.props;
    const showModal = (type, props) => this.props.showModal(type, props);

    return (
      <>
        <NavLink to={combine("SINGLE_EVENT", { Activity_Name: EventData.Activity_Name })} className="case-name-link">
          <Card
            className={`case-block`}
            style={{
              background: `linear-gradient(150deg, #fff 50%, ${EventData.CaseBg} 100% `,
            }}
          >
            {/* <Tilt  tiltEnable={true} > */}
            <CardBody className={`${this.props.class}`} className="eventCard">
              <Media className="d-flex flex-column">
                <div
                  className="case-name d-flex align-items-center justify-content-between"
                  style={{ color: EventData.CaseBg }}
                  title={EventData.Activity_Title}
                >
                  {EventData.Activity_Title || <i className="ri-subtract-line"></i>}
                  <div class="case-actions">
                  <div
                      onClick={() => {
                        this.props.showModal("ATTACH_DOCUMENT", {
                          Activity_Name: EventData.Activity_Name,
                          Case_NAME: EventData.Case_NAME,
                          Attached: [],
                        });
                      }}
                      className="d-inline-flex case-settings"
                      title="Edit Document"
                    >
                      <i class="ri-attachment-2"></i>
                    </div>
                    <div
                      onClick={(e) =>{
                        e.preventDefault();
                        showModal("EDIT_EVENT", {
                          Activity_Name: EventData.Activity_Name,
                          onSuccess: this.fetchEvent,
                        })
                      }}
                      className="d-inline-flex case-settings ml-2"
                      title="Edit Document"
                    >
                      <i class="  ri-settings-5-line "></i>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        
                        showModal("DELETE_EVENT", {
                          Activity_Name: EventData.Activity_Name,
                          onSuccededDelete: this.props.onSuccededDelete,
                        });
                      }}
                      className="d-inline-flex case-settings ml-2"
                      title="Delete Document"
                    >
                      <i class="ri-delete-bin-line"></i>
                    </div>
                  </div>
                </div>
                <div className="" style={{ color: "#969696" }}>
                {EventData.Case_Full_NAME}
                  {/* {EventData.Comments || <i className="ri-subtract-line"></i>} */}
                </div>

                <div className="my-1" style={{ color: "#505d69" }}>
                  {EventData.Tentative_date || <i className="ri-subtract-line"></i>}
                </div>
                <div className="w-100  d-flex justify-content-md-between">
                  <div className="blockWithlabel">
                    <div className="label">Actvity type</div>
                    <div className="info">{EventData.Activity_type_Description}</div>
                  </div>
                  {/* <div className="blockWithlabel">
                    <div className="label text-right">Case</div>
                    <div className="info">{EventData.Case_Full_NAME}</div>
                  </div> */}
                </div>
              </Media>
            </CardBody>
            {/* </Tilt> */}
            <ReactTooltip />
          </Card>
        </NavLink>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventBlock);
