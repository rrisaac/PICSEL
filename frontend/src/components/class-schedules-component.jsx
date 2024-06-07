/* Description: To future frontend developer please change this docs. This is only a placeholder component prepared by Frontend TL Isaac

@author 
@date 
*/

/**
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/09/2024
 */

import { useState, useEffect } from "react";
import * as api from "../utilities/api";
import DataTablesComponent from "./datatables-component";
import ClassSchedulesSuperAdminModalComponent from "./class-schedules-superadmin-modal-component";
import AlertNotificationComponent from './alert-notification-component';

const ClassSchedulesComponent = () => {

    const [scheduleData, setScheduleData] = useState([])
    const [roomData, setRoomData] = useState([])
    const [currentScheduleId, setCurrentScheduleId] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showTable, setShowTable] = useState(false)
    const [actionType, setActionType] = useState("")
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Definitions of tables
    const SCHEDULE_DT_COLUMN_DEFINITION = [
        {title: "Course Code", data: "course_code", className: "usertable-nowrap", responsivePriority: 0},
        {title: "Schedule ID", data: "schedule_id", className: "usertable-nowrap", responsivePriority: 1, render: ((data) => `SCH-${data.toUpperCase().substring(0,8)}`)},
        {title: "Course Title", data: "course_title", responsivePriority: 2},
        {title: "Room Name", data: "room_name", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Section", data: "section", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Faculty", data: "faculty", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Days of Week", data: "days_of_week", className: "usertable-nowrap", responsivePriority: 2, render: ((data) => data.join(", "))},
        {title: "Start Time", data: "class_start_time", className: "usertable-nowrap", responsivePriority: 2, render: ((data) => {const sliced = data.split(':'); return `${((((sliced[0])-1)%12)+1).toString().padStart(2,"0")}:${sliced[1]} ${Number(sliced[0])>11?'PM':'AM'}`})},
        {title: "End Time", data: "class_end_time", className: "usertable-nowrap", responsivePriority: 2, render: ((data) => {const sliced = data.split(':'); return `${((((sliced[0])-1)%12)+1).toString().padStart(2,"0")}:${sliced[1]} ${Number(sliced[0])>11?'PM':'AM'}`})},
        {title: "Actions", data: "schedule_id", className: "usertable-actions usertable-nowrap", width: "40px", orderable: false, responsivePriority: 0, render: ((data) => {return `
        <button class='usertable-actions blue' data-id='${data}' data-action='edit' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">edit</i></button>
        <button class='usertable-actions red' data-id='${data}' data-action='delete' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">delete_forever</i></button>
        `})}
    ]
    
    const fetchData = async () => {
        try {
            const schedules = await api.getSchedules()
            const rooms = await api.getRooms()

            setRoomData(rooms.data.rooms.map((room_data) => (
                {
                    room_id: room_data.room_id,
                    room_name: room_data.room_name
                }
            )))

            setScheduleData(schedules.data.schedules.map((schedule_data) => 
                {
                    const matched_room = rooms.data.rooms.find((room_data) => 
                        (room_data.room_id && room_data.room_id === schedule_data.room_id))
                    
                    return {
                        ...schedule_data,
                        room_name: matched_room? matched_room.room_name: "Deleted Room"
                    }   
                }
            ))

            // Turn on tables
            setShowTable(true)
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        // Fetch data
        fetchData()

        // Listen to DataTableAction and change states if necessary
        const updateDTState = () => {
            // Update state
            setCurrentScheduleId(window.DataTableActionData.id)
            setActionType(window.DataTableActionData.action)

            // Remove data from global object
            window.DataTableActionData = undefined

            // Trigger modal
            setShowModal(true)
        }
        window.addEventListener('DataTableAction', updateDTState);
        return () => {
          window.removeEventListener('DataTableAction', updateDTState);
        };
    }, [])

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
            <div >
                <title>Class Schedules | PICSEL</title>
                <div className="page-description">
                    <h1>Class Schedules</h1>
                </div>
            </div>
            <div className="white-rectangle" style={{ 
                borderRadius: 15, 
                marginLeft: 0,
                marginRight: 8, 
                }}>
                {showModal && <ClassSchedulesSuperAdminModalComponent showModal={showModal} closeModal={() => setShowModal(false)} currentScheduleId={currentScheduleId} actionType={actionType} roomData={roomData} scheduleData={scheduleData} setScheduleData={(x) => setScheduleData(x)} handleShowAlert={handleShowAlert}/>}
                {showTable? (
                    <div className="widget-stats-container d-flex" style={{flexGrow: 1, padding: 20, overflow: 'hidden'}}>
                        <div className="widget-stats-content flex-fill" style={{width: '100%'}}>
                            <DataTablesComponent key="schedule-table" id="schedule-table" columns={SCHEDULE_DT_COLUMN_DEFINITION} data={scheduleData}/>
                        </div>
                    </div>
                ): (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}


export default ClassSchedulesComponent;