import { nanoid } from "nanoid";
import { ADD_PROGRESS_MODAL, ADD_PROGRESS_MODALS, HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL, UPDATE_PROGRESS_MODAL } from "./actionTypes";

const EXAMPLE = {
  type: "EXAMPLE_MODAL",
  component: "<Component/>",
};
const INIT_STATE = {
  modals: [],
  display: false,
  displayed: [],
  type: null,
  minimized: [],
  reload: false
};

const ProgressModal = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_PROGRESS_MODAL: {
      const { type, component } = action.payload;
      if (state.modals.find((x) => x.type === type) === undefined) {
        state.modals.push({ type, component });
      }
      return {
        ...state,
      };
    }

    case ADD_PROGRESS_MODALS: {
      const { modals } = action.payload;

      modals.map(({type, component}) => {
        if (state.modals.find((x) => x.type === type) === undefined) {
          state.modals.push({ type, component });
        }
      })
            
      return {
        ...state,
      };
    }

    case SHOW_PROGRESS_MODAL: {
      const { type, props, cb } = action.payload;
      const { modals } = state;
      let displayed = [...state.displayed];
      const modalIndex = modals.findIndex((x) => x.type === type);

      if(modalIndex === -1)
        return state;
      
      // if(modalIndex !== -1){
      //   modals[modalIndex].props = props;
      // }

      const showModal = {
        type, 
        _id: nanoid(),
        props,
      }

      if(cb && typeof cb === "function"){
        cb(showModal);
      }

      return {
        ...state,
        displayed: [...displayed, showModal],
        modals,
        reload: !state.reload
      }
    }

    case UPDATE_PROGRESS_MODAL: {
      const { type, props, _id } = action.payload;
      let displayed = [...state.displayed];
      const shownIndex = displayed.findIndex((x) => x._id === _id && x.type === type);

      if(shownIndex === -1)
        return state;
        
      displayed[shownIndex].props = props;

      return {
        ...state,
        displayed,
        reload: !state.reload
      }
    }

    case HIDE_PROGRESS_MODAL: {
      const { type, props, _id } = action.payload;
      let displayed = [...state.displayed];

      const shownIndex = displayed.findIndex((x) => x._id === _id && x.type === type);

      if(shownIndex === -1)
        return state;
      
      displayed.splice(shownIndex, 1);

      return {
        ...state,
        displayed: displayed,
        reload: !state.reload
      }
    }

    
    default:
      return state;
  }
};

export default ProgressModal;
