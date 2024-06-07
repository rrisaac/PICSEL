/* Description: Header component of account dashboard page

@author Prince Czedrick Nepomuceno
@date 03/23/2024

Description: Added functionality to hide the sidebar component by clicking the button 

@author Diana Marie Compahinay
@date 03/29/2024

Description: Fixed infinite loading error of fetch logs 

@author Rheana Mindo
@date 05/02/2024
*/
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import * as api from "../utilities/api";
import { USER_TYPES } from "../utilities/constant";

const HeaderDashboardComponent = ({onChange, sidebarState, userType}) => {

    // eslint-disable-next-line
    const [isSidebarHidden, setSidebarHidden] = useState(sidebarState);
    const [logCount, setLogCount] = useState(0);
    const [permissions, setPermissions] = useState({});

    // Update sidebar state when the prop changes
    useEffect(() => {
            setSidebarHidden(sidebarState);
            fetchLogCount(userType, setLogCount);

            const fetchPermissions = async () => {
                try {
                    const response = await api.getSwitches();
                    if (response.data.success) {
                        const perms = response.data.switches.reduce((acc, curr) => {
                            const key = `${curr.permission_name}_${curr.user_type}`;
                            acc[key] = curr.is_enabled;
                            return acc;
                        }, {});
                        setPermissions(perms);
                    } else {
                        console.error('Failed to fetch permissions');
                    }
                } catch (error) {
                    console.error('Error fetching permissions:', error);
                }
            };
    
            fetchPermissions();
    // eslint-disable-next-line
    }, []);


    // Hides the sidebar and change the icon when button is clicked
    const toggleSidebar = () => {
        setSidebarHidden(prevIsSidebarHidden => {
            const updatedIsSidebarHidden = !prevIsSidebarHidden;
            onChange(updatedIsSidebarHidden);
            return updatedIsSidebarHidden;
        });
    };



    const hasActivityLogAccess = permissions['Allow Activity Log_' + userType];

    return (
        <>
            <div className={`app-header ${sidebarState ? 'sidebar-hidden' : 'move-header'}`}>
                <nav className="navbar navbar-light navbar-expand-lg">
                    <div className="container-fluid">
                        <div className="navbar-nav left-side" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    {/* eslint-disable-next-line */}
                                    <a className="nav-link hide-sidebar-toggle-button" onClick={toggleSidebar}>
                                        <i className="material-icons">{sidebarState ? 'last_page' : 'first_page'}</i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="d-flex right-side">
                            <ul className="navbar-nav">
                                {(hasActivityLogAccess|| userType === USER_TYPES.SUPER_ADMIN) && (
                                    <li>
                                        <Link to="/dashboard/activity-log" >
                                            {/* eslint-disable-next-line */}
                                            <a
                                                className="nav-link nav-notifications-toggle log-button-container"
                                                id="notificationsDropDown"
                                                data-bs-toggle="dropdown"
                                            >
                                                <i className="material-icons log-button">notifications</i>
                                                {/* Show the number of active logs if count is greater than zero */}
                                                {logCount > 0 && (
                                                    <span className="log-count">
                                                        {logCount > 100 ? '100+' : logCount}
                                                    </span>
                                                )}
                                            </a>
                                        </Link>
                                    </li>
                                 )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};

// Functino to fetch logs from the database
const fetchLogCount = async (userType, setLogCount) => {
    try {
        // Get the logs
        if (userType === USER_TYPES.ADMIN || userType === USER_TYPES.SUPER_ADMIN) {
            const allLogs = await api.getAllLogs();
            setLogCount(allLogs.data.length);
        } else {
            const userLogs = await api.getOwnLogs();
            setLogCount(userLogs.data.length);
        }

        // Error handling
    } catch (error) {
        console.error("Error during GET request:", error);
    }
};


export default HeaderDashboardComponent;