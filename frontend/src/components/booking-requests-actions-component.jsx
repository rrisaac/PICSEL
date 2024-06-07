/**
 * Booking Requests Actions Component
 * 
 * @description This component renders the actions done
 * by the administrator on a booking reservation request.
 * @author Gacel Perfinian
 * @date 03/28/2024
 * 
 * @description Integrated approving and rejecting a reservation request
 * @author Joseph Ryan Peña
 * @date 04/12/2024
 * 
 * @description Integrated finalizing and deleting reservation requests
 * @author Neil Vincent S. Alday
 * @date 04/17/2024
 * 
 * @description Refactored file to use constants from constant.js
 * @author Rheana Mindo
 * @date 04/16/2024
 * 
 * @description Various fixes to current code
 * @author Gacel Perfinian
 * @date 04/22/2024
 * 
 * @description Added attachment download functionality
 * @author Gacel Perfinian
 * @date 04/24/2024
 * 
 * @description Handles generation of approval document in PDF format, getting user info using userId, and getting request info using requestId
 * @author Aira Nicole Natividad
 * @date 04/29/2024
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
import FileDownload from "js-file-download";
import { pdf } from '@react-pdf/renderer';
import ApprovalDocument from './approval-document-component';
import { EMPTY } from '../utilities/constant';

const BookingRequestsActionsComponent = ({ reservationStatus, reservation, setReservationStatus, reservationList, setReservationList, handleShowAlert }) => {    
    const handleApprove = async (remarks, reservation) => {
        const data = {
            userId: reservation.userId,
            remarks: EMPTY,
        }
        const options = {body:data};

        try{
          const result = await api.approveReservationRequest(options,reservation.originalID);
          if (result.data.success) {
            handleShowAlert(true, result.data.message);
            setReservationStatus(REQUEST_STATUSES.APPROVED)
          } else {
            handleShowAlert(false, result.data.message);
          }

        } catch (error) {
            console.error("Error during POST request:", error.message);
            handleShowAlert(false, error.response.data.error);
        }
    }

    const handleReject = async (remarks, reservation) => {
        const data = {
            userId: reservation.userId,
            remarks: remarks
        }
        const options = {body:data};
        try{
          const result = await api.disapproveReservationRequest(options,reservation.originalID);
          if (result.data.success) {
            handleShowAlert(true, result.data.message);
            setReservationStatus(REQUEST_STATUSES.DISAPPROVED)
          } else {
            handleShowAlert(false, result.data.error);
          }
        } catch (error) {
            console.error("Error during POST request:", error.message);
            handleShowAlert(false, error.response.data.error);
        }
    }

    const handleFinalize = async ( remarks, reservation) => {
        const data = {
            userId: reservation.userId,
            remarks: EMPTY
        }
        const options = {body:data};

        try{
            const result = await api.finalizeReservationRequest(options,reservation.originalID);
            if (result.data.success)  {
                handleShowAlert(true, result.data.message);
                setReservationStatus(REQUEST_STATUSES.FINALIZED)
            }
            else {
                handleShowAlert(false, result.data.message);
            }
        } catch (error) {
            console.error("Error during POST request:", error.message);
            handleShowAlert(false, error.response.data.error);
        }
    }

    const handleDeleteReservation = async (remarks, reservation) => {
        const data = {
            userId: reservation.userId,
            remarks: remarks
        }
        const options = {body:data};

        try{
            const result = await api.deleteReservationRequest(options,reservation.originalID);
            if (result.data.success) {
                const filtered = reservationList.filter(item => item.originalID !== reservation.originalID);
                setReservationList(filtered);
                handleShowAlert(true, result.data.message);
            }
            else {
                handleShowAlert(false, result.data.error);
            }
        } catch (error) {
            console.error("Error during POST request:", error.message);
            handleShowAlert(false, error.response.data.error);
        }
    }


    const handleAttachmentDownload = async (reservation) => {
        const params = {
            requestId: reservation.originalID,
            userId: reservation.userId,
        }
        try {
            const result = await api.downloadAttachments(params);
            FileDownload(result.data, "attachment-" + reservation.request_id +".zip");
        } catch (error) {
            console.error("Error during POST request:", error.message);
            handleShowAlert(false, error.response.data.message);
        }
    }

    const getUserInfoUsingUserId = async (userId) => {
        try {
            const result = await api.getUserInfoUsingUserId(userId);
            if (result.data.success) {
                return result.data.user;
            } else {
                console.error(result.data.message);
            }
        } catch (error) {
            console.error("Error during GET request:", error.message);
        }
    }

    const getUserRequestUsingId = async (requestId) => {
        try {
            const result = await api.getUserRequestUsingId(requestId);
            if (result.data.success) {
                return result.data.request;
            } else {
                console.error(result.data.message);
            }
        } catch (error) {
            console.error("Error during GET request:", error.message);
        }
    }

    const fetchAttachments = async (requestId) => {
        try {
            const result = await api.getAttachments(requestId);
            if (result.data.success) {
                return result.data.urls;
            } else {
                console.error(result.data.message);
            }
        } catch (error) {
            console.error("Error during GET request:", error.message);
        }
    }

    const handleGeneratePDFs = async (reservation) => {
        // Fetch user data using userId
        const user = await getUserInfoUsingUserId(reservation.userId);
        
        // Fetch request data using requestId
        const request = await getUserRequestUsingId(reservation.originalID);
    
        // Fetch attachments from Cloudinary
        const attachments = await fetchAttachments(reservation.originalID);
    
        const now = new Date();
        const day = now.getDate();
        const monthNumber = now.getMonth();
        const year = now.getFullYear();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[monthNumber];
    
        const data = {
            firstName: user? user.first_name : '___',
            middleName: user? user.middle_name : '',
            lastName: user? user.last_name : '',
            requestId: reservation.request_id,
            roomName: reservation.room_name,
            title: reservation.title,
            purpose: reservation.purpose,
            date: request.reservation_date,
            startTime: request.reservation_start_time,
            endTime: request.reservation_end_time,
            day: day,
            month: monthName,
            year: year,
            attachmentUrls: attachments // Include attachment URLs in the data
        }
    
        const doc = <ApprovalDocument data={data} />;
        const asPdf = pdf([]);  // Create an empty PDF placeholder
        asPdf.updateContainer(doc);
        const blob = await asPdf.toBlob();  // Generate the PDF as a blob
    
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
    
        // Create a temporary link element and trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reservation.request_id}_Approval-Document.pdf`);  // Define the download file name
        document.body.appendChild(link);
        link.click();
    
        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);  // Free up resources used by the blob
    };

    // Modal Section

    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showDisapproveModal, setShowDisapproveModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleApproveButtonClick = () => {
        setShowApproveModal(true); // Open the modal
    };

    const handleDisapproveButtonClick = () => {
        setShowDisapproveModal(true); // Open the modal
    };

    const handleFinalizeButtonClick = () => {
        setShowFinalizeModal(true); // Open the modal
    };

    const handleDeleteButtonClick = () => {
        setShowDeleteModal(true); // Open the modal
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

    // END OF MODAL SECTION


    switch (reservationStatus) {
        case REQUEST_STATUSES.PENDING:
            return (
                <>
                    <button type="button" class="btn btn-green" onClick={(handleApproveButtonClick)}>Approve</button>
                    {renderModal('approve booking', ( remarks ) => { handleApproveButtonClick(); handleApprove( remarks, reservation); }, showApproveModal, setShowApproveModal)}
                    <button type="button" class="btn btn-red"onClick={handleDisapproveButtonClick}>Disapprove</button>
                    {renderModal('disapprove booking', ( remarks ) => { setReservationStatus(REQUEST_STATUSES.DISAPPROVED); handleDisapproveButtonClick(); handleReject( remarks, reservation ); }, showDisapproveModal, setShowDisapproveModal)}
                </>
            );
        case REQUEST_STATUSES.APPROVED:
            return (
                <>
                    <button type="button" class="btn btn-gray" onClick={(event) => {event.stopPropagation(); handleAttachmentDownload(reservation)}} disabled={!reservation.attachmentCount}>Download Attachments</button>
                    <button type="button" class="btn btn-blue" onClick={handleFinalizeButtonClick} disabled={!reservation.attachmentCount}>Finalize Request</button>
                    {renderModal('finalize booking', ( remarks ) => { handleFinalizeButtonClick(); handleFinalize( remarks, reservation ); }, showFinalizeModal , setShowFinalizeModal)}


                </>
            );
        case REQUEST_STATUSES.CANCELLED:
            return (
                <>
                    <button type="button" class="btn btn-red" onClick={handleDeleteButtonClick}>Delete Request</button>
                    {renderModal('delete booking', ( remarks ) => { handleFinalizeButtonClick(); handleDeleteReservation(remarks, reservation); }, showDeleteModal, setShowDeleteModal)}
                </>
            );
        case REQUEST_STATUSES.DISAPPROVED:
            return (
                <>
                    <button type="button" class="btn btn-red" onClick={handleDeleteButtonClick}>Delete Request</button>
                    {renderModal('delete booking', ( remarks ) => { handleFinalizeButtonClick(); handleDeleteReservation(remarks, reservation); }, showDeleteModal, setShowDeleteModal)}
                </>
            );
            case REQUEST_STATUSES.FINALIZED:
                return (
                    <>
                        <button type="button" class="btn btn-blue" onClick={() => handleGeneratePDFs(reservation)}>Generate Approval Document{reservation.userId === null && (
                            <i className="material-icons-outlined" style={{color:"lightgrey", fontSize:"14px", marginLeft: "4px", marginTop:"-0.5px"}} data-bs-toggle="tooltip" data-bs-placement="top" title="The user associated with this request no longer exists.&#10;Please provide the user's name in the designated field.">info</i>
                        )}</button>
                    </>
                );
        default:
            return (null);
    }
}

export default BookingRequestsActionsComponent;