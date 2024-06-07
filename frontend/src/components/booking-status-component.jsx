/**
 * Booking Status Component
 * 
 * @description This component renders booking reservations
 * status for the user.
 * @author Gacel Perfinian
 * @date 03/30/2024
 * 
 * @description Changes were made to add a filter to the bookings.
 * @author Jan Andrew Senires
 * @date 04/02/2024
 * 
 * @description Allows dynamic data for reservations through backend and database integration
 * @author Rafa Magno
 * @date 04/05/2024
 * 
 * @description Updated for responsiveness on mobile devices.
 * @author Gacel Perfinian
 * @date 04/13/2024
 * 
 * @description Refactored file to use constants from constant.js
 * @author Rheana Mindo
 * @date 04/16/2024
 * 
 * @description Ensure that the status filter and the truncated request ID is shown
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
import * as api from "../utilities/api";
import AlertNotificationComponent from './alert-notification-component';

const BookingStatusComponent = () => {
    const [showStatus, setShowStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [reservations, setReservations] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        fetchReservations(); 
    }, []); 

    const fetchReservations = async () => {    
        try {
            const result = await api.getRequest();
            if (result.data && result.data.success) {
                let reservationArr = [];
                let count = 0;
                result.data.requests.forEach(rq => {
                    const newRq =  {
                        ...rq,
                        id: count,
                        original_request_id: rq.request_id,
                        request_id: "REQ-"+rq.request_id.split("-")[0].toUpperCase(),
                        attachmentCount: rq.attachments === null ? 0 : rq.attachments.length,
                    }
                    // Do something with reservation object
                    reservationArr.push(newRq)
                    count += 1;
                });
                setReservations(reservationArr);
                setShowStatus(true);
            }
        } catch (error) {
            console.error("Error during fetchReservations:", error.message);
            return;
        }
    };

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
    const filteredReservations = selectedStatus ? reservations.filter(reservation => reservation.request_status === selectedStatus) : reservations;

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
            <title>Booking Status | PICSEL</title>
            <div className="page-description">
                <h1>Booking Status</h1>
            </div>
            <div className="white-rectangle" style={{ 
                borderRadius: 15, 
                marginLeft: 0,
                marginRight: 8, 
                }}>
                {showStatus? (
                <div className="widget-stats-container d-flex" style={{flexGrow: 1, padding: 20, overflow: 'hidden'}}>
                    <div className="widget-stats-content flex-fill" style={{ width: '100%' }}>
                        <div className="status-filter-container booking-info-container">
                            <div className="status-filter">
                                <StatusFilter onSelectStatus={handleStatusSelected} />
                            </div>
                            <div className="booking-request-container">
                                <ul className="booking-status">
                                    {filteredReservations.map(reservation => (
                                        <BookingInfoComponent
                                            actionType="status-actions"
                                            key={reservation.id}
                                            reservation={reservation}
                                            updateReservationStatus={(id, newStatus) => updateReservationStatus(id, newStatus)}
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

export default BookingStatusComponent;