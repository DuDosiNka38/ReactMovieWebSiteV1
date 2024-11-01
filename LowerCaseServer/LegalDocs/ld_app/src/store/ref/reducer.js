import { SET_REFFERER_DATA } from "./actionTypes";

const INIT_STATE = {
    reffererData: [],
};

const Ref = (state = INIT_STATE, action) => {
    switch (action.type) {
      case SET_REFFERER_DATA: {
        const { dataFor, data } = action.payload;
        return {
          ...state,
          reffererData: [...state.reffererData.filter((x) => x.dataFor !== dataFor), {dataFor, data}]
        };
      }
  
      default:
        return state;
    }
  };
  
  export default Ref;