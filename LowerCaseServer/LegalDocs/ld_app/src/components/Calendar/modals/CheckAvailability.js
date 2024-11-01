import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../../store/modal/actions";
import EventApi from "../../../api/EventsApi"
import notification from '../../../services/notification'
import * as PreloaderActions from "../../../store/preloader/actions";
import combine from "../../../routes/combine";


class CheckAvailability extends Component {
  state = {
    checkActReq: {
      startDate: null,
      endDate: null,
    },

    text: "Warning!",
  }

  changeText = () => {
    this.setState({text: "Achtung, schweine!"});
    // var audio = new Audio('https://melodia.space/wp-content/uploads/2020/10/pozharnaya-trevoga-vklyuchena.mp3');
    var audio = new Audio('https://cdn.discordapp.com/attachments/809146005551317033/897528124420530206/-_9_music-drom.com.mp3');
    
    audio.volume = 0.1;
    audio.play();
    this.props.showModal("SHOW_HA")
  }

  componentDidMount() {
    this.setState({checkActReq: {
      startDate: this.props.startDate,
      endDate: this.props.endDate
    }});
  }

  render() {

    const { checkActReq, text } = this.state;

    return (
      <>
        <>
          <Modal
            isOpen={true}
            centered={true}
            className="delete-case-modal"
            size="xs"
          >
            <ModalHeader
              className="d-flex align-items-center justify-content-center"
              toggle={this.props.hideModal}
              onClick={this.changeText}
            >
            {text}
            </ModalHeader>
            <ModalBody className="w-100">
            <p>
              We do not recommend creating an event of this type on the day of
              your choice. Since there are restrictions indicated in the setting
              of Activity types.
            </p>
            <p>
              It would be better to create an event in this
              <br />
              <span className="time_interval">
                {checkActReq.startDate} - {checkActReq.endDate}
              </span>{" "}
              {""} interval of days.
            </p>
            </ModalBody>
            <ModalFooter className= "mfooterGTO">
              <Button
                className="ld-button-success"
                type="submit"
                onClick={this.props.hideModal}
              >
                Ok, i understand!
              </Button>
            </ModalFooter>
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("CheckAvailability")),
    hide: () => dispatch(PreloaderActions.hidePreloader("CheckAvailability"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckAvailability);
