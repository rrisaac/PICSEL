// Description: This React component renders a confirmation modal window used in the PICSEL account dashboard. 
// The modal is used to confirm user actions before proceeding, such as updating an account, deleting a log, or 
// canceling a booking.


// @author Prince Czedrick Nepomuceno
// @date 04/08/2024

/*
    Description: Successfully passed updatedDetails to parent component

    @author Neil Vincent Alday and Aira Nicole Natividad
    @date 04/17/2024    

 */

/**
 * Description: Added previous reservation details to the update booking form and created a function to convert the time to 12-hour format
 * 
 * @author Aira Nicole Natividad
 * @date 04/19/2024
 */

/**
 * Delete User Modal for SuperAdmin
 *
 * @description Shows the deletion request
 * (UsersModalComponent handles the deletion backend)
 * @author Gacel Perfinian
 * @date 04/27/2024
 */


// Author: Rheana M. Mindo
// Description: Fixed default room bug and disabled Edit button when default room is selected in Update Booking modal
// Date: 05/04/24

/**
 * Delete Schedule Modal for SuperAdmin
 *
 * @description Shows the deletion request
 * (ClassSchedulesSuperadminComponent handles the deletion backend)
 * @author Gacel Perfinian
 * @date 05/02/2024
 */

/**
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

import React, { useState, useEffect } from 'react';
import '../assets/css/modals.css'
import '../Neptune.css';
import { ROOM_NAMES, UTILITY_WORKERS } from '../utilities/constant.js'
import AlertNotificationComponent from './alert-notification-component';

const AccountDashboardModalComponent = ({ showModal, handleClose, value, onConfirm, files, initialData, userData, scheduleData }) => {
  //For the form
  const roomList = {
    '---': {
      roomInfo: {
        name: '---',
        capacity: "",
        utilityWorker: "",
        pricePerHour: 0,
      }
    },
    [ROOM_NAMES.ICS_MEGA_HALL]: {
      roomInfo: {
        name: [ROOM_NAMES.ICS_MEGA_HALL],
        capacity: "220 pax",
        utilityWorker: [UTILITY_WORKERS.REGGIE_PELAYO],
        pricePerHour: 1650,
      }
    },
    [ROOM_NAMES.ICS_LECTURE_HALL_3]: {
      roomInfo: {
        name: [ROOM_NAMES.ICS_LECTURE_HALL_3],
        utilityWorker: [UTILITY_WORKERS.ROMEL_LAWAS],
        pricePerHour: 825,
      }
    },
    [ROOM_NAMES.ICS_LECTURE_HALL_4]: {
      roomInfo: {
        name: [ROOM_NAMES.ICS_LECTURE_HALL_4],
        utilityWorker: [UTILITY_WORKERS.ROMEL_LAWAS],
        pricePerHour: 825,
      }
    },
    [ROOM_NAMES.PC_LAB_C100]: {
      roomInfo: {
        name: [ROOM_NAMES.PC_LAB_C100],
        utilityWorker: [UTILITY_WORKERS.ROMEL_LAWAS],
        pricePerHour: 120,
      }
    },
    [ROOM_NAMES.PC_LAB_1]: {
      roomInfo: {
        name: [ROOM_NAMES.PC_LAB_1],
        utilityWorker: [UTILITY_WORKERS.REGGIE_PELAYO],
        pricePerHour: 120,
      }
    },
    [ROOM_NAMES.PC_LAB_2]: {
      roomInfo: {
        name: [ROOM_NAMES.PC_LAB_2],
        utilityWorker: [UTILITY_WORKERS.REGGIE_PELAYO],
        pricePerHour: 120,
      }
    },
    [ROOM_NAMES.PC_LAB_3]: {
      roomInfo: {
        name: [ROOM_NAMES.PC_LAB_3],
        utilityWorker: [UTILITY_WORKERS.REGGIE_PELAYO],
        pricePerHour: 120,
      }
    },
    [ROOM_NAMES.PC_LAB_4]: {
      roomInfo: {
        name: [ROOM_NAMES.PC_LAB_4],
        utilityWorker: [UTILITY_WORKERS.REGGIE_PELAYO],
        pricePerHour: 120,
      }
    },
    [ROOM_NAMES.PC_LAB_5]: {
      roomInfo: {
        name: [ROOM_NAMES.PC_LAB_5],
        utilityWorker: [UTILITY_WORKERS.REGGIE_PELAYO],
        pricePerHour: 120,
      }
    },
    [ROOM_NAMES.PC_LAB_6]: {
      roomInfo: {
        name: [ROOM_NAMES.PC_LAB_6],
        utilityWorker: [UTILITY_WORKERS.ROMEL_LAWAS],
        pricePerHour: 120,
      }
    },
    [ROOM_NAMES.PC_LAB_7]: {
      roomInfo: {
        name: [ROOM_NAMES.PC_LAB_7],
        utilityWorker: [UTILITY_WORKERS.ROMEL_LAWAS],
        pricePerHour: 120,
      }
    },
    [ROOM_NAMES.PC_LAB_8]: {
      roomInfo: {
        name: [ROOM_NAMES.PC_LAB_8],
        utilityWorker: [UTILITY_WORKERS.ROMEL_LAWAS],
        pricePerHour: 120,
      }
    },
    [ROOM_NAMES.PC_LAB_9]: {
      roomInfo: {
        name: [ROOM_NAMES.PC_LAB_9],
        utilityWorker: [UTILITY_WORKERS.ROMEL_LAWAS],
        pricePerHour: 120,
      }
    },
  };

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
  }

  const [room, setRoom] = useState(initialData ? initialData.room_name : '---');
  const [date, setDate] = useState(initialData ? initialData.reservation_date : '');
  const [startTime, setStartTime] = useState(initialData ? convertTo12HourFormat(initialData.reservation_start_time) : '--:--');
  const [endTime, setEndTime] = useState(initialData ? convertTo12HourFormat(initialData.reservation_end_time) : '--:--');
  const [purpose, setPurpose] = useState(initialData ? initialData.purpose : '');

  const roomBasePrice = () => {
    if (room === '---') {
      return 0;
    };
    return roomList[room]?.roomInfo.pricePerHour;
  };
  const utilityWorker = roomList[room]?.roomInfo.utilityWorker;
  const startTimeOptionList = Object.keys(timeList).slice(0, -1);

  const getEndTimeOption = () => {
    if (startTime === '--:--') {
      return ['--:--']
    };

    let timeIndex = -1;
    for (let i = 0; i < (Object.keys(timeList).length); i++) {
      if (Object.keys(timeList)[i] === startTime) {
        timeIndex = i;
        break;
      }
    }
    let tempArray = Object.keys(timeList).slice(timeIndex + 1,);
    tempArray.unshift('--:--');
    return tempArray;
  };

  const calculateNumberOfHours = () => {
    if ((endTime === '--:--') || (startTime === '--:--')) {
      return 0;
    };
    let tempEndTime = parseInt(endTime);
    if (((timeList[endTime]?.meridian === 'PM') && (timeList[startTime]?.meridian === 'AM') && timeList[endTime]?.hour !== 12) || (timeList[startTime]?.hour === 12)) {
      tempEndTime = tempEndTime + 12;
    }
    return (tempEndTime - parseInt(startTime))
  };

  const totalPrice = () => {
    if ((endTime === '--:--') || (room === '---')) {
      return 0;
    };
    return roomBasePrice() * calculateNumberOfHours();
  };

  const totalUtilityFee = 200 * calculateNumberOfHours();

  const handleSubmit = (event) => {
    event.preventDefault();

    const updateDetails = {
      room,
      date,
      startTime,
      endTime,
      purpose,

    };

    localStorage.setItem('updateDetails', JSON.stringify(updateDetails));
    window.dispatchEvent(new Event('updateDetailsStored'));

    // Clear the form after submission.
    setRoom('---');
    setDate('');
    setStartTime('--:--');
    setEndTime('--:--');
    setPurpose('');
  };
  // END OF DATA FOR FORM

  /**
   * Parse Time
   *
   * @description Contains the time parsing function for the schedules
   * @author Gacel Perfinian
   * @date 05/02/2024
   */

  const parseTime = (data) => {
    const sliced = data.split(':')
    return `${((((sliced[0])-1)%12)+1).toString().padStart(2,"0")}:${sliced[1]} ${Number(sliced[0])>11?'PM':'AM'}`
  }

  const [confirmed, setConfirmed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const updateButtonState = () => {
      switch (value) {
        case 'delete log':
        case 'update log':
        case 'cancel booking':
        case 'disapprove booking':
        case 'delete booking':
        case 'delete schedule':
        case 'add schedule':
        case 'update schedule':
        case 'deactivate account':
        case 'superadmin edit account':
        case 'superadmin delete account':
        case 'superadmin edit schedule':
        case 'superadmin delete schedule':
          setIsButtonDisabled(inputValue.trim() === '')
          break;
        case 'update booking':
          setIsButtonDisabled(room === '---' || startTime === '--:--' || endTime === '--:--' || date === '' || purpose.trim() === '');
          break;
        default:
          setIsButtonDisabled(false);
      }
    };

    updateButtonState();
    // eslint-disable-next-line
  }, [inputValue, room, startTime, endTime, date, purpose]); // Update on relevant state changes


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
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

  const getMessage = () => {
    switch (value) {
      case 'update account':
        return (<p className="modal-message-only">Are you sure you want to edit your account?</p>);
      case 'deactivate account':
        return (
          <div>
            <p className="modal-message">Are you sure you want to delete your account?</p>
            <p className="modal-message" id="red-text">You won't have access to your account once deleted.</p>

            <p className="modal-input-label">Please enter "{confirmationPhrase()}" to proceed:</p>
            <input type="text" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'delete log':
        return (
          <div>
            <p className="modal-message">Are you sure you want to delete this activity log?</p>

            <p className="modal-input-label">Reason for Deleting this Activity Log:</p>
            <input type="text" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'update log':
        return (
          <div >
            <p className="modal-message" >Are you sure you want to edit this activity log?</p>

            <p className="modal-input-label">Reason for Editing this Activity Log:</p>
            <input type="text" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'upload attachments':
        return (
          <div>
            <p className="modal-message-only">You are about to upload the following attachments:</p>
            <ul>
              {files.length > 0 && (
                files.map((file, index) => (
                  <li key={file.name}>
                    {file.name}
                    {index < files.length - 1 && ', '} {/* Add comma except for last file */}
                  </li>
                ))
              )}
              {files.length === 0 && <p>No files selected.</p>}
            </ul>
          </div>
        );

      case 'cancel booking':
        return (
          <div>
            <p className="modal-message">Are you sure you want to cancel this booking request?</p>

            <p className="modal-input-label">Reason for Cancelling this Booking Request:</p>
            <input type="text" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'approve booking':
        return (<p className="modal-message-only">Are you sure you want to approve this booking request?</p>);
      case 'disapprove booking':
        return (
          <div>
            <p className="modal-message">Are you sure you want to disapprove this booking request?</p>

            <p className="modal-input-label">Reason for Disapproving this Booking Request:</p>
            <input type="text" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'delete booking':
        return (
          <div>
            <p className="modal-message">Are you sure you want to delete this booking request?</p>

            <p className="modal-input-label" >Reason for Deleting this Booking Request:</p>
            <input type="text" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'finalize booking':
        return (<p className="modal-message-only">Are you sure you want to finalize this booking request?</p>);
      case 'update booking':
        return (
          <div className='row'>
            {/* Form Section Start */}
            {/* Change onSubmit to change the form function */}
            <form className="room-rental-form" onSubmit={handleSubmit}>
              <div class="col-sm-7" >
                <div className='form-group row-xs-12' >
                  <h3 className='gray-text'>Pick a Room</h3>
                  <select class="js-states form-control" tabindex="-1"
                    style={{ height: 40 }}
                    id='room'
                    value={room}
                    onChange={(event) => setRoom(event.target.value)}
                    required
                  >
                    {Object.keys(roomList).map((roomId) => (
                      <option key={roomId} value={roomId}>
                        {roomList[roomId].roomInfo.name}
                      </option>
                    ))}
                  </select>
                </div>
                <br></br>
                <div className='row'>
                  <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                    <h3 className='gray-text'>Date</h3>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                    <h3 className='gray-text'>Starting Time</h3>
                    <div>
                      <select
                        style={{ paddingTop: 0, paddingBottom: 0 }}
                        className='form-control'
                        id="startTimeHour"
                        name="hour"
                        value={startTime}
                        onChange={(event) => setStartTime(event.target.value)}
                      >
                        {startTimeOptionList.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                    <h3 className='gray-text'>Ending Time</h3>
                    <div>
                      <select
                        style={{ paddingTop: 0, paddingBottom: 0 }}
                        className='form-control'
                        id="endTimeHour"
                        name="hour"
                        value={endTime}
                        onChange={(event) => setEndTime(event.target.value)}
                        disabled={startTime === '--:--'}
                      >
                        {getEndTimeOption().map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="form-group row-xs-12">
                    <h3 className='gray-text'>Purpose</h3>
                    <textarea
                      className="form-control"
                      id="purpose"
                      value={purpose}
                      onChange={(event) => setPurpose(event.target.value)}
                      required
                    />
                  </div>
                </div>
                <br></br>

              </div>
              <div class="col-sm-5">
                <div>
                  <div>
                    {/* Receipt Section Start */}
                    <h3 className='gray-text'>Price</h3>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '40%' }}>
                        <p className='gray-text' style={{ fontSize: '16px' }}>Room base price:  </p>
                        <p className='gray-text' style={{ fontSize: '16px' }}>No. of hours:     </p>
                      </div>
                      <div>
                        <p className='gray-text' style={{ fontSize: '16px' }}>&emsp;&emsp;{roomBasePrice().toLocaleString('fil-PH', { style: 'currency', currency: 'PHP' })}</p>
                        <p className='gray-text' style={{ fontSize: '16px' }}>&emsp;&emsp;{calculateNumberOfHours()}</p>
                      </div>
                    </div>
                    <div style={{ width: '80%' }}>
                      <hr style={{ borderStyle: 'solid', borderWidth: '2px', borderColor: 'gray' }}></hr>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '40%' }}>
                        <h4 className='gray-text'>Total: </h4>
                      </div>
                      <div>
                        <h4 className='gray-text'>&emsp;&emsp;{totalPrice().toLocaleString('fil-PH', { style: 'currency', currency: 'PHP' })}</h4>
                      </div>
                    </div>
                    {/* Receipt Section End */}
                  </div>
                  <br></br>
                  <p style={{ color: 'black', fontSize: '16px' }}><b>NOTE:</b> On the same day of the event, please don't forget to pay <b>{utilityWorker}</b> with an amount of <b>{totalUtilityFee.toLocaleString('fil-PH', { style: 'currency', currency: 'PHP' })}</b> pesos.</p>
                </div>
              </div>
            </form >
            {/* Form Section End */}
          </div>
        );
      case 'submit request':
        return (<p className="modal-message-only">Are you sure of submitting this booking request?</p>);
      case 'update schedule':
        return (
          <div>
            <p className="modal-input-label">Please enter password to edit this class schedule:</p>
            <input type="password" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'add schedule':
        return (
          <div>
            <p className="modal-input-label">Please enter password to add this class schedule:</p>
            <input type="password" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'delete schedule':
        return (
          <div>
            <p className="modal-input-label">Please enter password to delete this class schedule:</p>
            <input type="password" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'delete room':
        return (
          <div>
            <p className="modal-message">Are you sure you want to delete this room?</p>

            <p className="modal-input-label" >Password</p>
            <input type="password" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'update room':
        return (
          <div>
            <p className="modal-message">Are you sure you want to edit this room?</p>

            <p className="modal-input-label" >Password</p>
            <input type="password" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'add room':
        return (
          <div>
            <p className="modal-message">Are you sure you want to add this room?</p>

            <p className="modal-input-label" >Password</p>
            <input type="password" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'superadmin edit account':
        return (
          <div>
            <p className="modal-message">Are you sure you want to edit the account of {userData.name} {"("}with username {userData.username} and user ID {userData.user_id}{')'}?</p>
            <p className="modal-input-label" >Password</p>
            <input type="password" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
      case 'superadmin delete account':
        return (
          <div>
            <p className="modal-message">Are you sure you want to delete the account of {userData.name} {"("}with username {userData.username} and user ID {userData.user_id}{')'}?</p>
            <p className="modal-input-label" >Password</p>
            <input type="password" className="modal-input" value={inputValue} onChange={handleInputChange} />
          </div>
        );
        case 'superadmin edit schedule':
          return (
            <div>
              <p className="modal-message">Are you sure you want to edit this schedule for {scheduleData.course_code + " " + scheduleData.section} {"("}with faculty {scheduleData.faculty}, time from {parseTime(scheduleData.class_start_time)} to {parseTime(scheduleData.class_end_time)} and schedule ID {`SCH-${scheduleData.schedule_id.toUpperCase().substring(0,8)}`}{')'}?</p>
              <p className="modal-input-label" >Password</p>
              <input type="password" className="modal-input" value={inputValue} onChange={handleInputChange} />
            </div>
          );
          case 'superadmin delete schedule':
            return (
              <div>
                <p className="modal-message">Are you sure you want to edit this schedule for {scheduleData.course_code + " " + scheduleData.section} {"("}with faculty {scheduleData.faculty}, time from {parseTime(scheduleData.class_start_time)} to {parseTime(scheduleData.class_end_time)} and schedule ID {`SCH-${scheduleData.schedule_id.toUpperCase().substring(0,8)}`}{')'}?</p>
                <p className="modal-input-label" >Password</p>
                <input type="password" className="modal-input" value={inputValue} onChange={handleInputChange} />
              </div>
            );
      // Add more cases for other button values and their messages here
      default:
        return (<p className="modal-message-only">Are you sure you want to perform this action?</p>);
    }
  };

  const getTitle = () => {
    switch (value) {
      case 'update account':
        return 'Edit Account';
      case 'deactivate account':
        return 'Delete Account';
      case 'delete log':
        return 'Delete Activity Log';
      case 'update log':
        return 'Edit Activity Log';
      case 'upload attachments':
        return 'Upload Attachments';
      case 'cancel booking':
        return 'Cancel Request';
      case 'approve booking':
        return 'Approve Request';
      case 'disapprove booking':
        return 'Disapprove Request';
      case 'delete booking':
        return 'Delete Request';
      case 'finalize booking':
        return 'Finalize Request';
      case 'update booking':
        return 'Edit Request';
      case 'submit request':
        return 'Submit Request';
      case 'update schedule':
        return 'Edit Class Schedule';
      case 'add schedule':
        return 'Add Class Schedule';
      case 'delete schedule':
        return 'Delete Class Schedule';
      case 'delete room':
        return 'Delete Room';
      case 'update room':
        return 'Edit Room';
      case 'add room':
        return 'Add Room';
      case 'superadmin edit account':
        return `Confirm Account Edit for "${userData.name}"`
      case 'superadmin delete account':
        return `Account Deletion of "${userData.name}"`
      case 'superadmin edit schedule':
        return `Confirm Schedule Edit for "${scheduleData.course_code + " " + scheduleData.section}"`
      case 'superadmin delete schedule':
        return `Schedule Deletion of "${scheduleData.course_code + " " + scheduleData.section}"`
      // Add more cases for other button values and their titles here
      default:
        return 'Modal Title';
    }
  };

  const confirmationPhrase = () => {
    switch (value) {
      case 'deactivate account':
        return 'I want to delete my account';
      case 'update schedule':
      case 'add schedule':
      case 'delete schedule':
      case 'add room':
      case 'update room':
      case 'delete room':
        return 'password';
      // Add more cases for other button values and their titles here
      default:
        return 'Confirm';
    }
  };

  const getConfirm = () => {
    switch (value) {
      case 'update account':
      case 'update log':
      case 'update booking':
      case 'update schedule':
      case 'update room':
        return 'Edit';
      case 'deactivate account':
      case 'delete log':
      case 'delete booking':
      case 'delete schedule':
      case 'delete room':
      case 'superadmin delete account':
      case 'superadmin delete schedule':
        return 'Delete';
      case 'upload attachments':
        return 'Upload';
      case 'cancel booking':
        return 'Cancel';
      case 'approve booking':
        return 'Approve';
      case 'disapprove booking':
        return 'Disapprove';
      case 'finalize booking':
        return 'Finalize';
      case 'submit request':
        return 'Submit';
      case 'add schedule':
      case 'add room':
        return 'Add';
      case 'superadmin edit account':
      case 'superadmin edit schedule':
        return 'Commit';
      // Add more cases for other button values and their titles here
      default:
        return 'Confirm';
    }
  };

  // To solve the weird css in activity log
  const getStyle = () => {
    const baseStyle = {
      overflow: 'auto'
    };

    const log = {
      ...baseStyle,  // Spread the baseStyle object
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      opacity: 0.2,
      zIndex: 1
    }

    switch (value) {
      case 'update log':
      case 'delete log':
        return {
          ...log
        };
      default:
        return baseStyle;  // Return the baseStyle object directly
    }
  };


  const handleConfirm = () => {
    switch (value) {
      case 'update booking':
        const updatedDetails = {
          room: room,
          date: date,
          startTime: startTime,
          endTime: endTime,
          purpose: purpose
        };

        setConfirmed(true);
        onConfirm(updatedDetails);
        handleClose();
        return;
      case 'deactivate account':
        if (inputValue === confirmationPhrase()) {
          setConfirmed(true);
          onConfirm(value); // Pass the value to the parent component for backend logic
        } else {
          setAlertSuccess(false);
          setAlertMessage('Please enter the correct confirmation phrase.');
          setShowAlert(true);
        }
        setTimeout(handleClose, 1000);
        return;
      default:
        setConfirmed(true);
        // this is where to get the values of the form
        onConfirm(inputValue); // Pass the value to the parent component for backend logic
        handleClose(); // Close the modal after confirmation
    };
  };

  const isScrollable = () => {
    const noScroll = {
      overflowY: 'hidden'
    };

    const yesScroll = {
      overflowY: 'auto'
    };


    switch (value) {
      case "update booking":
        return {
          ...yesScroll
        };
      default:
        return {
          ...noScroll
        };
    }
  };


  return (
    <div className={`modal ${showModal ? 'show' : ''}`} style={{ overflow: 'hidden' }}>
      <div className="modal-backdrop fade show" style={getStyle()}>
      </div>
      <div className={`modal ${showModal ? 'show' : ''}`} style={isScrollable()}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content" style={{textAlign:"left"}}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                {getTitle()}
              </h5>
            </div>
            <div className="modal-body" >
              {renderAlert(alertSuccess, alertMessage)}
              {getMessage()}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
              {!confirmed && (
                <button className="btn btn-primary" onClick={handleConfirm} disabled={isButtonDisabled}>
                  {getConfirm()}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default AccountDashboardModalComponent;