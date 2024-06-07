// Description: API routers
// @author Neil Vincent S. Alday
// @date 04/04/2024

// Description: Added APIs for google authentication
// @author Jet Timothy V. Cerezo
// @date 04/09/2024

// Description: Added getRequest and createRequest routes
// @author Rafa Magno
// @date 04/10/2024

// Description: Added getUserInfo, updateUserInfo, and deleteUserInfo routes
// @author Pamela Joy Santos
// @date 04/15/2024

// Description: Added attachment download routes
// @author Gacel Perfinian
// @date 04/24/2024

// Description: Added class schedule-related routes
// @author Gacel Perfinian
// @date 05/02/2024


import * as requestBuilder from "./request-builder";
import { get } from "lodash";

// Returns base URL
export const getBaseUrl = () => {
  const NODE_ENV = process.env.REACT_APP_NODE_ENV || "development";
  // For localhost deployment
  if (NODE_ENV === "development") {
    return "http://localhost:3000";
  } else if (NODE_ENV === "staging") {
    const stagingUrl = get(process.env, "REACT_APP_SERVER_URL");
    
    // For server deployment
    if (stagingUrl) {
      return stagingUrl;
    } else {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: "Missing STAGING-API url. Contact your app administrator.",
      };
    }
  }
};

// POST Logout
export const logOut = () => {
  const url = `${getBaseUrl()}/user/logout`;
  return requestBuilder.executeOpenPostRequest(url);
};

