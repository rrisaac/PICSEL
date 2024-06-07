/**
 * Class Schedule Modal for SuperAdmin
 *
 * @description Shows and handles the edit interface, and handles the deletion request
 * (AccountDashboardModalComponent shows the deletion interface)
 * @author Gacel Perfinian
 * @date 05/02/2024
 * 
 * @description Fixed bugs on handing daysOfWeek
 * @author Gacel Perfinian
 * @date 04/28/2024
 * 
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/09/2024
 */

import React, {useEffect, useState} from 'react'
import '../assets/css/modals.css'
import '../Neptune.css'
import { FACULTY } from '../utilities/constant'
import AccountDashboardModalComponent from './account-dashboard-modal-component'
import * as api from "../utilities/api"
import AlertNotificationComponent from './alert-notification-component';

const ClassSchedulesSuperAdminModalComponent = ({showModal, closeModal, currentScheduleId, actionType, roomData, scheduleData, setScheduleData, handleShowAlert}) => {

    // DAYS_OF_WEEK
    // Chrome rearranges these in alphabetical order
    const DAYS_OF_WEEK = [
        ["SUN", "Sunday"],
        ["MON", "Monday"],
        ["TUE", "Tuesday"],
        ["WED", "Wednesday"],
        ["THU", "Thursday"],
        ["FRI", "Friday"],
        ["SAT", "Saturday"],
    ]

    // TIME
    const TIME_DISPLAY = [
        ["07", "07:00 AM"],
        ["08", "08:00 AM"],
        ["09", "09:00 AM"],
        ["10", "10:00 AM"],
        ["11", "11:00 AM"],
        ["12", "12:00 PM"],
        ["13", "01:00 PM"],
        ["14", "02:00 PM"],
        ["15", "03:00 PM"],
        ["16", "04:00 PM"],
        ["17", "05:00 PM"],
        ["18", "06:00 PM"],
        ["19", "07:00 PM"],
    ]

    const TIME_DB = [
        ["07", "07:00:00"],
        ["08", "08:00:00"],
        ["09", "09:00:00"],
        ["10", "10:00:00"],
        ["11", "11:00:00"],
        ["12", "12:00:00"],
        ["13", "13:00:00"],
        ["14", "14:00:00"],
        ["15", "15:00:00"],
        ["16", "16:00:00"],
        ["17", "17:00:00"],
        ["18", "18:00:00"],
        ["19", "19:00:00"],
    ]
    
    // Prepare data for editing
    const currentIndex = scheduleData.findIndex((x) => (x.schedule_id === currentScheduleId))
    const [cachedRoomData, setRoomData] = useState(roomData)
    const [roomId, setRoomId] = useState(scheduleData[currentIndex].room_id)
    const [courseTitle, setCourseTitle] = useState(scheduleData[currentIndex].course_title)
    const [courseCode, setCourseCode] = useState(scheduleData[currentIndex].course_code)
    const [section, setSection] = useState(scheduleData[currentIndex].section)
    const [faculty, setFaculty] = useState(scheduleData[currentIndex].faculty)
    const [startTime, setStartTime] = useState(scheduleData[currentIndex].class_start_time)
    const [endTime, setEndTime] = useState(scheduleData[currentIndex].class_end_time)
    const [daysOfWeek, setDaysOfWeek] = useState(scheduleData[currentIndex].days_of_week)
    const [monday, setMonday] = useState(scheduleData[currentIndex].days_of_week.includes("Monday"))
    const [tuesday, setTuesday] = useState(scheduleData[currentIndex].days_of_week.includes("Tuesday"))
    const [wednesday, setWednesday] = useState(scheduleData[currentIndex].days_of_week.includes("Wednesday"))
    const [thursday, setThursday] = useState(scheduleData[currentIndex].days_of_week.includes("Thursday"))
    const [friday, setFriday] = useState(scheduleData[currentIndex].days_of_week.includes("Friday"))
    const [saturday, setSaturday] = useState(scheduleData[currentIndex].days_of_week.includes("Saturday"))
    const [sunday, setSunday] = useState(scheduleData[currentIndex].days_of_week.includes("Sunday"))
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const DAYS_OF_WEEK_STATE = {
        SUN: [sunday, setSunday],
        MON: [monday, setMonday],
        TUE: [tuesday, setTuesday],
        WED: [wednesday, setWednesday],
        THU: [thursday, setThursday],
        FRI: [friday, setFriday],
        SAT: [saturday, setSaturday],
    }

    const compiledScheduleData = () => {
        return {
            schedule_id: currentScheduleId,
            room_id: roomId,
            course_title: courseTitle,
            course_code: courseCode,
            section: section,
            faculty: faculty,
            class_start_time: startTime,
            class_end_time: endTime,
            days_of_week: daysOfWeek,
        }
    }

    const validateCourseCode = () => {
        return /^(CMSC|IT) ([0-9]{1,3})$/.test(courseCode)
    }

    const updateDays = (el) => {
        // Update appropriate star
        DAYS_OF_WEEK_STATE[el.dataset.key][1](el.checked)
    }

    const fetchRoomData = async () => {
        try {
            const rooms = await api.getRooms()

            setRoomData(rooms.data.rooms.map((room_data) => (
                {
                    room_id: room_data.room_id,
                    room_name: room_data.room_name
                }
            )))
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

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

    useEffect (() => {
        // If there's existing data, continue
        if (cachedRoomData.length)
            return undefined
        // Else, reload data
        else
            fetchRoomData()
    // eslint-disable-next-line
    }, [])

    useEffect (() => {
        // Update end time when start time is later
        if (Number(startTime.split(":")[0]) > Number(endTime.split(":")[0]))
            setEndTime(TIME_DB.find(([key, value]) => (Number(key) > Number(startTime.split(":")[0])))[1])
    // eslint-disable-next-line
    }, [startTime])

    useEffect (() => {
        // Update internal structure
        setDaysOfWeek([
            sunday? "Sunday": undefined,
            monday? "Monday": undefined,
            tuesday? "Tuesday": undefined,
            wednesday? "Wednesday": undefined,
            thursday? "Thursday": undefined,
            friday? "Friday": undefined,
            saturday? "Saturday": undefined,
        ].filter(x => x !== undefined))
    }, [sunday, monday, tuesday, wednesday, thursday, friday, saturday])

    const validateData = () => {
        return validateCourseCode() && courseTitle && section && faculty && daysOfWeek.length && startTime && endTime
    }

    // DELETES Schedule
    const handleDeleteSchedule = async (password) => {
        try {
            const data = { password: password };
            const options = { body: data };

            const result = await api.deleteSchedule(options, scheduleData[currentIndex].schedule_id);
            if (result.data.success) {
                handleShowAlert(true, result.data.message);

                let modifiedScheduleData = [...scheduleData]
                modifiedScheduleData.splice(currentIndex, 1)
                setScheduleData(modifiedScheduleData)
            }
        } catch (error) {
            handleShowAlert(false, error.response.data.message);
        }
    };

    // UPDATES User
    const handleUpdateSchedule = async (password) => {
        setAlertSuccess(false);
        setAlertMessage('');
        setShowAlert(false);

        try {
            const data = { 
                password: password,
                roomName: cachedRoomData.length? cachedRoomData.find(x => x.room_id === roomId).room_name: "Loading data...",
                courseCode: courseCode,
                courseTitle: courseTitle,
                section: section,
                faculty: faculty,
                daysOfWeek: daysOfWeek,
                classStartTime: startTime,
                classEndTime: endTime
            };

            const options = { body: data };

            const result = await api.editSchedule(options, currentScheduleId);
            if (result.data.success) {
                handleShowAlert(true, result.data.message);

                let modifiedScheduleData = [...scheduleData]
                modifiedScheduleData[currentIndex] = compiledScheduleData()
                modifiedScheduleData[currentIndex].room_name = cachedRoomData.length? cachedRoomData.find(x => x.room_id === roomId).room_name: "Loading data..."
                setScheduleData(modifiedScheduleData)
            }

            closeModal();
        } catch (error) {
            setAlertSuccess(false);
            setAlertMessage(error.response.data.message);
            setShowAlert(true);
        }
    };

    if (actionType === 'delete') return <AccountDashboardModalComponent showModal={showModal} handleClose={closeModal} onConfirm={(password) => {handleDeleteSchedule(password);}} scheduleData={scheduleData[currentIndex]} value={'superadmin delete schedule'}/>;
    else return (
        <div className={`modal ${showModal ? 'show' : ''}`} style={{ overflow: 'hidden' }}>
        <div className="modal-backdrop fade show" style={{ overflow: 'auto' }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable"  >
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">
                    Edit Class
                </h5>
            </div>
            <div className="modal-body" style={{display:"flex", flexDirection:"row", flexWrap:"wrap", alignItems:"start", minWidth: 200}}>
                {/* Form Section Start */}
                {renderAlert(alertSuccess, alertMessage)}
                <form className="room-form-container">
                    {/* Schedule ID / Course Title / Section / Faculty */}
                    <div className='row'>
                        <div className="form-group col-xs-12 col-sm-3" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>Schedule ID</h3>
                            <input
                                style={{ height: 40 }}
                                type="text"
                                className="form-control"
                                id="schedule-id"
                                data-key="schedule_id"
                                value={`SCH-${scheduleData[currentIndex].schedule_id.toUpperCase().substring(0,8)}`}
                                disabled
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-3" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text' style={{ color: validateCourseCode()? undefined: '#F00' }}>Course Code</h3>
                            <input
                                style={{ 
                                    height: 40,
                                    color: validateCourseCode()? undefined: '#F00',
                                    borderColor: validateCourseCode()? undefined: '#F00',
                                }}
                                type="text"
                                className="form-control"
                                id="course-code"
                                data-key="course_code"
                                value={courseCode}
                                onChange={(event) => setCourseCode(event.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-3" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text' style={{ color: section? undefined: '#F00' }}>Section</h3>
                            <input
                                style={{ 
                                    height: 40,
                                    color: section? undefined: '#F00',
                                    borderColor: section? undefined: '#F00',
                                }}
                                type="text"
                                className="form-control"
                                id="section"
                                data-key="section"
                                value={section}
                                onChange={(event) => setSection(event.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-3" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>Faculty</h3>
                            <select class="js-states form-control" tabindex="-1"
                                style={{ height: 40 }}
                                id='faculty'
                                data-key='faculty'
                                value={faculty}
                                onChange={(event) => setFaculty(event.target.value)}
                                required>
                                {Object.values(FACULTY).includes(scheduleData[currentIndex].faculty)?
                                 null:
                                 (<option data-key="INVALID" value={scheduleData[currentIndex].faculty}>Keep Old Entry {'"'}{scheduleData[currentIndex].faculty}{'"'}</option>)}
                                {Object.entries(FACULTY).map(([key, value]) => (
                                    <option data-key={key} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Course Title */}
                    <div className='row'>
                        <div className="form-group col-xs-12 col-sm-12" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text' style={{ color: courseTitle? undefined: '#F00' }}>Course Title</h3>
                            <input
                                style={{ 
                                    height: 40,
                                    color: courseTitle? undefined: '#F00',
                                    borderColor: courseTitle? undefined: '#F00',
                                }}
                                type="text"
                                className="form-control"
                                id="course-title"
                                data-key="course_title"
                                value={courseTitle}
                                onChange={(event) => setCourseTitle(event.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {/* Room / Time */}
                    <div className='row'>
                        <div className="form-group col-xs-12 col-sm-6" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>Room</h3>
                            <select class="js-states form-control" tabindex="-1"
                                style={{ height: 40 }}
                                id='room-id'
                                data-key='room_id'
                                value={roomId}
                                onChange={(event) => setRoomId(event.target.value)}
                                required>
                                {!cachedRoomData.length && (<option data-key="" value="">Loading room data...</option>)}
                                {cachedRoomData.map((x) => (
                                    <option data-key={x.room_id} value={x.room_id}>
                                        {x.room_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group col-xs-12 col-sm-3" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>Start time</h3>
                            <select class="js-states form-control" tabindex="-1"
                                style={{ height: 40 }}
                                id='class-start-time'
                                data-key='class_start_time'
                                value={startTime}
                                onChange={(event) => setStartTime(event.target.value)}
                                required>
                                {TIME_DB.slice(0,-1).map(([key, value]) => (
                                    <option data-key={key} value={value}>
                                        {TIME_DISPLAY.find((kv) => kv[0] === key)[1]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group col-xs-12 col-sm-3" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>End Time</h3>
                            <select class="js-states form-control" tabindex="-1"
                                style={{ height: 40 }}
                                id='class-end-time'
                                data-key='class_end_time'
                                value={endTime}
                                onChange={(event) => setEndTime(event.target.value)}
                                required>
                                {TIME_DB.filter(([key, value]) => (Number(key) > Number(startTime.split(":")[0]))).map(([key, value]) => (
                                    <option data-key={key} value={value}>
                                        {TIME_DISPLAY.filter((kv) => kv[0] === key)[0][1]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Days of Week */}
                    <div className='row'>
                        <div className="form-group col-xs-12 col-sm-12" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text' style={{ color: daysOfWeek.length? undefined: '#F00' }}>Week</h3>
                            <div>
                                {DAYS_OF_WEEK.map(([key, value]) => (
                                <div className='col-xs-12 col-sm-3' >
                                    <input className="form-check-input" type="checkbox" id={`DAY-${key}`.toLowerCase()} data-key={key} value={value} checked={DAYS_OF_WEEK_STATE[key][0]} style={{ borderColor: daysOfWeek.length? undefined: '#F00' }} onChange={(event) => updateDays(event.target)} />
                                    <label className="form-check-label" htmlFor={`DAY-${key}`.toLowerCase()} style={{ color: daysOfWeek.length? undefined: '#F00' }}>{value}</label>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
                {/* Form Section End */}
            </div>
            <div className="modal-footer room-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => setShowConfirmModal(true)} disabled={!validateData()}>Save</button>
                {showConfirmModal? <AccountDashboardModalComponent showModal={showModal} handleClose={(() => setShowConfirmModal(false))} onConfirm={(password) => {handleUpdateSchedule(password);}} scheduleData={scheduleData[currentIndex]} value={'superadmin edit schedule'}/>: null}
            </div>
        </div>
        </div>
        </div>
        </div>
    );
}

export default ClassSchedulesSuperAdminModalComponent;