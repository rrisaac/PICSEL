// Description: Request Builder
// @author Neil Vincent S. Alday
// @date 04/04/2024

// Description: Added Blob GET mode
// @author Gacel Perfinian
// @date 04/24/2024

// Description: Added middleware for user rsession
// @author Rafa Magno
// @date 05/10/2024

import axios from "axios";
import { get } from "lodash";

// Base utilities
const getBody = (options) => {
  return get(options, "body", {});
}

// AXIOS MIDDLEWARE - SESSION AUTHENTICATION
let isAlertShown = false;
axios.interceptors.response.use(
  response => {
    isAlertShown = false;
    return response;
  },
  error => {
    if (error.response && error.response.status === 440) {
      if (!(["/","/login","/signup","/terms-and-conditions","/privacy-policy","/room-list/:roomId", "/process","/about", "/classification", "/getRooms", "/google-sign-up-classification", "/getswitches", "/flipswitches"].includes(window.location.pathname) || window.location.pathname.startsWith("/room-list/")) && !isAlertShown) {
        isAlertShown = true;
        alert("Session expired");
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// POST
export const executeOpenPostRequest = (url, options) => {
    return axios.post(url, getBody(options), {headers: {"Access-Control-Allow-Origin": '*'}, withCredentials: true});
}

// GET
export const executeOpenGetRequest = (url) => {
  return axios.get(url, {headers: {"Access-Control-Allow-Origin": "*"}, withCredentials: true});
}

// Blob GET
export const executeOpenBlobGetRequest = (url) => {
  return axios.get(url, { responseType: 'blob', headers: { "Access-Control-Allow-Origin": "*" }, withCredentials: true });
}


// DELETE
export const executeOpenDeleteRequest = (url) => {
  return axios.delete(url, {headers: {"Content-Type": "multipart/form-data"}, withCredentials: true});
}