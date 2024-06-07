/*
Description: This file contains the activity log component. 
An activity log contains a request id, room, event date, time start, time end, 
status, date created, and remarks. It can be updated or deleted.

@author Aljon Novelo
@date 04/07/2024
*/

/**
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

import React, { useState, useEffect } from "react";
import AccountDashboardModalComponent from './account-dashboard-modal-component';
import DataTablesComponent from "./datatables-component";
import * as api from "../utilities/api";
import { EMPTY, USER_TYPES, LOG_GROUPS } from "../utilities/constant";
import AlertNotificationComponent from './alert-notification-component';

const ActivityLog = () => {
    // Initialize the state of logs 
    const [showActivityLog, setShowActivityLog] = useState(false);
    // eslint-disable-next-line
    const [logDetails, setLogDetails] = useState([]);
    const [logData, setLogData] = useState([]);
    const [logsLoaded, setLogsLoaded] = useState(false);
    const [userType, setUserType] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showTab, setShowTab] = useState('all');

    // Update the state of logs
    useEffect(() => {
        // Fetch user type
        if (userType) {
            if (userType === USER_TYPES.ADMIN || userType === USER_TYPES.SUPER_ADMIN) {
                fetchAllLogs(setLogData, setLogsLoaded(true));
            } else {
                fetchLogs(setLogData);
            }
        } else {
            fetchUserType(setUserType);
        }
    }, [userType]);

    // Modal Section
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteButtonClick = () => {
        setShowDeleteModal(true); // Open the modal
    };
    
    // Function to fetch all logs from the database
    const fetchAllLogs = async (setLogDetails) => {
        try {
            // Get all logs and requests
            const allLogs = await api.getAllLogs();
            const allRequests = await api.currentReservationRequests();

            // Combine the logs and requests using the request_id and reservationId
            const logDetails = allLogs.data.map((log) => {
                const bookingRequest = Object.values(allRequests.data.reservationRequests).find((request) => request.reservationId === log.request_id);
                    return {
                        logId: `LOG-${log.log_id.slice(0,8).toUpperCase()}`,
                        requestId: log.request_id === null ? EMPTY : "REQ-" + log.request_id.split("-")[0].toUpperCase(),
                        logStatus: log.log_type,
                        dateCreated: formatDate(log.created_at),
                        remarks: log.remarks,
                        room: bookingRequest ? bookingRequest.location : EMPTY,
                        eventTitle: bookingRequest ? bookingRequest.title : EMPTY,
                        eventDate: bookingRequest ? formatDate(bookingRequest.date) : EMPTY,
                        timeStart: bookingRequest ? formatTime(bookingRequest.startTime) : EMPTY,
                        timeEnd: bookingRequest ? formatTime(bookingRequest.endTime) : EMPTY,
                        isVisible: true
                    };
            });

            // Update the state of logs
            setLogDetails(logDetails);
            setShowActivityLog(true);

            // Error handling
        } catch (error) {
            console.error("Error during GET request:", error);
        }
    };

// Function to fetch logs from the database
const fetchLogs = async (setLogDetails) => {
    try {
        // Get the logs and booking requests of the user
        const userLogs = await api.getOwnLogs();
        const userBookingRequests = await api.getRequest();

        // Create a map of booking requests for easier lookup
        const bookingRequestMap = Object.values(userBookingRequests.data.requests).reduce((map, request) => {
            map[request.request_id] = request;
            return map;
        }, {});

        // Combine the logs and booking requests
        const logDetails = Object.values(userLogs.data).map((log) => {
            const bookingRequest = bookingRequestMap[log.request_id];
            return {
                logId: `LOG-${log.log_id.slice(0,8).toUpperCase()}`,
                requestId: log.request_id === null ? EMPTY : "REQ-" + log.request_id.split("-")[0].toUpperCase(),
                logStatus: log.log_type,
                dateCreated: formatDate(log.created_at),
                remarks: log.remarks,
                room: bookingRequest ? bookingRequest.room_name : EMPTY,
                eventTitle: bookingRequest ? bookingRequest.title : EMPTY,
                eventDate: bookingRequest ? formatDate(bookingRequest.reservation_date) : EMPTY,
                timeStart: bookingRequest ? formatTime(bookingRequest.reservation_start_time) : EMPTY,
                timeEnd: bookingRequest ? formatTime(bookingRequest.reservation_end_time) : EMPTY,
                isVisible: true
            };
        });

        // Update the state of logs
        setLogDetails(logDetails);
        setShowActivityLog(true);

    } catch (error) {
        console.error("Error during GET request:", error);
    }
};

    const renderModal = (value, onConfirm, showModal, setShowModal) => {
        if (showModal) {
            return (
                <AccountDashboardModalComponent
                    showModal={showModal}
                    handleClose={() => setShowModal(false)}
                    value={value}
                    onConfirm={onConfirm}
                />
            );
        }
        return null;
    };
    // END of MODAL Section

    const renderAlert = (success, message) => {
        if (showAlert) {
            return (
               <AlertNotificationComponent
                    success={success}
                    message={message}
               />
            );
        }
        return null;
    };

    // Used by SUPER_ADMIN to delete all logs
    const deleteAllLogs = async (remarks) => {
        try {
            // Delete all logs
            const data = {
                remarks: remarks
            }
            const options = { body : data }
            const result = await api.deleteAllLogs(options);
            if (result.data.success) {
                setAlertSuccess(true);
                setAlertMessage(result.data.message);
                setShowAlert(true);
            }

            // Error handling
        } catch (error) {
            console.error("Error during DELETE request: ", error);
            setAlertSuccess(false);
            setAlertMessage(error.response.data.message);
            setShowAlert(true);
        }
    };

    return (
        <>
            {renderAlert(alertSuccess, alertMessage)}
            <div>
                <title>Activity Log | PICSEL</title>
                <div className="page-description">
                    <h1>Activity Log</h1>
                </div>
                <div
                    className="white-rectangle"
                    style={{
                        borderRadius: 15,
                        marginLeft: 0,
                        marginRight: 8,
                    }}
                >
                    {showActivityLog? (
                    <>
                    <div className="widget-stats-container d-flex" style={{flexGrow: 1, padding: 20, overflow: 'hidden'}}>
                        <div className="widget-stats-content flex-fill" style={{width: '100%'}}>
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <button className={"nav-link ".concat((showTab === "all")? "active": "")} onClick={() => (showTab !== "all") && setShowTab("all")} type="button">All</button>
                                </li>
                                <li className="nav-item">
                                    <button className={"nav-link ".concat((showTab === "requests")? "active": "")}  onClick={() => (showTab !== "requests") && setShowTab("requests")} type="button">Requests</button>
                                </li>
                                {[USER_TYPES.SUPER_ADMIN, USER_TYPES.ADMIN, USER_TYPES.GUEST].includes(userType) && (
                                <li className="nav-item">
                                    <button className={"nav-link ".concat((showTab === "inquiries")? "active": "")}  onClick={() => (showTab !== "inquiries") && setShowTab("inquiries")} type="button">Inquiries</button>
                                </li>
                                )}
                                <li className="nav-item">
                                    <button className={"nav-link ".concat((showTab === "other")? "active": "")}  onClick={() => (showTab !== "other") && setShowTab("other")} type="button">Other</button>
                                </li>
                            </ul>
                            <div className="tab-content m-t-md">
                                {showTab === "all" && <div className="tab-pane show active" id="all-pane"><DataTablesComponent key="all-table" id="all-table" columns={ACTIVITY_LOG_DT_COLUMN_DEFINITION} data={logData}/></div>}
                                {showTab === "requests" && <div className="tab-pane show active" id="requests-pane"><DataTablesComponent key="requests-table" id="requests-table" columns={ACTIVITY_LOG_DT_COLUMN_DEFINITION} data={logData.filter((x) => LOG_GROUPS.REQUESTS.includes(x.logStatus))}/></div>}
                                {showTab === "inquiries" && <div className="tab-pane show active" id="inquiries-pane"><DataTablesComponent key="inquiries-table" id="inquiries-table" columns={ACTIVITY_LOG_DT_COLUMN_DEFINITION} data={logData.filter((x) => LOG_GROUPS.INQUIRIES.includes(x.logStatus))}/></div>}
                                {showTab === "other" && <div className="tab-pane show active" id="other-pane"><DataTablesComponent key="other-table" id="other-table" columns={ACTIVITY_LOG_DT_COLUMN_DEFINITION} data={logData.filter((x) => LOG_GROUPS.OTHER.includes(x.logStatus))}/></div>}
                            </div>
                            {userType === USER_TYPES.SUPER_ADMIN && <button type="button" className={`btn btn-danger log-delete-all m-t-md ${!logsLoaded || logData.length === 0 ? 'delete-button-disable' : ''}`} onClick={handleDeleteButtonClick} disabled={!logsLoaded || logData.length === 0} style={{width:"100%"}}>Delete All Logs</button>}
                        </div>
                    </div>
                    {renderModal('delete log', (remarks) => deleteAllLogs(remarks), showDeleteModal, setShowDeleteModal)}
                    </>
                    ) : <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>}
                </div>
            </div>
        </>
    );
};

// DataTables Definition
const ACTIVITY_LOG_DT_COLUMN_DEFINITION = [
    {title: "Log ID", data: "logId", className: "usertable-nowrap", responsivePriority: 0},
    {title: "Log Status", data: "logStatus", className: "usertable-nowrap", responsivePriority: 0},
    {title: "Date Created", data: "dateCreated", className: "usertable-nowrap", responsivePriority: 0},
    {title: "Request ID", data: "requestId", className: "usertable-nowrap", responsivePriority: 0},
    {title: "Room", data: "room", className: "usertable-nowrap", responsivePriority: 0},
    {title: "Event Title", data: "eventTitle", responsivePriority: 0},
    {title: "Event Date", data: "eventDate", className: "usertable-nowrap", responsivePriority: 0},
    {title: "Start", data: "timeStart", className: "usertable-nowrap", responsivePriority: 0},
    {title: "End", data: "timeEnd", className: "usertable-nowrap", responsivePriority: 0},
    {title: "Remarks", data: "remarks", className: "usertable-forcehide", responsivePriority: 10003},
]

// Get the user type of the current user
const fetchUserType = async (setUserType) => {
    try {
        // Get the user type
        const userType = await api.getUserInfo();

        // Update the state of userType
        setUserType(userType.data.user_type);

        // Error handling
    } catch (error) {
        console.error("Error during GET request:", error);
    }
};

// Formats the date into a readable format (ex. January 1, 2024)
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

// Formats the time into a 12-hour format (ex. 1:00 PM)
const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hourIn12HourFormat = ((hours % 12) || 12).toString();
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${hourIn12HourFormat}:${minutes} ${period}`;
};

export default ActivityLog;