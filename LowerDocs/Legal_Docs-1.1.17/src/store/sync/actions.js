import {
  Set_Sync_Data,
  Get_Sync_Data,
  Set_Sync_Info,
  Get_Sync_Info,
  Set_Sync_Info_Cb,
  Set_Sync_Info_Update,
  Set_Sync_Data_Cb,
  } from "./actionTypes";
  
  
  
  export const setSyncData = (data) => {
    return { type: Set_Sync_Data, payload: data };
  };
  export const getSyncData = (data) => {
    return { type: Get_Sync_Data, payload: data };
  };


  export const setSyncInfo = (data) => {
    return { type: Set_Sync_Info, payload: data };
  };
  export const getSyncInfo = (data) => {
    return { type: Get_Sync_Info, payload: data };
  };


  export const setSyncInfoCb = (data) => {
    return { type: Set_Sync_Info_Cb, payload: data };
  };
  export const setSyncInfoUpdate = (data) => {
    return { type: Set_Sync_Info_Update, payload: data };
  };
  export const setSyncDataCb = (data) => {
    return { type: Set_Sync_Data_Cb, payload: data };
  };