import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../store/modal/actions";
import TrotlingBlocks from "./../../components/StyledComponents/TrotlingBlocks";
import { Table, Row, Col } from "reactstrap";
import ComputersApi from "./../../api/ComputersApi";
import * as PersonnelActions from "./../../store/personnel/actions";
import * as PreloaderActions from "./../../store/preloader/actions";

class UserPcConfig extends Component {
  state = {
    Computers: null,
  };

  componentDidMount = async () => {
    this.loadData();
  };

  loadData = async () => {
    const { Computer } = this.props;

    if(Computer){
      this.setState({ Computers: [Computer]});
    } else {
      const Computers = await ComputersApi.fetchUserComputers(this.props.User_id);
      this.setState({ Computers });
    }    
  };

  approvePc = async (User_id, Mac_Address) => {
    const { Computer, Preloader, fetchPersonnel } = this.props;
    Preloader.show();

    const response = await ComputersApi.putComputer(User_id, Mac_Address, {
      APPROVED_DATE: new Date().toJSON().slice(0, 19).replace("T", " "),
    });

    fetchPersonnel();

    if(Computer){
      this.props.hideModal(this.props.type);
    }

    if (response.result) {
      this.loadData();
    }

    Preloader.hide();
  };

  render() {
    const { User_id, User_name, Modal_Header } = this.props;
    const UserPc = this.state.Computers;
    return (
      <>
        <>
          <Modal isOpen={true} centered={true} className="delete-case-modal" size="xl">
            <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
              {Modal_Header ? (
                <>
                  {Modal_Header}
                </>
              ) : (
                <>
                  {User_name} computers
                </>
              )}
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal p-0">
              <Suspense fallback={<TrotlingBlocks TRtype="line" />}>
                <Table className="customTable p-0 mb-0">
                  <thead>
                    <tr>
                      <td>Computer id</td>
                      <td>Mac Address</td>
                      <td>OS</td>
                      <td>Computer Type </td>
                      <td>Requested Date</td>
                      <td>Approved Date</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {UserPc && UserPc.map((x) => (
                      <tr key={x.Computer_id}>
                        <td>{x.Computer_user}</td>
                        <td>{x.Mac_Address}</td>
                        <td>{x.OS}</td>
                        <td>{x.Computer_type}</td>
                        <td>{new Date(x.Request_date).toLocaleString()}</td>
                        <td>{x.Approved_date ? new Date(x.Approved_date).toLocaleString() : ""}</td>
                        <td className="d-flex">
                          {x.Approved_date === null && (
                            <>
                              <span
                                className="flat-icon user-del font-size-20  d-flex justify-content-center align-items-center"
                                title="Approve"
                                onClick={() => this.approvePc(x.Person_id, x.Mac_Address)}
                              >
                                <i className="ri-check-line"></i>
                              </span>
                            </>
                          )}
                          <span
                            className="flat-icon user-del font-size-20  d-flex justify-content-center align-items-center"
                            title="remove"
                            onClick={() => this.props.showModal("REMOVE_USER_PC", {User_id: x.Person_id, Mac_Address: x.Mac_Address, Computer_id: x.Computer_id}) }
                          >
                            <i className="ri-close-line"></i>
                          </span>
                        </td>
                      </tr>
                    ))}
                    {UserPc === null && (
                      <>
                        <td colSpan={7}>
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="lds-spinner">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                    {UserPc && UserPc.length === 0 && (
                      <>
                        <tr>
                          <td colSpan={7} className="AccentFont">
                            No connections, yet.
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </Table>
              </Suspense>
            </ModalBody>
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  display: state.Modal.display,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  fetchPersonnel: () => dispatch(PersonnelActions.personnelFetchRequested()),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("USER_PC_CONFIG")),
    hide: () => dispatch(PreloaderActions.hidePreloader("USER_PC_CONFIG"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPcConfig);
