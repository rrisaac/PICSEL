/**
 * User Table for Superadmin
 *
 * @description Shows the table of users and allows editing of users
 * @author Gacel Perfinian
 * @date 04/26/2024
 * 
 * @description Minor cleanup including removing mock data
 * @author Gacel Perfinian
 * @date 04/28/2024
 * 
 * @description Use React to Handle Tab Switching
 * @author Gacel Perfinian
 * @date 05/05/2024
 * 
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/09/2024
 */

import React, { useState, useEffect } from 'react';
import '../Neptune.css';
import {USER_TYPES} from '../utilities/constant'
import DataTablesComponent from './datatables-component';
import UsersModalComponent from './users-modal-component';
import * as api from "../utilities/api";
import AlertNotificationComponent from './alert-notification-component';

const UsersComponent = () => {

    const [userData, setUserData] = useState([])
    const [currentUserId, setCurrentUserId] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showTable, setShowTable] = useState(false)
    const [showTab, setShowTab] = useState("all")
    const [actionType, setActionType] = useState("")
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Definitions of tables
    const ALL_USERS_DT_COLUMN_DEFINITION = [
        {title: "DP", data: "parsed_picture", responsivePriority: 0, render: ((data) => {return `<img src="${data}">`}), orderable: false, className: "usertable-photo", width: "32px"},
        {title: "User ID", data: "user_id", className: "usertable-id usertable-nowrap", responsivePriority: 10003, render: ((data) => {return `${data.toUpperCase().substring(0,19)}<br style="display:none"/>${data.toUpperCase().substring(19)}`})},
        {title: "User Type", data: "user_type", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Name", data: "name", className: "usertable-nowrap", responsivePriority: 1},
        {title: "E-mail", data: "email", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Username", data: "username", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Contact No.", data: "contact_number", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Actions", data: "user_id", className: "usertable-actions usertable-nowrap", width: "40px", orderable: false, responsivePriority: 0, render: ((data) => {return `
        <button class='usertable-actions blue' data-id='${data}' data-action='edit' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">edit</i></button>
        <button class='usertable-actions red' data-id='${data}' data-action='delete' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">delete_forever</i></button>
        `})}
    ]
    
    const STUDENT_DT_COLUMN_DEFINITION = [
        {title: "DP", data: "parsed_picture", responsivePriority: 0, render: ((data) => {return `<img src="${data}">`}), orderable: false, className: "usertable-photo", width: "32px"},
        {title: "User ID", data: "user_id", className: "usertable-id usertable-nowrap", responsivePriority: 10003, render: ((data) => {return `${data.toUpperCase().substring(0,19)}<br style="display:none"/>${data.toUpperCase().substring(19)}`})},
        {title: "Name", data: "name", className: "usertable-nowrap", responsivePriority: 1},
        {title: "E-mail", data: "email", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Username", data: "username", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Contact No.", data: "contact_number", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Student No.", data: "student_number", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Actions", data: "user_id", className: "usertable-actions usertable-nowrap", width: "40px", orderable: false, responsivePriority: 0, render: ((data) => {return `
        <button class='usertable-actions blue' data-id='${data}' data-action='edit' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">edit</i></button>
        <button class='usertable-actions red' data-id='${data}' data-action='delete' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">delete_forever</i></button>
        `})}
    ]
    
    const STUDENT_ORG_DT_COLUMN_DEFINITION = [
        {title: "DP", data: "parsed_picture", responsivePriority: 0, render: ((data) => {return `<img src="${data}">`}), orderable: false, className: "usertable-photo", width: "32px"},
        {title: "User ID", data: "user_id", className: "usertable-id usertable-nowrap", responsivePriority: 10003, render: ((data) => {return `${data.toUpperCase().substring(0,19)}<br style="display:none"/>${data.toUpperCase().substring(19)}`})},
        {title: "Org. Name", data: "organization_name", className: "usertable-nowrap", responsivePriority: 1},
        {title: "E-mail", data: "email", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Username", data: "username", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Contact No.", data: "contact_number", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Repr.", data: "name", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Actions", data: "user_id", className: "usertable-actions usertable-nowrap", width: "40px", orderable: false, responsivePriority: 0, render: ((data) => {return `
        <button class='usertable-actions blue' data-id='${data}' data-action='edit' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">edit</i></button>
        <button class='usertable-actions red' data-id='${data}' data-action='delete' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">delete_forever</i></button>
        `})}
    ]
    
    const FACULTY_DT_COLUMN_DEFINITION = [
        {title: "DP", data: "parsed_picture", responsivePriority: 0, render: ((data) => {return `<img src="${data}">`}), orderable: false, className: "usertable-photo", width: "32px"},
        {title: "User ID", data: "user_id", className: "usertable-id usertable-nowrap", responsivePriority: 10003, render: ((data) => {return `${data.toUpperCase().substring(0,19)}<br style="display:none"/>${data.toUpperCase().substring(19)}`})},
        {title: "Name", data: "name", className: "usertable-nowrap", responsivePriority: 1},
        {title: "E-mail", data: "email", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Username", data: "username", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Contact No.", data: "contact_number", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Dept.", data: "department", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Actions", data: "user_id", className: "usertable-actions usertable-nowrap", width: "40px", orderable: false, responsivePriority: 0, render: ((data) => {return `
        <button class='usertable-actions blue' data-id='${data}' data-action='edit' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">edit</i></button>
        <button class='usertable-actions red' data-id='${data}' data-action='delete' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">delete_forever</i></button>
        `})}
    ]
    
    const ADMIN_DT_COLUMN_DEFINITION = [
        {title: "DP", data: "parsed_picture", responsivePriority: 0, render: ((data) => {return `<img src="${data}">`}), orderable: false, className: "usertable-photo", width: "32px"},
        {title: "User ID", data: "user_id", className: "usertable-id usertable-nowrap", responsivePriority: 10003, render: ((data) => {return `${data.toUpperCase().substring(0,19)}<br style="display:none"/>${data.toUpperCase().substring(19)}`})},
        {title: "Name", data: "name", className: "usertable-nowrap", responsivePriority: 1},
        {title: "E-mail", data: "email", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Username", data: "username", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Contact number", data: "contact_number", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Actions", data: "user_id", className: "usertable-actions usertable-nowrap", width: "40px", orderable: false, responsivePriority: 0, render: ((data) => {return `
        <button class='usertable-actions blue' data-id='${data}' data-action='edit' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">edit</i></button>
        <button class='usertable-actions red' data-id='${data}' data-action='delete' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">delete_forever</i></button>
        `})}
    ]
    
    const GUEST_DT_COLUMN_DEFINITION = [
        {title: "DP", data: "parsed_picture", responsivePriority: 0, render: ((data) => {return `<img src="${data}">`}), orderable: false, className: "usertable-photo", width: "32px"},
        {title: "User ID", data: "user_id", className: "usertable-id usertable-nowrap", responsivePriority: 10003, render: ((data) => {return `${data.toUpperCase().substring(0,19)}<br style="display:none"/>${data.toUpperCase().substring(19)}`})},
        {title: "Name", data: "name", className: "usertable-nowrap", responsivePriority: 1},
        {title: "E-mail", data: "email", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Username", data: "username", className: "usertable-nowrap", responsivePriority: 1},
        {title: "Contact number", data: "contact_number", className: "usertable-nowrap", responsivePriority: 2},
        {title: "Actions", data: "user_id", className: "usertable-actions usertable-nowrap", width: "40px", orderable: false, responsivePriority: 0, render: ((data) => {return `
        <button class='usertable-actions blue' data-id='${data}' data-action='edit' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">edit</i></button>
        <button class='usertable-actions red' data-id='${data}' data-action='delete' onclick='window.DataTableActionPress(this)'><i class="material-icons-outlined">delete_forever</i></button>
        `})}
    ]
    
    const constructName = (data) => {
        return data.last_name + ', ' + data.first_name + ((!data.middle_name | data.middle_name === 'N/A')? '' : ' ' + data.middle_name)
    }

    const parsePicture = (picture) => {
        // PNG Header
        const headerPNG = 'iVBORw0KGg'
        const blackPicture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQAAAAA3bvkkAAAACklEQVR4AWNgAAAAAgABc3UBGAAAAABJRU5ErkJggg=='

        if (!picture)
            return blackPicture
        else if (picture.includes('.'))
            return picture;
        else if (picture.startsWith(headerPNG))
            return 'data:image/png;base64,'.concat(picture)
        else
            return 'data:image/jpeg;base64,'.concat(picture)
    }

    const fetchData = async () => {
        try {
            const users = await api.getAllUsers();

            setUserData(users.data.users.map((x) => {
                return {
                    ...x,
                    name: constructName(x),
                    parsed_picture: parsePicture(x.display_picture),
                }
            }))

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
            setCurrentUserId(window.DataTableActionData.id)
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
        // eslint-disable-next-line
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
                <title>Users | PICSEL</title>
                <div className="page-description">
                    <h1>Users</h1>
                </div>
            </div>
            <div className="white-rectangle" style={{ 
                borderRadius: 15, 
                marginLeft: 0,
                marginRight: 8, 
                }}>
                {showModal && <UsersModalComponent showModal={showModal} closeModal={() => setShowModal(false)} currentUserId={currentUserId} actionType={actionType} userData={userData} setUserData={setUserData} handleShowAlert={handleShowAlert}/>}
                {showTable? (
                <div className="widget-stats-container d-flex" style={{flexGrow: 1, padding: 20, overflow: 'hidden'}}>
                    <div className="widget-stats-content flex-fill" style={{width: '100%'}}>
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button className={"nav-link ".concat((showTab === "all")? "active": "")} onClick={() => (showTab !== "all") && setShowTab("all")} type="button">All Users</button>
                            </li>
                            <li className="nav-item">
                                <button className={"nav-link ".concat((showTab === "student")? "active": "")}  onClick={() => (showTab !== "student") && setShowTab("student")} type="button">Students</button>
                            </li>
                            <li className="nav-item">
                                <button className={"nav-link ".concat((showTab === "student-org")? "active": "")}  onClick={() => (showTab !== "student-org") && setShowTab("student-org")} type="button">Student Orgs</button>
                            </li>
                            <li className="nav-item">
                                <button className={"nav-link ".concat((showTab === "faculty")? "active": "")}  onClick={() => (showTab !== "faculty") && setShowTab("faculty")} type="button">Faculty</button>
                            </li>
                            <li className="nav-item">
                                <button className={"nav-link ".concat((showTab === "admin")? "active": "")}  onClick={() => (showTab !== "admin") && setShowTab("admin")} type="button">Admin</button>
                            </li>
                            <li className="nav-item">
                                <button className={"nav-link ".concat((showTab === "guest")? "active": "")}  onClick={() => (showTab !== "guest") && setShowTab("guest")} type="button">Guests</button>
                            </li>
                        </ul>
                        <div className="tab-content m-t-md">
                            {showTab === 'all' && <div className="tab-pane show active" id="all-pane"><DataTablesComponent key="all-table" id="all-table" columns={ALL_USERS_DT_COLUMN_DEFINITION} data={userData}/></div>}
                            {showTab === 'student' && <div className="tab-pane show active" id="student-pane"><DataTablesComponent key="student-table" id="student-table" columns={STUDENT_DT_COLUMN_DEFINITION} data={userData.filter((x) => x.user_type === USER_TYPES.STUDENT)}/></div>}
                            {showTab === 'student-org' && <div className="tab-pane show active" id="student-org-pane"><DataTablesComponent key="student-org-table" id="student-org-table" columns={STUDENT_ORG_DT_COLUMN_DEFINITION} data={userData.filter((x) => x.user_type === USER_TYPES.STUDENT_ORGANIZATION)}/></div>}
                            {showTab === 'faculty' && <div className="tab-pane show active" id="faculty-pane"><DataTablesComponent key="faculty-table" id="faculty-table" columns={FACULTY_DT_COLUMN_DEFINITION} data={userData.filter((x) => x.user_type === USER_TYPES.FACULTY)}/></div>}
                            {showTab === 'admin' && <div className="tab-pane show active" id="admin-pane"><DataTablesComponent key="admin-table" id="admin-table" columns={ADMIN_DT_COLUMN_DEFINITION} data={userData.filter((x) => x.user_type === USER_TYPES.ADMIN)}/></div>}
                            {showTab === 'guest' && <div className="tab-pane show active" id="guest-pane"><DataTablesComponent key="guest-table" id="guest-table" columns={GUEST_DT_COLUMN_DEFINITION} data={userData.filter((x) => x.user_type === USER_TYPES.GUEST)}/></div>}
                        </div>
                    </div>
                </div>
                ):  <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>}
            </div>
        </div>
        </>
    );
    
}

export default UsersComponent;