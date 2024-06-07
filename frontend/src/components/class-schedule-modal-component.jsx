/**
 * @description added modals for add, edit, and delete schedule
 * @author Prince Czedrick Nepomuceno
 * @date 04/23/2024
 * 
 * @description Integrated create and delete schedules
 * @author Neil Vincent Alday
 * @date 05/01/2024
 * 
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/09/2024
 */

import React, { useState, useEffect } from 'react';
import '../assets/css/modals.css'
import '../Neptune.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'
import AccountDashboardModalComponent from './account-dashboard-modal-component';
import ClassSchedulesSuperAdminModalComponent from './class-schedules-superadmin-modal-component'
import * as api from "../utilities/api";
import AlertNotificationComponent from './alert-notification-component';

// This is the main component
const ClassSchedulesModalComponent = ({ showModal, handleClose, value, onConfirm, files, initialData, room}) => {
    // Modal Section
    const [activeTab, setActiveTab] = useState('Class Schedule');
    const [schedules, setSchedules] = useState([]);
    const [calendarSchedules, setCalendarSchedules] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // a custom render function
    function renderEventContent(eventInfo) {
        return (
            <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </>
        )
    }

    useEffect(() => {
        fetchSchedulesByRoomId(); 
        // eslint-disable-next-line
    }, []); 

    const getDayNumber = (days) => {
        const day_number_map = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 7
        };

        // loop through the list of day strings and map each day to its number
        return days.map(day => {
            let lower_day_str = day.toLowerCase();
            if (lower_day_str in day_number_map) { // return the day's corresponding number
                return day_number_map[lower_day_str];
            } else {
                return null;
            }
        });
    };

    const fetchSchedulesByRoomId = async () => {    
        try {
            setShowCalendar(false);
            const result = await api.getRoomSchedules(room.room_id);
            if (result.data && result.data.success) {
                setSchedules(result.data.schedules);

                const class_sched_data = [];
                (result.data.schedules).forEach(sched => {
                    let class_sched = {
                        title: `${sched.course_code} ${sched.section}`,
                        startTime: sched.class_start_time,
                        endTime: sched.class_end_time,
                        daysOfWeek: getDayNumber(sched.days_of_week),
                    }
                    class_sched_data.push(class_sched);
                    setCalendarSchedules(class_sched_data);
                    setShowCalendar(true);
                });

            }
        } catch (error) {
            console.error("Error during fetchSchedules:", error.message);
            return;
        }
    };

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
        <div className={`modal ${showModal ? 'show' : ''}`} style={{ overflow: 'hidden' }}>
            <div className="modal-backdrop fade show" style={{ overflow: 'auto' }}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable"  >
                    <div className="modal-content class-sched-modal-container">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">
                                {room.room_name} | {room.room_type}
                            </h5>
                        </div>
                        <div className="modal-body calendar-tabs-container">
                            {showAlert && <AlertNotificationComponent success={alertSuccess} message={alertMessage} />}
                            {/* Left Side - Calendar of Room in weekly view */}
                            <div className="class-sched-calendar">
                                {showCalendar? (
                                <FullCalendar
                                    plugins={[timeGridPlugin]}
                                    initialView='timeGridWeek'
                                    weekends={true}
                                    events={calendarSchedules}
                                    eventContent={renderEventContent}
                                    headerToolbar={{
                                        left: 'prev,next',
                                        center: 'title',
                                        right: 'today'
                                    }}
                                    slotMinTime={'07:00:00'}
                                    slotMaxTime={'22:00:00'}
                                />
                                ) : <div className="spinner-container" style={{height: "80vh"}}>
                                        <div className="spinner"></div>
                                    </div>}
                            </div>
                            
                            {/* Right Side - Room Schedule Controls */}
                            <div class="card align-center class-sched-tabs">
                                <div className="card-body classes-tab">
                                    <ul className="nav nav-tabs mb-2" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link clear ${activeTab === 'Class Schedule' ? 'active' : ''}`} onClick={() => setActiveTab('Class Schedule')}>Classes</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link clear class-nowrap ${activeTab === 'Add Schedule' ? 'active' : ''}`} onClick={() => setActiveTab('Add Schedule')}>Add Class</button>
                                        </li>
                                    </ul>

                                    {/* General Tab */}
                                    {activeTab === 'Class Schedule' && (
                                        // This is where the Class instances are rendered
                                        <div className="class-cards-container">
                                            {
                                                schedules.map((schedule, i) => 
                                                    <ClassSchedulesInstanceComponent key={i} schedule={schedule} room={room} schedules={schedules} setSchedules={data => setSchedules(data)} handleShowAlert={handleShowAlert}/>
                                                )
                                            }
                                        </div>
                                    )}

                                    {/* Properties Tab */}
                                    {activeTab === 'Add Schedule' && (
                                        // This is where the Add Class form is rendered
                                        <div className="class-form-container">
                                            <AddClassFormComponent room = {room} handleShowAlert={handleShowAlert}/>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

// This is the component for each class instance
const ClassSchedulesInstanceComponent = ({ schedule, room, schedules, setSchedules, handleShowAlert }) => {

    // Modal Section
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Open a modal when update button is clicked
    const handleUpdateButtonClick = () => {
        setShowUpdateModal(true);
    };

    // Open a modal when delete button is clicked
    const handleDeleteButtonClick = () => {
        setShowDeleteModal(true);
    };

    // Render modal for confirmation
    const renderModalConfirm = (value, onConfirm, showModal, setShowModal) => {
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

    // DELETE Schedule
    const handleDelete = async (password, schedule) => {
        try {
            const data = { password: password, roomName: room.room_name };
            const options = { body: data };
            const result = await api.deleteSchedule(options, schedule.schedule_id);
            if (result.data.success) {
                handleShowAlert(true, result.data.message);
            } else {
                handleShowAlert(false, result.data.message);
            }
        } catch (error) {
            handleShowAlert(false, error.response.data.message);
            console.error('Error deleting room: ', error);
        }
        setShowDeleteModal(false);
    };

    // END of MODAL Section
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

    function abbreviateDaysOfWeek(days) {
        const abbreviations = {
            "Monday": "M",
            "Tuesday": "Tu",
            "Wednesday": "W",
            "Thursday": "Th",
            "Friday": "F",
            "Saturday": "Sat",
            "Sunday": "Sun"
        };
        if (days.length === 1) {
            return abbreviations[days[0]];
        } else {
            return days.map(day => abbreviations[day]).join("");
        }
    }
    return (
        <div class="card">
            <div class="card-body card-instance">
                <ul>
                    <li>
                        <b>{schedule.course_code} - {schedule.section}</b>
                    </li>
                    <li>
                        Class time: {convertTo12HourFormat(schedule.class_start_time)}-{convertTo12HourFormat(schedule.class_end_time)} {abbreviateDaysOfWeek(schedule.days_of_week)}
                        {}
                    </li>
                    <li>
                        Faculty: {schedule.faculty}
                    </li>
                </ul>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button class="btn btn-gray flex-fill btn-primary btn-dashboard" onClick={handleUpdateButtonClick} style={{ lineHeight: "2.7", marginTop: "10px", marginRight: "10px" }}>
                        <i class="material-icons" style={{ fontSize: "20px", marginRight: "0px", marginLeft: "0px", color: '#ebebeb' }}>edit</i>
                    </button>
                    <button class="btn btn-red flex-fill btn-primary btn-dashboard" onClick={handleDeleteButtonClick} style={{ lineHeight: "2.7", marginTop: "10px" }}>
                        <i class="material-icons" style={{ fontSize: "20px", marginRight: "0px", marginLeft: "0px", color: '#ebebeb' }}>delete</i>
                    </button>
                </div>
            </div>
            {setShowUpdateModal && <ClassSchedulesSuperAdminModalComponent showModal={showUpdateModal} closeModal={() => setShowUpdateModal(false)} currentScheduleId={schedule.schedule_id} actionType="edit" roomData={[]} scheduleData={schedules} setScheduleData={data => setSchedules(data)} handleShowAlert={handleShowAlert}/>}
            {renderModalConfirm('delete schedule', (password) => {handleDelete(password, schedule);}, showDeleteModal, setShowDeleteModal)}
        </div>
    );
}

// This is the component for the Add Class form
const AddClassFormComponent = ({room, handleShowAlert}) => {
    // Initialize states of variables
    const [showAddModal, setShowAddModal] = useState(false);
    const [allInputsFilled, setAllInputsFilled] = useState(false); // Initial state: button disabled
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [checkedDays, setCheckedDays] = useState([]);
    const [enableAddButton, setEnableAddButton] = useState(false);
    const [courseCodeError, setCourseCodeError] = useState(false);

    // List of time options
    const timeList = [
        '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM',
        '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
    ];

    // List of start time options
    const startTimeOptionList = timeList.slice(0, -1);

    // Get the end time options based on the selected start time
    const getEndTimeOption = () => {
        const timeIndex = timeList.findIndex(time => time === startTime);
        const endTimeOptions = timeList.slice(timeIndex + 1);
        return endTimeOptions;
    };

    // Check if all form fields are filled
    useEffect(() => {
        if (allInputsFilled && startTime !== "" && endTime !== "" && checkedDays.length > 0 && !courseCodeError) {
            setEnableAddButton(true);
        } else {
            setEnableAddButton(false);
        }
    }, [allInputsFilled, startTime, endTime, checkedDays, courseCodeError]);

    // Check if the text fields are are not empty
    const handleInputChange = (event) => {
        const allTextFields = document.querySelectorAll('.course-input');
        let areAllFilled = true;

        // Check for empty or whitespace-only values            
        for (let i = 0; i < allTextFields.length; i++) {
            if (allTextFields[i].value.trim() === '') {
                areAllFilled = false;
            }
        }

        // Update state based on input changes
        setAllInputsFilled(areAllFilled);
    };

    // CREATE Schedule
    const handleAdd = async (password, room) => {
        try{
            const formValues = {
                password: password,
                roomName: room.room_name,
                courseCode: document.querySelector('.form-course-code').value,
                courseTitle: document.querySelector('.form-course-title').value,
                courseSection: document.querySelector('.form-course-section').value,
                faculty: document.querySelector('.form-faculty').value,
                days: checkedDays,
                startTime: startTime,
                endTime: endTime
            };
            const options = { body:formValues };
            const result = await api.createSchedule(options);
            if (result.data.success) {
                handleShowAlert(true, result.data.message);
            } else {
                handleShowAlert(false, result.data.message);
            }
        } catch (error) {
          console.error("Error during POST request:", error);
          handleShowAlert(false, error.response.data.message);
        }

        const allTextFields = document.querySelectorAll('.course-input');
        allTextFields.forEach(field => {
            field.value = '';  // Set the values of each field to an empty string
        });

        // Uncheck all checkboxes
        const allCheckboxes = document.querySelectorAll('.form-days-checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;  
        });

        setAllInputsFilled(false);
        setStartTime('');
        setEndTime('');
        setCheckedDays([]);
        setShowAddModal(false);
    };

    // Update the checkedDays array when a checkbox is clicked
    const handleCheckboxChange = (event) => {
        const value = event.target.value;

        // If the checkbox is selected, remove it from the array
        if (checkedDays.includes(value)) {
            setCheckedDays(checkedDays.filter((item) => item !== value));
        } else {
            // If the checkbox is not selected, add it to the array
            setCheckedDays([...checkedDays, value]);
        }
    };

    // Validate course code
    const validateCourseCode = (courseCode) => {
        // Check if course code is empty
        if (courseCode === '') {
            setCourseCodeError(false);
            return;
        }

        // Check if course code is valid
        const courseCodeRegex = /^(IT|CMSC) \d{1,3}$/;
        const isValid = courseCodeRegex.test(courseCode);
        setCourseCodeError(!isValid);
    };

    // Open a modal when add button is clicked
    const handleAddButtonClick = () => {
        setShowAddModal(true); // Open the modal
    };

    // Render modal for confirmation
    const renderModalConfirm = (value, onConfirm, showModal, setShowModal) => {
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

    return (
        <>
            {/* Course Code */}
            <label className="form-label m-t-xxs m-b-xxs auth-font-label">Course Code</label>
            <input
                type="text"
                className="form-control course-input form-course-code" // Added course-input a class for easier selection
                placeholder=""
                onChange={(event) => {
                    validateCourseCode(event.target.value);
                    handleInputChange(event);
                }} // Attach change handler to each input
            />
            {courseCodeError && <p className="error-message" style={{marginTop:"15px"}}>Please enter a valid course code (ex. CMSC 12, IT 210)</p>}

            {/* Course Title */}
            <label className="form-label m-t-xxs m-b-xxs auth-font-label">Course Title</label>
            <input
                type="text"
                className="form-control course-input form-course-title"
                placeholder=""
                onChange={handleInputChange}
            />

            {/* Course Section */}
            <label className="form-label m-t-xxs m-b-xxs auth-font-label">Course Section</label>
            <input
                type="text"
                className="form-control course-input form-course-section"
                placeholder=""
                onChange={handleInputChange}
            />

            {/* Faculty */}
            <label className="form-label m-t-xxs m-b-xxs auth-font-label">Faculty</label>
            <input
                type="text"
                className="form-control course-input form-faculty"
                placeholder=""
                onChange={handleInputChange}
            />

            {/* Days of Week */}
            <label className="form-label m-t-xxs m-b-xxs auth-font-label">Days of the Week</label>
            <div className="form-days days-label">
                <div className='days-col'>
                    <div>
                        <input className="form-check-input form-days-checkbox" type="checkbox" id="inlineCheckbox1" value="Monday" onChange={handleCheckboxChange} />
                        <label className="form-check-label" htmlFor="inlineCheckbox1">Monday</label>
                    </div>
                    <div>
                        <input className="form-check-input form-days-checkbox" type="checkbox" id="inlineCheckbox2" value="Tuesday" onChange={handleCheckboxChange} />
                        <label className="form-check-label" htmlFor="inlineCheckbox2">Tuesday</label>
                    </div>
                    <div>
                        <input className="form-check-input form-days-checkbox" type="checkbox" id="inlineCheckbox3" value="Wednesday" onChange={handleCheckboxChange} />
                        <label className="form-check-label" htmlFor="inlineCheckbox3">Wednesday</label>
                    </div>
                    <div>
                        <input className="form-check-input form-days-checkbox" type="checkbox" id="inlineCheckbox4" value="Thursday" onChange={handleCheckboxChange} />
                        <label className="form-check-label" htmlFor="inlineCheckbox4">Thursday</label>
                    </div>
                    <div>
                        <input className="form-check-input form-days-checkbox" type="checkbox" id="inlineCheckbox5" value="Friday" onChange={handleCheckboxChange} />
                        <label className="form-check-label" htmlFor="inlineCheckbox5">Friday</label>
                    </div>
                </div>
            </div>

            {/* Time Start */}
            <label className="form-label m-t-xxs m-b-xxs auth-font-label">Start Time</label>
            <select className="form-control class-form-time" value={startTime} onChange={(event) => setStartTime(event.target.value)}>
                <option value="" disabled selected>--:--</option>
                {startTimeOptionList.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                ))}
            </select>

            {/* Time End */}
            <label className="form-label m-t-xxs m-b-xxs auth-font-label">End Time</label>
            <select className="form-control class-form-time" value={endTime} onChange={(event) => setEndTime(event.target.value)} disabled={startTime === ''}>
                <option value="" disabled selected>--:--</option>
                {getEndTimeOption().map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                ))}
            </select>

            {/* Add Class */}
            <div>
                <button
                    className={`add-class-button-absolute btn flex-fill btn-primary btn-dashboard ${!enableAddButton ? 'disabled' : ''}`} // Disable button conditionally
                    onClick={handleAddButtonClick}
                    style={{ lineHeight: "2.7", marginBottom: "25px" }}
                    disabled={!enableAddButton} // Set disabled attribute directly for better accessibility
                >
                    Add Class
                </button>
                {renderModalConfirm('add schedule', (password) => {handleAdd(password, room);}, showAddModal, setShowAddModal)}
            </div>
        </>
    );
}

export default ClassSchedulesModalComponent;