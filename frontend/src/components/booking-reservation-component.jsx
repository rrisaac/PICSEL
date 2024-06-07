// Author: Joseph Ryan P. Peña
// Description: Used constants for room names
// Date: 04/19/24

// Author: Rheana M. Mindo
// Description: Fixed no. of hours and total price error when picking 12:00 PM
// Date: 04/19/24

// Author: Rheana M. Mindo
// Description: Fixed default room bug
// Date: 05/04/24

/**
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

// Description: Add explicit validators on fields: Purpose.

// @author Jan Andrew Senires
// @date 05/13/2024



/**
 * @description Limit date and time to the actual time
 * and move forward the date when it's 9 PM already
 * @author Gacel Perfinian
 * @date 05/14/2024
 */


import { useState, useEffect } from 'react';
import AccountDashboardModalComponent from './account-dashboard-modal-component';
import * as api from "../utilities/api";
import AlertNotificationComponent from './alert-notification-component';

const BookingReservationComponent = () => {
  const [showReservation, setShowReservation] = useState(false);
  const [roomList, setRoomList] = useState(
    {
      '---': {
        roomInfo: {
          name: '---'
        }
      }
    });

  const [showAlert, setShowAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  /* Description: Fetch room list info from database

  @author Diana Marie Compahinay
  @date 04/28/2024
  */

  useEffect(() => {

    const fetchRoomsList = async () => {
      try {
        const get_rooms = await api.getRooms();
        const rooms = get_rooms.data.rooms;

        const sorted_rooms = rooms.sort((a, b) => {
          let typeA = a.room_type.toLowerCase();
          let typeB = b.room_type.toLowerCase();
          if (typeA !== typeB) {
              return typeA.localeCompare(typeB); // Sort by room_type first
          }
          // If room_type is the same, sort by room_name
          let nameA = a.room_name.toLowerCase();
          let nameB = b.room_name.toLowerCase();
          return nameA.localeCompare(nameB);
      });

        // initialize room list info by default
        const room_list = {
          '---': {
            roomInfo: {
              name: '---'
            }
          }
        }

        for (const room of sorted_rooms) {
          const roomInfo = {
            roomInfo: {
              name: room.room_name,
              capacity: `${room.capacity} pax`,
              utilityWorker: room.utility_worker,
              pricePerHour: parseInt(room.rate)
            }
          };

          room_list[room.room_name] = roomInfo;
        }
        setRoomList(room_list);
        setShowReservation(true);
      } catch (error) {
        console.error('Error fetching room lists: ', error);
      }

    };

    fetchRoomsList();
  }, []);

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

  const [room, setRoom] = useState('---');
  const [date, setDate] = useState('');
  const [dateNow, setDateNow] = useState('1970-01-01');
  const [timeNow, setTimeNow] = useState('00:00:00');
  const [startTime, setStartTime] = useState('--:--');
  const [startTimeOptionList, setStartTimeOptionList] = useState(Object.keys(timeList).slice(0, -1));
  const [endTime, setEndTime] = useState('--:--');
  const [purpose, setPurpose] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const max_length = 300;
  const [characterLimitExceeded, setCharacterLimitExceeded] = useState(false);

  const eventTitle_max_length = 30;
  const [eventTitleCharacterLimitExceeded, setEventTitleCharacterLimitExceeded] = useState(false);


  // Function to convert hardcoded timeList to follow database validators in the format of HH:MM:SS
  // @author Rafa Magno
  // @date 04/10/2024
  const convertToHHMMSS = (input_time) => {
    let hour = timeList[input_time].hour;
    let meridian = timeList[input_time].meridian;

    if (meridian === 'PM' && hour !== 12) { hour += 12; };
    hour = hour % 24;
    return `${hour.toString().padStart(2, '0')}:00:00`;
  }

  const roomBasePrice = () => {
    if (room === '---') {
      return 0;
    };
    return roomList[room]?.roomInfo.pricePerHour;
  };
  const utilityWorker = roomList[room]?.roomInfo.utilityWorker;

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

  // MODAL Section
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setShowSubmitModal(true);
  };

  const handlePurposeChange = (e) => {
    const value = e.target.value;
    setPurpose(value);
    if (value.length > max_length) {
      setCharacterLimitExceeded(true);
    } else {
      setCharacterLimitExceeded(false);
    }
    if (value.trim() === '') {
      setValidationErrors(prev => ({
          ...prev,
          purpose: 'Please enter a purpose',
      }));
    } else {
      setValidationErrors(prev => ({ ...prev, purpose: '' }));
    }
  }

  // Description: Added explicit validator for the character limit of Event Title.

  // @author Jan Andrew Senires
  // @date 05/14/2024

  const handleEventTitleChange = (e) => {
    const value = e.target.value;
    setEventTitle(value);
    if (value.length > eventTitle_max_length) {
        setEventTitleCharacterLimitExceeded(true);
    } else {
        setEventTitleCharacterLimitExceeded(false);
    }
    if (value.trim() === '') {
      setValidationErrors(prev => ({
          ...prev,
          eventTitle: 'Please enter an event title',
      }));
    } else {
      setValidationErrors(prev => ({ ...prev, eventTitle: '' }));
    }
  }

  // Function for request creation upon form submission
  // @author Rafa Magno
  // @date 04/10/2024

  const handleSubmitButton = async () => {
    try {
      const details = {
        title: eventTitle,
        room_name: roomList[room].roomInfo.name,
        reservation_date: date,
        reservation_start_time: convertToHHMMSS(startTime),
        reservation_end_time: convertToHHMMSS(endTime),
        purpose,
      }

      const options = { body: details };
      const result = await api.createRequest(options);
      if (result.data.success) {
        setAlertSuccess(true);
        setAlertMessage(result.data.message);
        setShowAlert(true);
      } else {
        setAlertSuccess(false);
        setAlertMessage(result.data.message);
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      setAlertSuccess(false);
      setAlertMessage(error.response.data.message);
      setShowAlert(true);
    }

    // Clear the form after submission.
    setRoom('---');
    setDate('');
    setStartTime('--:--');
    setEndTime('--:--');
    setEventTitle('');
    setPurpose('');

    setShowSubmitModal(false); // Close the modal after user action
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

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  /**
   * Set the current day and time
   */
  useEffect(() => {
    const updateTime = () => {
      // Get current date and time
      const [currentDateNow, currentTimeNow] = (new Date(Date.now() + 8*60*60*1000)).toISOString().slice(0,-5).split('T');
      const roundedTimeNow = `${currentTimeNow.slice(0,2)}:00:00`
      if (dateNow !== currentDateNow)
        setDateNow(currentDateNow)
      if (timeNow !== roundedTimeNow)
        setTimeNow(roundedTimeNow)
      // Repeat
      setTimeout(updateTime, 2300)
    }

    updateTime()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (dateNow !== date)
      setStartTimeOptionList(Object.keys(timeList).slice(0, -1))
    else
      setStartTimeOptionList(Object.keys(timeList).slice(0, -1).filter((key) => {
        return (timeList[key].meridian === '') || (convertToHHMMSS(key) > timeNow)
      }))
    // eslint-disable-next-line
  }, [date, dateNow, timeNow])

  return (
    <>
      {renderAlert(alertSuccess, alertMessage)}
      <div>
        <title>Book Reservation | PICSEL</title>
        <div className="page-description">
          <h1>Book Reservation</h1>
        </div>
        <div className="white-rectangle" style={{
          borderRadius: 15,
          marginLeft: 0,
          marginRight: 8,
        }}>
          {showReservation ? (
            <div className="widget-stats-container d-flex" style={{ flexGrow: 1, padding: 40, overflow: 'hidden' }}>
              <div className="widget-stats-content flex-fill" >
                {/* Form Section Start */}
                <div className='form-group-container'>
                  <form className="room-rental-for" onSubmit={handleSubmit}>
                    <div className='form-group'>
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
                    <div className="form-group-container-column" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="form-group" style={{ flexGrow: 1, marginRight: 40 }}>
                        <h3 className='gray-text'>Date</h3>
                        <input
                          type="date"
                          className="form-control"
                          id="date"
                          value={date}
                          onChange={(event) => setDate(event.target.value)}
                          required
                          min={timeNow < '21:00:00'? dateNow: (() => {const dateObj = (new Date(dateNow)); dateObj.setUTCDate(dateObj.getUTCDate() + 1); return dateObj.toISOString().split('T')[0]})()} // Get today's date in YYYY-MM-DD format
                        />
                      </div>
                      <div className="form-group" style={{ flexGrow: 1, marginRight: 40, }}>
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
                      <div className="form-group" style={{ flexGrow: 1 }}>
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
                      <div className='form-group'>
                        <h3 className='gray-text'>Event Title</h3>
                        <input class="form-control" id="eventTitle"
                          className="form-control"
                          value={eventTitle}
                          onChange={handleEventTitleChange}
                        />
                        {eventTitleCharacterLimitExceeded && (
                            <div className="error-message">{eventTitle_max_length}-character limit exceeded</div>
                        )}
                        {validationErrors.eventTitle && (
                            <div className="error-message">{validationErrors.eventTitle}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <h3 className='gray-text'>Purpose</h3>
                        <textarea
                          className="form-control"
                          id="purpose"
                          value={purpose}
                          onChange={handlePurposeChange}
                          required
                        />
                        {characterLimitExceeded && (
                          <div className="error-message">{max_length}-character limit exceeded</div>
                        )}
                        {validationErrors.purpose && (
                            <div className="error-message">{validationErrors.purpose}</div>
                        )}
                      </div>
                    </div>
                    <br></br>
                    <div>
                      {/* Receipt Section Start */}
                      <h3 className='gray-text'>Price</h3>
                      <div style={{ display: 'flex' }}>
                        <div className='pcontainer'>
                          <p className='gray-text'>Room base price:  </p>
                          <p className='gray-text'>No. of hours:     </p>
                        </div>
                        <div>
                          <p className='gray-text'>&emsp;&emsp;{roomBasePrice().toLocaleString('fil-PH', { style: 'currency', currency: 'PHP' })}</p>
                          <p className='gray-text'>&emsp;&emsp;{calculateNumberOfHours()}</p>
                        </div>
                      </div>
                      <div className='line-container'>
                        <hr style={{ borderStyle: 'solid', borderWidth: '2px', borderColor: 'gray' }}></hr>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div className='pcontainer'>
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

                    <br></br>
                    <button type="submit" className="btn btn-primary"
                      disabled={room === '---' || startTime === '--:--' || endTime === '--:--' || date === '' || eventTitle === '' || purpose.trim() === '' || characterLimitExceeded || eventTitle.trim() === '' || eventTitleCharacterLimitExceeded}
                    >
                      <span>Submit Request </span>
                    </button>
                    {renderModal('submit request', handleSubmitButton, showSubmitModal, setShowSubmitModal)}
                  </form>
                </div>
                {/* Form Section End */}
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

export default BookingReservationComponent;
