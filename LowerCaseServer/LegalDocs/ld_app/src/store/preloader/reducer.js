import { HIDE_PRELOADER, SHOW_PRELOADER } from "./actionTypes";

const INIT_STATE = {
    display: false,
    callersQueue: [],
    
};

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  

const Preloader = (state = INIT_STATE, action) => {
	switch (action.type) {
		case SHOW_PRELOADER:
			return {
				...state,
                display: true,
                callersQueue: [...state.callersQueue, action.payload]
			};
        case HIDE_PRELOADER:
            const caller = action.payload;
            const callersQueue = removeItemOnce(state.callersQueue, caller);
            return {
                ...state,
                display: Boolean(callersQueue.length),
                callersQueue: callersQueue
            };
		
		default:
			return state;
	}
};

// const Preloader = (state = INIT_STATE, action) => {
// 	switch (action.type) {
// 		case SHOW_PRELOADER:
// 			return {
// 				...state,
//                 display: true,
//                 callersQueue: state.callersQueue+1
// 			};
//         case HIDE_PRELOADER:
//             const callersQueue = state.callersQueue-1;
            
//             return {
//                 ...state,
//                 display: Boolean(callersQueue),
//                 callersQueue: callersQueue
//             };
		
// 		default:
// 			return state;
// 	}
// };

export default Preloader;