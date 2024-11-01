import { maximizeModal } from "./actions";

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

const Modal = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "ADD_MODAL": {
      const { type, component } = action.payload;
      if (state.modals.find((x) => x.type === type) === undefined) {
        state.modals.push({ type, component });
      }
      return {
        ...state,
      };
    }

    case "ADD_MODALS": {
      const { modals } = action.payload;

      modals.map(({type, component}) => {
        if (state.modals.find((x) => x.type === type) === undefined) {
          state.modals.push({ type, component });
        }
      })

      console.log({
        ModalsInfo:{
        ModalsCount: state.modals.length,
        Modals: state.modals
      }})
      
      return {
        ...state,
      };
    }

    case "SHOW_MODAL": {
      const { type, props } = action.payload;
      const { modals, minimized } = state;
      let displayed = [...state.displayed];
      const modalIndex = modals.findIndex((x) => x.type === type);
      
      if(modalIndex !== -1){
        modals[modalIndex].props = props;
      }

      if(displayed.indexOf(type) !== -1){
        if(minimized.indexOf(type) !== -1){
          return Modal(state, maximizeModal(type));
        } else {
          return {...state};
        }
      }
        

      return {
        ...state,
        displayed: [...displayed, type],
        modals
      }
    }

    case "HIDE_MODAL": {
      const { type, props } = action.payload;
      const { modals } = state;
      let displayed = [...state.displayed];
      const modalIndex = modals.findIndex((x) => x.type === type);
      
      if(modalIndex !== -1){
        modals[modalIndex].props = props;
      }
      
      const index = type !== undefined ? displayed.indexOf(type) : displayed.length-1;
      displayed.splice(index, 1);

      return {
        ...state,
        displayed: displayed,
        modals
      }
    }

    case "MINIMIZE_MODAL": {
      const { type } = action.payload;
      let { modals, minimized, reload } = state;
      const modalIndex = modals.findIndex((x) => x.type === type);

      if(modalIndex !== -1){
        // modals[modalIndex].minimized = true;
        if(minimized.indexOf(type) === -1)
          minimized.push(type);
      }

      return {
        ...state,
        minimized,
        reload: !reload
      }
    }

    case "MAXIMIZE_MODAL": {
      const { type } = action.payload;
      let { modals, minimized, reload } = state;
      const modalIndex = modals.findIndex((x) => x.type === type);

      if(modalIndex !== -1){
        modals[modalIndex].minimized = false;
        minimized.splice(minimized.indexOf(type), 1);
      }

      return {
        ...state,
        modals,
        minimized,
        reload: !reload
      }
    }

    default:
      return state;
  }
};

export default Modal;
