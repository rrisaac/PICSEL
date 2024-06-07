/**
 * Booking Status Actions Component
 * 
 * @description This component renders the actions done
 * by the user on a booking reservation request.
 * @author Gacel Perfinian
 * @date 03/30/2024
 * 
 * @description Refactored file to use constants from constant.js
 * @author Rheana Mindo
 * @date 04/16/2024
 * 
 * @description Integrated editing and cancelling reservation requests
 * @author Neil Vincent S. Alday
 * @date 04/17/2024
 * 
 * @description Successfully passed the reservation object to the modal component
 * @author Aira Nicole Natividad
 * @date 04/19/2024
 * 
 * @description updated "reservation_id" to "original_reservation_id" to synce changes with the FE
 * @author Gacel Perfinian
 * @date 04/20/2024
 * 
 * @description Various fixes to current code
 * @author Gacel Perfinian
 * @date 04/22/2024
 * 
 * @description Added attachment upload functionality
 * @author Gacel Perfinian
 * @date 04/22/2024
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

import { REQUEST_STATUSES } from '../utilities/constant';
import React, { useState } from "react";
import AccountDashboardModalComponent from './account-dashboard-modal-component';
import * as api from "../utilities/api.js";

const BookingStatusActionsComponent = ({ reservationStatus, reservation, setReservationStatus, handleShowAlert }) => {

    const timeList = {
        '--:--': {
          hour: 0,
          meridian: ''
        },
        '7:00 AM': {
          hour: 7,
          meridian: 'AM'
        },
        '8:00 AM': {
          hour: 8,
          meridian: 'AM'
        },
        '9:00 AM': {
          hour: 9,
          meridian: 'AM'
        },
        '10:00 AM': {
          hour: 10,
          meridian: 'AM'
        },
        '11:00 AM': {
          hour: 11,
          meridian: 'AM'
        },
        '12:00 PM': {
          hour: 12,
          meridian: 'PM'
        },
        '1:00 PM': {
          hour: 1,
          meridian: 'PM'
        },
        '2:00 PM': {
          hour: 2,
          meridian: 'PM'
        },
        '3:00 PM': {
          hour: 3,
          meridian: 'PM'
        },
        '4:00 PM': {
          hour: 4,
          meridian: 'PM'
        },
        '5:00 PM': {
          hour: 5,
          meridian: 'PM'
        },
        '6:00 PM': {
          hour: 6,
          meridian: 'PM'
        },
        '7:00 PM': {
          hour: 7,
          meridian: 'PM'
        },
        '8:00 PM': {
          hour: 8,
          meridian: 'PM'
        },
        '9:00 PM': {
          hour: 9,
          meridian: 'PM'
        },
        '10:00 PM': {
          hour: 10,
          meridian: 'PM'
        },
      };

    const handleCancel = async (remarks, reservation) => {
        const data = {
            userId: reservation.user_id,
            remarks: remarks
        }

        const options = {body:data};

        try{
            const result = await api.cancelReservation(options, reservation.original_request_id);
            if (result.data.success) {
                handleShowAlert(true, result.data.message);
                setReservationStatus(REQUEST_STATUSES.CANCELLED)
            } else {
                handleShowAlert(false, result.data.message);
            }
        } catch (error) {
            console.error("Error during POST request:", error.message);
            handleShowAlert(false, error.response.data.message);
        }
    }

    const convertToHHMMSS = (input_time) => {
        let hour = timeList[input_time].hour;
        let meridian = timeList[input_time].meridian;
    
        if (meridian === 'PM') { hour += 12; };
        hour = hour % 24;
        return `${hour.toString().padStart(2, '0')}:00:00`;
    } 

    //userId, roomId, title, date, startTime, endTime, purpose, remarks
    const handleUpdate = async ( updatedDetails, reservation) => {  
        try {
            const storedDetails = updatedDetails;

            if (storedDetails) {
                const data = {
                    userId: reservation.user_id,
                    room_name: updatedDetails.room,
                    title: reservation.title,
                    date: updatedDetails.date,
                    startTime: convertToHHMMSS(updatedDetails.startTime), //should be in format of 10:00:00
                    endTime: convertToHHMMSS(updatedDetails.endTime),
                    purpose: updatedDetails.purpose,
                }

                const options = {body:data};
    
                const result = await api.editReservation(options, reservation.original_request_id);
                
                if (result.data.success) {
                    handleShowAlert(true, result.data.message);
                } else {
                    handleShowAlert(false, result.data.message);
                }
    
            } else {
                console.log('No details found in localStorage.');
            }
        } catch (error) {
            console.error("Error during fetchReservations:", error.message);
            handleShowAlert(false, error.response.data.message);
            return;
        }
    };

    // Modal Section

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFilesChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
        setShowUploadModal(true); // Open the modal
    };

    const handleCancelButtonClick = () => {
        setShowCancelModal(true); // Open the modal
    };

    const handleUpdateButtonClick = () => {
        setShowUpdateModal(true); // Open the modal
    };

    const handleUploadClose = () => {
        setSelectedFiles([]);
        setShowUploadModal(false);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("requestId", reservation.original_request_id);
        for (let i = 0; i < document.getElementById("reservationAttachmentUpload" + reservation.request_id).files.length; i++){
            formData.append("attachments", document.getElementById("reservationAttachmentUpload" + reservation.request_id).files[i]);
        }

        try {
            const options = { body: formData };
            const result = await api.uploadAttachments(options, reservation.original_request_id);

            if (result.data.success) {
                handleShowAlert(true, result.data.message);
            } else {
                handleShowAlert(false, result.data.message);
            }
        } catch (error) {
            console.error("Error during POST request:", error.message);
            handleShowAlert(false, error.response.data.message);
        }
        setShowUploadModal(false);
    };

    const renderModal = (value, onConfirm, showModal, setShowModal, initialData) => {
        if (showModal) {
            return (
                <AccountDashboardModalComponent
                    showModal={showModal}
                    handleClose={() => setShowModal(false)}
                    value={value}
                    onConfirm={onConfirm}
                    initialData={initialData}
                />
            );
        }
        return null;
    };

    switch (reservationStatus) {
        case REQUEST_STATUSES.PENDING:
            return (
                <>
                    <button type="button" class="btn btn-green" onClick={handleUpdateButtonClick}>Edit Request</button>
                    {/* change the void to the function the form will do */}
                    {renderModal('update booking', ( updatedDetails ) => { handleUpdateButtonClick(); handleUpdate( updatedDetails, reservation ) }, showUpdateModal, setShowUpdateModal, reservation)}
                    <button type="button" class="btn btn-red" onClick={handleCancelButtonClick}>Cancel Booking</button>
                    {renderModal('cancel booking', ( remarks ) => { handleCancelButtonClick(); handleCancel(remarks,reservation); }, showCancelModal, setShowCancelModal)}
                </>


            );
        case REQUEST_STATUSES.APPROVED:
            return (
                <>
                    <input style={{ display: "none" }} id={"reservationAttachmentUpload"+reservation.request_id} type="file" accept="application/pdf" multiple onInput={handleFilesChange} />
                    <button type="button" class="btn btn-gray" onClick={(event) => {
                        event.stopPropagation();
                        document.getElementById("reservationAttachmentUpload"+reservation.request_id).click();
                    }}>Upload Attachments<i className="material-icons-outlined" style={{color:"lightgrey", fontSize:"14px", marginLeft: "4px", marginTop:"-0.5px"}} data-bs-toggle="tooltip" data-bs-placement="top" title="Upload exactly one each of the following: receipt, form, letter, and other (optional). &#10;Rename them in this manner: <SurnameInitials>_<filetype>.pdf&#10;Ex. CapuchinoESR_receipt.pdf">info</i></button>
                    {showUploadModal &&
                        <AccountDashboardModalComponent
                            files={selectedFiles}
                            showModal={showUploadModal}
                            handleClose={handleUploadClose}
                            value={'upload attachments'}
                            onConfirm={handleUpload}
                        />}

                    <button type="button" class="btn btn-red" onClick={handleCancelButtonClick}>Cancel Booking</button>
                    {renderModal('cancel booking', ( remarks ) => { handleCancelButtonClick(); handleCancel(remarks,reservation); }, showCancelModal, setShowCancelModal)}
                </>
            );
        default:
            return (null);
    }
}

export default BookingStatusActionsComponent;