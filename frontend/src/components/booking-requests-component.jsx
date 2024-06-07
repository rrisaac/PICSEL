/**
 * Booking Requests Component
 * 
 * @description This component renders booking reservations
 * for approval/disapproval by the administration.
 * @author Gacel Perfinian
 * @date 03/28/2024
 * 
 * @description Changes were made to add a filter to the bookings.
 * @author Jan Andrew Senires
 * @date 04/02/2024
 * 
 * @description Integrated getting all user reservation requests
 * @author Joseph Ryan Peña
 * @date 04/12/2024
 * 
 * @description Updated for responsiveness on mobile devices.
 * @author Gacel Perfinian
 * @date 04/13/2024
 * 
 * @description Refactored file to use constants from constant.js
 * @author Rheana Mindo
 * @date 04/16/2024
 * 
 * @description Ensure truncated request ID is all-uppercase
 * @author Gacel Perfinian
 * @date 04/20/2024
 * 
 * @description Refactored so that the actions shown are based on the component,
 * not on the user type.
 * @author Gacel Perfinian
 * @date 05/05/2024
 * 
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/09/2024
 */

import { BookingInfoComponent } from "./booking-info-component";
import React, { useState, useEffect } from 'react';
import StatusFilter from "./filter-sidebar-component.jsx";
import '../Neptune.css';
import * as api from "../utilities/api.js";
import AlertNotificationComponent from './alert-notification-component';

const BookingRequestsComponent = () => {
    const [showRequest, setShowRequest] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [reservations, setReservations] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const fetchData = async () => {
        try {
            const response = await api.currentReservationRequests();

            let reservationArr = [];
            let count = 0;
            response.data.reservationRequests.forEach((currentReservation) => {

                const reservation = {
                    id: count,
                    request_id: "REQ-"+currentReservation.reservationId.split("-")[0].toUpperCase(),
                    originalID: currentReservation.reservationId,
                    userType: currentReservation.userType,
                    userId: currentReservation.userId,
                    username: currentReservation.username,
                    currentReservationStatus: currentReservation.status,
                    title: currentReservation.title,
                    attachmentCount: currentReservation.attachmentCount,
                    purpose: currentReservation.details,
                    room_name: currentReservation.location,
                    reservation_date: currentReservation.date,
                    reservation_start_time: currentReservation.startTime,
                    reservation_end_time: currentReservation.endTime,
                };
                // Do something with reservation object
                reservationArr.push(reservation)
                count += 1;

            });
            setReservations(reservationArr);
            setShowRequest(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array to run this effect only once when the component mounts

    const handleStatusSelected = (status) => {
        setSelectedStatus(status);
    };
    
    const updateReservationStatus = (id, newStatus) => {

        setReservations(prevReservations =>
            prevReservations.map(reservation => {
                if (reservation.id === id)  {
                    reservation.currentReservationStatus = newStatus;
                    return reservation;
                } 
                return reservation;
            })
        );
    };

    // Filter reservations based on selected status
    const filteredReservations = selectedStatus ? reservations.filter(reservation => reservation.currentReservationStatus === selectedStatus) : reservations;

    const handleShowAlert = (success, message) => {
        setShowAlert(false);

        setTimeout(() => {
            setAlertSuccess(success);
            setAlertMessage(message);
            setShowAlert(true);
        }, 100); 
    };

    return (
        <>
        {showAlert && <AlertNotificationComponent success={alertSuccess} message={alertMessage} />}
        <div>
            <title>Booking Requests | PICSEL</title>
            <div className="page-description">
                <h1>Booking Requests</h1>
            </div>
            <div className="white-rectangle" style={{ 
                borderRadius: 15, 
                marginLeft: 0,
                marginRight: 8, 
                }}>
                {showRequest? (
                <div className="widget-stats-container d-flex" style={{flexGrow: 1, padding: 20, overflow: 'hidden'}}>
                    <div className="widget-stats-content flex-fill" style={{width: '100%'}}>
                        <div className="status-filter-container booking-info-container">
                            <div className="status-filter">
                                <StatusFilter onSelectStatus={handleStatusSelected} handleShowAlert={handleShowAlert} />
                            </div>
                            <div className="booking-request-container">
                                <ul className="booking-requests">
                                    {filteredReservations.map(reservation => (
                                        <BookingInfoComponent
                                            actionType="requests-actions"
                                            key={reservation.id}
                                            reservation={reservation}
                                            updateReservationStatus={(id, newStatus) => updateReservationStatus(id, newStatus)}
                                            reservationList={reservations}
                                            setReservationList={setReservations}
                                            handleShowAlert={handleShowAlert}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                ) : <div className="spinner-container">
                    <div className="spinner"></div>
                </div>}
            </div>
        </div>              
        </>
    );
}

export default BookingRequestsComponent;