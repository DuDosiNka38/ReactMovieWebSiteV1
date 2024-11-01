import store from './../store';
import * as ModalActions from './../store/modal/actions';

const System = {
  showModal: (type, props) => {
    store.dispatch(ModalActions.showModal(type, props));
  },
  hideModal: (type, props) => {
    store.dispatch(ModalActions.hideModal(type, props));
  },

};

export default System;