// POST Login
export const logIn = (options) => {
  const url = `${getBaseUrl()}/user/login`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// GET Login
export const logInGetter = () => {
  const url = `${getBaseUrl()}/user/session`;
  return requestBuilder.executeOpenGetRequest(url);
};

// POST Signup
export const signUp = (options) => {
    const url = `${getBaseUrl()}/user/signup`;
    return requestBuilder.executeOpenPostRequest(url, options);
}

// POST Classify
export const classify = (options) => {
    const url = `${getBaseUrl()}/user/classify`;
    return requestBuilder.executeOpenPostRequest(url, options);
}

// POST Google Classify
export const googleClassify = (options) => {
  const url = `${getBaseUrl()}/user/google-classify`;
  return requestBuilder.executeOpenPostRequest(url, options);
}

// GET Request
export const getRequest = () => {
  const url = `${getBaseUrl()}/request/getrequest`;
  return requestBuilder.executeOpenGetRequest(url);
};

// GET Request using Request ID
export const getUserRequestUsingId = (params) => {
  const url = `${getBaseUrl()}/request/${params}/getuserrequestusingid`;
  return requestBuilder.executeOpenGetRequest(url);
};

// POST Create request
export const createRequest = (options) => {
    const url = `${getBaseUrl()}/request/createrequest`;
    return requestBuilder.executeOpenPostRequest(url, options);
}

// GET currentReservationRequests
export const currentReservationRequests = () => {
  const url = `${getBaseUrl()}/request`;
  return requestBuilder.executeOpenGetRequest(url);
};

// POST ApproveReservationRequest
export const approveReservationRequest = (options,params) => {
  const url = `${getBaseUrl()}/request/${params}/approve`;
  return requestBuilder.executeOpenPostRequest(url, options);
}

// POST DisapproveReservationRequest
export const disapproveReservationRequest = (options,params) => {
  const url = `${getBaseUrl()}/request/${params}/disapprove`;
  return requestBuilder.executeOpenPostRequest(url, options);
}

// GET UserInformation
export const getUserInfo = () => {
  const url = `${getBaseUrl()}/user/getuserinfo`;
  return requestBuilder.executeOpenGetRequest(url);
};

// GET User Information Using User Id
export const getUserInfoUsingUserId = (params) => {
  const url = `${getBaseUrl()}/user/${params}/getuserinfousinguserid`;
  return requestBuilder.executeOpenGetRequest(url);
};

// POST Update UserInformation
export const updateUserInfo = (options, params) => {
  const url = `${getBaseUrl()}/user/${params}/update`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// POST Delete UserInformation
export const deleteUserInfo = (params) => {
  const url = `${getBaseUrl()}/user/${params}/delete`;
  return requestBuilder.executeOpenDeleteRequest(url);
};

// POST Google Auth
export const googleAuth = () => {
  const url = `${getBaseUrl()}/auth/google`;
  return requestBuilder.executeOpenPostRequest(url);
};

// GET Google Auth Callback
export const googleAuthCallback = () => {
  const url = `${getBaseUrl()}/auth/google/callback`;
  return requestBuilder.executeOpenGetRequest(url);
};

// POST Google Verify
export const googleVerify = (options) => {
  const url = `${getBaseUrl()}/auth/google/verify`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// POST FinalizeReservationRequest
export const finalizeReservationRequest = (options,params) => {
  const url = `${getBaseUrl()}/request/${params}/finalize`;
  return requestBuilder.executeOpenPostRequest(url, options);
}

// POST DeleteReservationRequest
export const deleteReservationRequest = (options,params) => {
  const url = `${getBaseUrl()}/request/${params}/delete`;
  return requestBuilder.executeOpenPostRequest(url, options);
}

// POST Edit Reservation
export const editReservation = (options,params) => {
  const url = `${getBaseUrl()}/request/edit/${params}`;
  return requestBuilder.executeOpenPostRequest(url, options);
}

// POST Cancel Reservation
export const cancelReservation = (options,params) => {
  const url = `${getBaseUrl()}/request/cancel/${params}`;
  return requestBuilder.executeOpenPostRequest(url, options);
}

// POST Upload Attachments
export const uploadAttachments = (options, params) => {
  const url = `${getBaseUrl()}/request/${params}/uploadattachments`;
  return requestBuilder.executeOpenPostRequest(url, options);
}

// GET Download Attachments
export const downloadAttachments = (params) => {
  const url = `${getBaseUrl()}/request/${params.requestId}/downloadattachments/${params.userId}`
  return requestBuilder.executeOpenBlobGetRequest(url);
}

// GET Fetch Rooms
export const getRooms = () => {
  const url = `${getBaseUrl()}/room/getrooms`;
  return requestBuilder.executeOpenGetRequest(url);
};

// POST Update Room Images
export const updateRoomImages = (options,params) => {
  const url = `${getBaseUrl()}/room/updateroomimg/${params}`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// GET All Finalized Requests
export const getFinalizedRequests = () => {
  const url = `${getBaseUrl()}/request/finalizedrequests`;
  return requestBuilder.executeOpenGetRequest(url);
}

// GET All Finalized Requests of a Room
export const getRoomFinalizedRequests = (params) => {
  const url = `${getBaseUrl()}/request/${params}/roomrequests`;
  return requestBuilder.executeOpenGetRequest(url);
}

// POST Create Room
export const createRoom = (options) => {
  const url = `${getBaseUrl()}/room/createroom/`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// POST Edit Room
export const editRoom = (options,params) => {
  const url = `${getBaseUrl()}/room/${params}/edit`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// POST Delete Room
export const deleteRoom = (options,params) => {
  const url = `${getBaseUrl()}/room/${params}/delete`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// GET All Users
export const getAllUsers = () => {
  const url = `${getBaseUrl()}/user/getallusers`;
  return requestBuilder.executeOpenGetRequest(url);
};

// POST Delete User from Super Admin
export const deteleUserSA = (options, params) => {
  const url = `${getBaseUrl()}/user/${params}/superdeleteuser`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// POST Edit User from Super Admin
export const editUserSA = (options, params) => {
  const url = `${getBaseUrl()}/user/${params}/superedituser`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// GET Own Logs
export const getOwnLogs = () => {
  const url = `${getBaseUrl()}/log/getlogs`;
  return requestBuilder.executeOpenGetRequest(url);
};

// GET All Logs
export const getAllLogs = () => {
  const url = `${getBaseUrl()}/log/getalllogs`;
  return requestBuilder.executeOpenGetRequest(url);
};

// POST Delete All Logs
export const deleteAllLogs = (options) => {
  const url = `${getBaseUrl()}/log/deleteOwnLogs`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// GET Fetch Rooms
export const getAllGuests = () => {
  const url = `${getBaseUrl()}/user/getallguests`;
  return requestBuilder.executeOpenGetRequest(url);
};

// GET Settings Component
// export const getSettingsComponent = () => {
//   const url = `${getBaseUrl()}/settings/fetch`;
//   return requestBuilder.executeOpenGetRequest(url);
// };

// POST Update Settings Component
// export const updateSettingsComponent = (settings) => {
//   const url = `${getBaseUrl()}/settings/update`;
//   return requestBuilder.executeOpenPostRequest(url, settings);

// GET Fetch Rooms
export const getAttachments = (params) => {
  const url = `${getBaseUrl()}/request/${params}/getattachments`;
  return requestBuilder.executeOpenGetRequest(url);
};

// GET Fetch Schedules
export const getSchedules = () => {
  const url = `${getBaseUrl()}/schedule/getschedules`;
  return requestBuilder.executeOpenGetRequest(url);
};

// GET Fetch Schedules By Room Id
export const getRoomSchedules = (params) => {
  const url = `${getBaseUrl()}/schedule/${params}/getroomschedules`;
  return requestBuilder.executeOpenGetRequest(url);
};


/// DELETE Schedule
export const deleteSchedule = (options, params) => {
  const url = `${getBaseUrl()}/schedule/${params}/deleteschedule`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// POST Edit Schedule 
export const editSchedule = (options, params) => {
  const url = `${getBaseUrl()}/schedule/${params}/editschedule`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

/// Create Schedule
export const createSchedule = (options) => {
  const url = `${getBaseUrl()}/schedule/createschedule`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// Create Log Entry Guest to Super Admin
export const createJetLog = (options) => {
  const url = `${getBaseUrl()}/api/inquire`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// Get all announcements
export const getAnnouncements = () => {
  const url = `${getBaseUrl()}/announcement/getannouncements`;
  return requestBuilder.executeOpenGetRequest(url);
};

/// EDIT announcement
export const editAnnouncement = (options, params) => {
  const url = `${getBaseUrl()}/announcement/${params}/editannouncement`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

// GET Room Usage Overview
export const getRoomUsageOverview = () => {
  const url = `${getBaseUrl()}/room/getroomusageoverview`;
  return requestBuilder.executeOpenGetRequest(url);
};

// GET Finalized Requests for Summary Report
export const getFinalizedRequestsSR = () => {
  const url = `${getBaseUrl()}/request/getfinalizedrequestssr`;
  return requestBuilder.executeOpenGetRequest(url);
};

// GET Revenue Generation
export const getRevenueGeneration = () => {
  const url = `${getBaseUrl()}/room/getrevenuegeneration`;
  return requestBuilder.executeOpenGetRequest(url);
};

export const flipSwitch = (options) => {
  console.log("api:", options);
  const url = `${getBaseUrl()}/permission/flipswitches`;
  return requestBuilder.executeOpenPostRequest(url, { body: options });
};

export const getSwitches = (options) => {
  const url = `${getBaseUrl()}/permission/getswitches`;
  return requestBuilder.executeOpenGetRequest(url, options);
};

export const cancelOverdueRequests = () => {
  const url = `${getBaseUrl()}/request/canceloverduerequests`;
  return requestBuilder.executeOpenPostRequest(url);
};