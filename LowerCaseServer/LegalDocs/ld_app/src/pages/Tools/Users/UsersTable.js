import React, { Component } from "react";
import { Table } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../../store/modal/actions";
import * as PersonnelActions from "./../../../store/personnel/actions";

class UserTable extends Component {
  state = {
    users: [],
  };

  componentDidMount() {
    this.props.fetchPersonnel();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.users !== this.props.users){
      this.setState({users: this.props.users});
    }
  }
  
  render() {
    const { users } = this.state;
    const { showPerson } = this.props;
    const data = showPerson ? users.filter((x) => x.Role === null) : users.filter((x) => x.Role !== null);
    
    return (

      <>
        <Table className="customTable mb-0">
          <thead>
            <tr>
              <td>Person id</td>
              <td>Name</td>
              <td>Email</td>
              <td>Phone</td>
              {showPerson && <td>Case</td>}
              <td>Role</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {data
             
              .map((x) => (
                <tr key={x.PersonnelActions}>
                  <td>{x.Person_id}</td>
                  <td>{x.NAME}</td>
                  <td>{x.Email_address}</td>
                  <td>{x.Phone_number}</td>
                  {showPerson && <td>Case</td>}
                  <td>{x.Role}</td>
                  <td className="d-flex">
                    <spann
                      className="flat-icon user-geer font-size-20 d-flex justify-content-center align-items-center"
                      title="settings"
                      onClick={()=> this.props.showModal("UPDATE_USER", {UserData: x, onSuccess: this.props.fetchPersonnel})}

                    >
                      <i className="ri-user-settings-line"></i>
                    </spann>
                    {x.Role !== null && (
                      <spann
                      className={`flat-icon user-pc font-size-20  d-flex justify-content-center align-items-center ${x.Not_Approved_Computers > 0  && "new_action" }`}
                      title="computers"
                      onClick={()=> this.props.showModal("USER_PC_CONFIG", {User_id: x.Person_id, User_name : x.NAME})}
                    >
                      <i className="ri-mac-line"></i>
                    </spann>
                    ) }
                    <spann
                      className="flat-icon user-del font-size-20  d-flex justify-content-center align-items-center"
                      title="delete"
                      onClick={()=> this.props.showModal("USER_DELETE", {User_id: x.Person_id, User_name : x.NAME, onSuccess: this.props.fetchPersonnel})}
                    >
                      <i className="ri-delete-bin-line"></i>
                    </spann>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  modalType: state.Modal.type,
  users: state.Personnel.personnel,
  isLoading: state.Personnel.loading,
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  fetchPersonnel: () => dispatch(PersonnelActions.personnelFetchRequested()),
});

export default connect(mapStateToProps, mapDispatchToProps)( UserTable);

