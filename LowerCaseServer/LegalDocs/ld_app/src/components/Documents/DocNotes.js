import React, { Component } from 'react';
import Icon from "react-icofont"
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
class DocNotes extends Component {
	state = {  }
	render() { 
		const {description, DOC_ID} = this.props
		return ( 
			<>
			<header className="d-flex align-items-center justify-content-between DocNotesHeader pb-1">
				<h6 className="AccentFont">Document Notes</h6>
				<Icon icon="icofont-edit-alt f" 
				onClick={() =>
					this.props.showModal("DOC_DESC_EDITOR", {
						description: description,
						DOC_ID,
						onSubmit: async () => {
							const { Update } = this.props;

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

export default connect(null, mapDispatchToProps)(DocNotes);