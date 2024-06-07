/**
 * PICSEL Router
 *
 * Handles routes that connects the backend functionalities to the frontend directory
 *
 * @description This sets up the proper methods (GET, POST, PUT, DELETE) for the routes of the application and exports them.
 * @author Rainier Pendon
 * @date 03/16/2024
 *
 * @description Added multer to routes and assigns signup function to it's corresponding route and method
 * @author Joseph Ryan Pena
 * @date 03/22/2024
 *
 * @description Added the route for logout.
 * @author Rainier John P. Pendon
 * @date 04/08/2024
 *
 * @description Added google authentication base route.
 * @author Jet Timothy V. Cerezo
 * @date 04/09/2024
 *
 * @description Added the route for approving and rejecting reservation request and other necessary function associated with it.
 * @author Joseph Ryan Pena
 * @date 04/10/2024
 *
 * @description Added the route for google authentication and other necessary function associated with it.
 * @author Jet Timothy V. Cerezo
 * @date 04/15/2024
 *
 * @description Added the routes for getting all schedules and getting all schedules of a room.
 * @author Eric Conrad Panga
 * @date 04/22/2024
 *
 * @description Added the route for create room.
 * @author Rafa Magno
 * @date 04/23/2024
 *
 * @description Added the route for edit room for superadmin
 * @author Joseph Ryan Pena
 * @date 04/21/2024
 *
 * @description Added the route for delete schedule for superadmin
 * @author Rainier John P. Pendon
 * @date 04/23/2024
 *
 * @description Added route for download attachments
 * @author Jet Timothy V. Cerezo
 * @date 04/23/2024
 *
 * @description Added the routes for edit schedule, create schedule, and delete room schedules.
 * @author Eric Conrad Panga
 * @date 04/25/2024
 *
 * @description Added routes for edit and delete user for super admin
 * @author Neil Vincent Alday
 * @date 04/28/2024
 *
 * @description Moved multer to middleware folder
 * @author Joseph Ryan P. Peña
 * @date 04/30/2024
 *
 * @description Added routes for delete all schedules
 * @author Rafa Magno
 * @date 04/30/2024
 *
 * @description Reorganized routes; implemented middleware
 * @author Rafa Magno
 * @date 05/10/2024
 *
 **/

const userRoutes = require("../controllers/user-controller.js");
const scheduleRoutes = require("../controllers/schedule-controller.js");
const requestRoutes = require("../controllers/request-controller.js");
const roomRoutes = require("../controllers/room-controller.js");
const logRoutes = require("../controllers/log-controller.js");
const announcementRoutes = require("../controllers/announcement-controller.js");
const { verifyUser } = require("../middlewares/user-middleware.js");
const express = require("express");
const { getBaseUrl } = require("../config.js");
const toggleRoutes = require("../controllers/toggle-controller.js");

// let clients = [];

// const eventsHandler = (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     const clientId = Date.now();
//     clients.push({ id: clientId, res });

//     req.on('close', () => {
//         console.log(`Client ${clientId} disconnected from ${getBaseUrl()}`);
//         clients = clients.filter(client => client.id !== clientId);
//     });
// };

// const sendSSEMessage = (data) => {
//     console.log(clients);
//     clients.forEach(client => {
//         client.res.write(`data: ${data}\n\n`);
//     });
// };

// const changeHandler = (req, res) => {
//     console.log('Database change detected at ' + getBaseUrl());
//     sendSSEMessage('Database has been updated');
//     res.sendStatus(200);
// };

const upload = require("../middlewares/multer.js");

