/**
 * Booking Reservation Information Component
 * 
 * @description This component renders the booking reservation
 * information, including its status and actions allowed.
 * @author Gacel Perfinian
 * @date 03/30/2024
 * 
 * @description Changes were made for the Status filter of the bookings.
 * @author Jan Andrew Senires
 * @date 04/02/2024
 * 
 * @description Added Constants for User Types, Room Names, Days of Week, 
 * Components, Request Statuses, and Log Types.
 * @author Eric Conrad Panga
 * @date 04/04/2024
 * 
 * @description Replaced hardcoded reservation details with retrieved data from database
 * Components, Request Statuses, and Log Types.
 * @author Rafa Magno
 * @date 04/10/2024
 * 
 * @description Updated for responsiveness on mobile devices.
 * @author Gacel Perfinian
 * @date 04/13/2024
 * 
 * @description Refactored file to use constants from constant.js
 * @author Rheana Mindo
 * @date 04/16/2024
 * 
 * @description Refactored so that the actions shown are based on the component,
 * not on the user type.
 * @author Gacel Perfinian
 * @date 05/05/2024
 * 
 * @description Displayed the time of the booking info
 * @author Pamela Joy Santos
 * @date 05/15/2024
 */

import BookingReservationStatusPillComponent from "./booking-reservation-status-pill-component";
import BookingRequestsActionsComponent from "./booking-requests-actions-component";
import BookingStatusActionsComponent from "./booking-status-actions-component";

const BookingInfoComponent = ({ actionType, reservation, updateReservationStatus, reservationList, setReservationList, handleShowAlert }) => {
    const {
        id,
        currentReservationStatus = reservation.request_status,
        reservationId = reservation.request_id,
        username = reservation.username,
        reservationTitle = reservation.title,
        reservationAttachmentCount = reservation.attachmentCount === null ? 0:reservation.attachmentCount,
        reservationDetails = reservation.purpose,
        reservationLocation = reservation.room_name,
        reservationDate = reservation.reservation_date,
        reservationStartTime = reservation.reservation_start_time,
        reservationEndTime = reservation.reservation_end_time
    } = reservation;

    const convertTo12HourFormat = (time24) => {
        var timeParts = time24.split(":");
        var hours = parseInt(timeParts[0]);
        var minutes = parseInt(timeParts[1]);

        var period = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)

        // Add leading zero to minutes if necessary
        minutes = minutes < 10 ? "0" + minutes : minutes;

        // Return formatted time
        return hours + ":" + minutes + " " + period;
    };

    return (
        <li className="div-like-container p-v-sm border-reservation">
            {/* Title, Status & attachment Part*/}
            <div className="flexmode p-v-xxs">
                <span className="title-status-block">
                    <h3 className="black-color reservation-component title-reservation-title">
                        <span className="reservation-id">[{reservationId}]</span> - {reservationTitle}
                    </h3>
                    <span className="title-reservation-status"><BookingReservationStatusPillComponent reservationStatus = {currentReservationStatus}/></span>
                </span>
                <span style={{display:'table-row'}}>
                    <i className="material-icons-outlined h3-like-font" style={{display:'table-cell'}}>attach_file</i>
                    <span className="h3-like-font" style={{display:'table-cell'}}>{reservationAttachmentCount}</span>
                </span>
            </div>
            {/* Details */}
            <p className="p-v-xxs">{reservationDetails}</p>
            <div className="p-v-xxs">
                <span className="p-r-sm">
                    <i className="material-icons-outlined p-r-xxs p-like-font">location_on</i>
                    <span className="p-like-font">{reservationLocation}</span>
                </span>
                <span className="p-r-sm">
                    <i className="material-icons-outlined p-r-xxs p-like-font">calendar_month</i>
                    <span className="p-like-font">{reservationDate}</span>
                </span>
                <span className="p-r-sm">
                    <i className="material-icons-outlined p-r-xxs p-like-font">schedule</i>
                    <span className="p-like-font">{convertTo12HourFormat(reservationStartTime)} - {convertTo12HourFormat(reservationEndTime)} </span>
                </span>
                {actionType === 'requests-actions' &&
                <span className="p-r-sm">
                    <i className="material-icons-outlined p-r-xxs p-like-font">account_circle</i>
                    <span className="p-like-font">{username}</span>
                </span>
                }
            </div>
            {/* Actions */}
            <div className="flexmode action-buttons p-v-xxs">
                {actionType === 'requests-actions' &&
                    <BookingRequestsActionsComponent
                    reservationStatus={currentReservationStatus}
                    reservation = {reservation}
                    setReservationStatus={(newStatus) => updateReservationStatus(id, newStatus)}
                    reservationList={reservationList}
                    setReservationList={setReservationList}
                    handleShowAlert={handleShowAlert}
                    />
                }
                {actionType === 'status-actions' &&
                    <BookingStatusActionsComponent
                    reservationStatus={currentReservationStatus}
                    reservation = {reservation}
                    setReservationStatus={(newStatus) => updateReservationStatus(id, newStatus)}
                    handleShowAlert={handleShowAlert}
                    />
                }
            </div>
        </li>
    );
}

export { 
    BookingInfoComponent 
};