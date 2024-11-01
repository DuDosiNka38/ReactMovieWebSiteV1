import {
    Set_Sync_Data,
    Set_Sync_Info,
    Set_Sync_Info_Cb,
    Set_Sync_Info_Update,
    Set_Sync_Data_Cb,
  } from "./actionTypes";
  
  const INIT_STATE = {
    syncData: {
      onUpdate: [],
    },
    syncInfo: {
      update: () => {},
      onUpdate: [],
      makedSyncs: [],
      scanTasks: {}
    },
  };
  
  const syncDataManage = (state = INIT_STATE, action) => {
    switch (action.type) {
      case Set_Sync_Data:
        setTimeout(() => {
          if(state.syncData.onUpdate !== undefined)
            state.syncData.onUpdate.map((cb) => cb())
        }, 1000);
        return {
          ...state,
          syncData: action.payload,
        };
      case Set_Sync_Info:
        setTimeout(() => {
          state.syncInfo.onUpdate.map((cb) => cb())
        }, 1000);
        return {
          ...state,
          syncInfo: Object.assign(state.syncInfo, action.payload)
        };
      
      case Set_Sync_Info_Cb:
        state.syncInfo.onUpdate.push(action.payload);
        return state;
      
      case Set_Sync_Info_Update:
        state.syncInfo.update = action.payload;
        return state;

      case Set_Sync_Data_Cb:
        state.syncData.onUpdate.push(action.payload);
        return state;
      
      default:
        return state;
    }
  };
  
  export default syncDataManage;
  