const appRoutes = (app) => {
    app.get("/",(req, res) => {
        res.send("API Home");
    });

    // UNPROTECTED ROUTES
    app.post("/user/signup", upload.single("image"), userRoutes.signup);
    app.post("/user/login", userRoutes.login);
    app.post("/user/classify", userRoutes.classify);
    app.post("/user/google-classify", userRoutes.googleClassify);
    app.post("/auth/google/verify", userRoutes.googleVerifier);
    app.post("/auth/google", userRoutes.googleAuth);
    app.get("/auth/google/callback", userRoutes.googleAuthCallback);
    app.get("/permission/getswitches", toggleRoutes.getSwitches);
    app.get("/room/getrooms", roomRoutes.getRooms);
    app.get("/user/session", userRoutes.checkIfLoggedIn);
    
    // PROTECTED ROUTES
    // USER ROUTES
    app.get("/user/getuserinfo",verifyUser, userRoutes.getUserInfo);
    app.get("/user/:userId/getuserinfousinguserid",verifyUser,userRoutes.getUserInfoUsingUserId);
    app.get("/user/getallguests",verifyUser, userRoutes.getAllGuests);
    app.get("/user/getallusers",verifyUser, userRoutes.getAllUsers);
    app.post("/user/:user_id/update",verifyUser,upload.single("image"),userRoutes.updateUserInfo);
    app.post("/user/logout",verifyUser, userRoutes.logout);
    app.delete("/user/:user_id/delete", verifyUser, userRoutes.deleteUserInfo);

    // SCHEDULE ROUTES
    app.post("/schedule/createschedule",verifyUser, scheduleRoutes.createSchedule);
    app.get("/schedule/getschedules",verifyUser, scheduleRoutes.getSchedules);
    app.get("/schedule/:roomId/getroomschedules",verifyUser,scheduleRoutes.getRoomSchedules);
    app.post("/schedule/:scheduleId/editschedule",verifyUser, scheduleRoutes.editSchedule);
    app.post("/schedule/:scheduleId/deleteschedule",verifyUser,scheduleRoutes.deleteSchedule);
    app.delete("/schedule/:roomId/deleteroomschedules",verifyUser,scheduleRoutes.deleteRoomSchedules);
    app.delete("/schedule/deleteallschedules",verifyUser,scheduleRoutes.deleteAllSchedules);

    // REQUEST ROUTES
    app.post("/request/createrequest",verifyUser, requestRoutes.createRequest);
    app.post("/request/:requestId/uploadattachments",verifyUser,upload.array("attachments"),requestRoutes.uploadAttachments);
    app.get("/request",verifyUser, requestRoutes.getUserReservationRequest);
    app.get("/request/getrequest",verifyUser, requestRoutes.getRequests);
    app.get("/request/getfinalizedrequestssr",verifyUser,requestRoutes.getFinalizedRequestsSR);
    app.get("/request/finalizedrequests",verifyUser, requestRoutes.getFinalizedRequests);
    app.get("/request/:roomName/roomrequests",verifyUser,requestRoutes.getRoomFinalizedRequests);
    app.get("/request/:requestId/getattachments",verifyUser, requestRoutes.getAttachments);
    app.get("/request/:requestId/downloadattachments/:userId",verifyUser,requestRoutes.downloadAttachments);
    app.get("/request/:requestId/getuserrequestusingid",verifyUser,requestRoutes.getUserRequestUsingId);
    app.post("/request/edit/:requestId",verifyUser, requestRoutes.editReservation);
    app.post("/request/:requestId/approve",verifyUser,requestRoutes.approveReservationRequest);
    app.post("/request/:requestId/disapprove",verifyUser,requestRoutes.disapproveReservationRequest);
    app.post("/request/:requestId/finalize",verifyUser,requestRoutes.finalizeReservationRequest);
    app.post("/request/cancel/:requestId",verifyUser, requestRoutes.cancelReservation);
    app.post("/request/:requestId/delete",verifyUser,requestRoutes.deleteReservationRequest);
    app.post("/request/canceloverduerequests",verifyUser,requestRoutes.cancelOverdueRequests);

    // ROOM ROUTES
    app.post("/room/createroom",verifyUser, upload.array("images"), roomRoutes.createRoom);
    app.get("/room/getroomusageoverview",verifyUser, roomRoutes.getRoomUsageOverview);
    app.get("/room/getrevenuegeneration",verifyUser, roomRoutes.getRevenueGeneration);
    app.post("/room/:roomId/edit",verifyUser, upload.array("images"), roomRoutes.editRoom);
    app.post("/room/updateroomimg/:roomId",verifyUser,upload.single("image"),roomRoutes.updateRoomImages);
    app.post("/room/:roomId/delete",verifyUser, roomRoutes.deleteRoom);

    // LOG ROUTES
    app.post("/api/inquire",verifyUser, logRoutes.createJetLog);
    app.get("/log/getlogs",verifyUser, logRoutes.getOwnLogs);
    app.get("/log/getalllogs",verifyUser, logRoutes.getAllLogs);
    app.post("/log/deleteOwnLogs",verifyUser, verifyUser, logRoutes.deleteAllLogs);

    // SUPERADMIN ROUTES
    app.post("/user/:userId/superdeleteuser",verifyUser, userRoutes.superAdminDeleteUser);
    app.post("/user/:userId/superedituser",verifyUser, upload.single("image"), userRoutes.superAdminUpdateUserInfo);
    app.delete("/user/deleteallusers",verifyUser, userRoutes.superAdminDeleteAllUsers);

    // ANNOUNCEMENT ROUTES
    app.get("/announcement/getannouncements",verifyUser,announcementRoutes.getAnnouncements);
    app.post("/announcement/:announcementId/editannouncement",verifyUser,announcementRoutes.editAnnouncement);

    // FLIP SWITCH ROUTES
    app.post("/permission/flipswitches", verifyUser, toggleRoutes.flipSwitch);

};

module.exports = appRoutes;
