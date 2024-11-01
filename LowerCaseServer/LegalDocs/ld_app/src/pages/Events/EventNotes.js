import React, { Component } from 'react';
import Icon from "react-icofont"
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
class EventNotes extends Component {
	state = {  }
	render() { 
		const {description, Activity_Name} = this.props

		return ( 
			<>
			<header className="d-flex align-items-center justify-content-between EventNotesHeader pb-1">
				<h6 className="AccentFont">Event Notes</h6>
				<Icon icon="icofont-edit-alt f" 
				onClick={() =>
          
					this.props.showModal("EDIT_EVENT_DESC", {
						description: description,
            Activity_Name,
						onSubmit: async () => {
							const { loadEvent:Update } = this.props;

							if(Update && typeof Update === "function")
								await Update();
						}
					})

				}
				></Icon>
			</header>
			<section className="NotesWrapper mt-1 cursor-pointer" >
			<ReactQuill theme="snow" value={description} modules = {{toolbar: null}}  readOnly />
				
			</section>
			</>
		 );
	}
}
 
// const mapStateToProps = (state) => ({
//   hostInfo: state.Main.hostInfo,
// });

const mapDispatchToProps = (dispatch) => ({
  // addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  // fetchDocForms: () => dispatch(DocsActions.docFormsFetchRequested()),
});

export default connect(null, mapDispatchToProps)(EventNotes);