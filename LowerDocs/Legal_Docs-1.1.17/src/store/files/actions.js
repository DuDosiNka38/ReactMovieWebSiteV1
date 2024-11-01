import {
  Request_Files,
  Get_Files,
} from "./actionTypes";



export const requestedFiles = (data) => {
  return { type: Request_Files, payload: data };
};
export const getFiles = (data) => {
  return { type: Get_Files, payload: data };
};


