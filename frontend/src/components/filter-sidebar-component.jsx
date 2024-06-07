/*
  Description: A filter for the reservations using the status of
  the reservations.

  @author Jan Andrew Senires
  @date 03/31/2024
*/

// Description: Refactored file to use constants from constant.js

// @author Rheana Mindo
// @date 04/16/2024

import { REQUEST_STATUSES } from '../utilities/constant';
import React, { useState, useEffect } from 'react';
import '../Neptune.css';
import * as api from "../utilities/api";
import { USER_TYPES } from '../utilities/constant';
import SummaryReportModalComponent from './summary-report-modal-component';

const StatusFilter = ({ onSelectStatus, handleShowAlert }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [userInfo, setUserInfo] = useState();
  const [showSummaryReportModal, setShowSummaryReportModal] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onSelectStatus(status);
  };

  const fetchUserInfo = async () => {
    try {
      const user = await api.getUserInfo();
      if (user && user.data) {
        setUserInfo(user.data);
      } else {
        setUserInfo({});
      }
    } catch (error) {
      console.error('Error fetching user information: ', error);
      setUserInfo({});
    }
  };

  const handleSummaryReportClick = () => {
    setShowSummaryReportModal(true);
  };

  const renderModal = (showModal, setShowModal) => {
    if (showModal) {
      return (
        <SummaryReportModalComponent
          showModal={showModal}
          handleClose={() => setShowModal(false)}
        />
      );
    }
    return null;
  };

  const handleCancelOverdueRequests = async () => {
    try{
      const response = await api.cancelOverdueRequests();
      if(response.data.success){
        handleShowAlert(true, response.data.message);
      }else{
        handleShowAlert(false, response.data.message);
      }
    }catch(error){
      handleShowAlert(false, error.response.data.message);
      console.error('Error cancelling overdue requests: ', error);
    }
  }

  return (
    <div className='filter-div'>
      <div className="todo-menu booking-filter">
        <h5 className="todo-menu-title">Filter Status</h5>
        <ul className="list-unstyled todo-status-filter">
          {/* eslint-disable-next-line */}
          <li><a href="#" onClick={() => handleStatusChange("")} className={"" === selectedStatus ? 'active' : ''}>All</a></li>
          {/* eslint-disable-next-line */}
          <li><a href="#" onClick={() => handleStatusChange(REQUEST_STATUSES.FINALIZED)} className={REQUEST_STATUSES.FINALIZED === selectedStatus ? 'active' : ''}>Finalized</a></li>
          {/* eslint-disable-next-line */}
          <li><a href="#" onClick={() => handleStatusChange(REQUEST_STATUSES.PENDING)} className={REQUEST_STATUSES.PENDING === selectedStatus ? 'active' : ''}>Pending</a></li>
          {/* eslint-disable-next-line */}
          <li><a href="#" onClick={() => handleStatusChange(REQUEST_STATUSES.APPROVED)} className={REQUEST_STATUSES.APPROVED === selectedStatus ? 'active' : ''}>Approved with Pending Documents</a></li>
          {/* eslint-disable-next-line */}
          <li><a href="#" onClick={() => handleStatusChange(REQUEST_STATUSES.DISAPPROVED)} className={REQUEST_STATUSES.DISAPPROVED === selectedStatus ? 'active' : ''}>Disapproved</a></li>
          {/* eslint-disable-next-line */}
          <li><a href="#" onClick={() => handleStatusChange(REQUEST_STATUSES.CANCELLED)} className={REQUEST_STATUSES.CANCELLED === selectedStatus ? 'active' : ''}>Cancelled</a></li>
        </ul>
        {/* Toggle this Summary Report Button - Only when a user is a superadmin/admin can have access to this */}
        {(userInfo && (userInfo.user_type === USER_TYPES.SUPER_ADMIN || userInfo.user_type === USER_TYPES.ADMIN)) && (
          <>
            <h5 className="todo-menu-title" style={{ marginTop: "20px" }}>Admin Actions</h5>
            <ul className="list-unstyled todo-status-filter">
              <li>
                <button type="button" class="btn btn-blue d-block m-b-lg summary-report-btn" onClick={handleSummaryReportClick} style={{ width: "100%" }}>Summarize Report</button>
                {renderModal(showSummaryReportModal, setShowSummaryReportModal)}
                <button type="button" class="btn btn-red d-block m-b-lg summary-report-btn" onClick={handleCancelOverdueRequests} style={{ width: "100%" }}>Cancel Overdue Requests</button>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default StatusFilter;