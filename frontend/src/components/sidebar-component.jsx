/* 
Description: Sidebar component for the account dashboard featuring user profile, 
navigation menu for Dashboard, Booking Status, Reservation, and Request sections, 
along with a logout button.

@author Diana Marie Compahinay
@date 03/23/2024
*/

/* 
Description: Implemented the logout functionality for frontend

@author Rainier John P. Pendon
@date 04/08/2024
*/

/* 
Description: Retrieve user info and toggle booking request and booking status
based on certain user type.

@author Kristian Paolo P. David
@date 04/16/2024
*/

/* 
Description: Improved the appearance of the Sidebar by emphasizing 
the active navigation menu item upon selection.

@author Diana Marie Compahinay
@date 04/05/2024
*/

import React, {useState, useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import * as api from "../utilities/api";
import { USER_TYPES } from '../utilities/constant';
import { useNavigate } from 'react-router-dom';

const SidebarComponent = ({isSidebarHidden, userType, userName, userImage}) => {
    const location = useLocation();

    const navigate = useNavigate();
    const [loggedOut, setLoggedOut] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [isSubMenuHovered, setIsSubMenuHovered] = useState(false);
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
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
    }, []);

    const handleSubMenuEnter = () => {
        setIsSubMenuOpen(true);
        setIsSubMenuHovered(true);
    };

    const handleSubMenuLeave = () => {
        setIsSubMenuHovered(false);
    };

    const handleLogout = async (e) => {
        try {
            const res = await api.logOut();
            console.log(res.data.message);
            setLoggedOut(true);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    if (loggedOut) {
        navigate('/');
        return null;
    }

    

    const toggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };

    const hasAccountSettings = permissions['Allow Account Settings_' + userType];
    const hasBookReservationAccess = permissions[`Allow Book Reservation_${userType}`];
    const hasDashboardAccess = permissions['Allow Dashboard_' + userType];

    // Activity Log is found in header
    const hasBookingStatusAccess = permissions[`Allow Booking Status_${userType}`];
    const hasInquireReservation = permissions['Allow Inquire Reservation_' + userType];

    const hasRoomsAccess = permissions['Allow Rooms_' + userType];
    const hasBookingRequestAccess = permissions['Allow Booking Request_' + userType];
    
    const hasCalendarAccess = permissions['Allow Calendar_' + userType];
    const hasBookGuestAccess = permissions['Allow Book Guest_' + userType];

    return (
        <div>
            {/* This element would only display when sidebar is hidden */}
            <div className={`app-sidebar1 ${isSidebarHidden ? '' : 'sidebar-hidden'}`}>
            {isSidebarHidden && (
                    <div className="logo1 sidebar-hidden">
                        <div className="sidebar-user-switcher">
                            {hasAccountSettings ? (
                                <Link to="/dashboard/account-settings">
                                    <img src={userImage}  className="display-pic-sidebar" alt="User Profile"/>
                                    <div className="user-info-text">
                                        <div className="username-text"> {userName} </div>
                                        <div className="user-state-info">{userType}</div>
                                    </div>
                                </Link>
                            ) : (
                                // If account settings is disable for this user type, this is not clickable
                                <div>
                                    <img src={userImage} alt="User Profile"/>
                                    <div className="user-info-text">
                                        <div className="username-text"> {userName} </div>
                                        <div className="user-state-info">{userType}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
            )}
            </div>
            <div className={`app-sidebar ${isSidebarHidden ? 'sidebar-hidden' : ''}`}>
                <div className="logo">
                    <div className="sidebar-user-switcher">
                        <Link to="/dashboard/account-settings">
                            <img src={userImage} className="display-pic-sidebar" alt="User Profile"/>
                            <div className="user-info-text">
                                <div className="username-text"> {userName} </div>
                                <div className="user-state-info">{userType}</div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="app-menu">
                    <ul className="accordion-menu">
                        <li className="sidebar-title">Menu</li>
                        
                        {/* Dashboard User Privileges: All Users */}
                        {(hasDashboardAccess|| userType === USER_TYPES.SUPER_ADMIN) && (
                        <>
                            {/* Dashboard Feature Tab - Default Tab*/}
                            <li className={`list-item-sidebar ${location.pathname === "/dashboard" ? "active-page" : ""}`}>
                                <Link to="/dashboard" className="active">
                                    <span className="dashboard-icon"></span> Dashboard
                                </Link>
                            </li>
                        </>
                        )}

                        {/* Booking Request User Privileges: Admin and SuperAdmin */}
                        {(hasBookingRequestAccess|| userType === USER_TYPES.SUPER_ADMIN) && (
                            <>
                                {/* Booking Requests Feature Tab */}
                                <li className={`list-item-sidebar ${location.pathname === "/dashboard/booking-requests" ? "active-page" : ""}`}>
                                    <Link to="/dashboard/booking-requests" className="active">
                                        <span className="confirmation-number-icon"></span> Booking Requests
                                    </Link>
                                </li>
                            </>
                        )}

                        {/*Booking Status User Privileges: Student, Faculty, Student Org, Guest, and SuperAdmin */}
                        {(hasBookingStatusAccess|| userType === USER_TYPES.SUPER_ADMIN) && (
                            <>
                                {/* Booking Status Feature Tab */}
                                <li className={`list-item-sidebar ${location.pathname === "/dashboard/booking-status" ? "active-page" : ""}`}>
                                    <Link to="/dashboard/booking-status" className="active">
                                        <span className="rule-icon"></span> Booking Status
                                    </Link>
                                </li>
                            </>
                        )}

                        {/*Book Reservation User Privileges: Student, Faculty, and Student Org */}
                        {(hasBookReservationAccess|| userType === USER_TYPES.SUPER_ADMIN) && (
                            <>
                                {/* Book Reservation Feature Tab */}
                                <li className={`list-item-sidebar ${location.pathname === "/dashboard/book-reservation" ? "active-page" : ""}`}>
                                    <Link to="/dashboard/book-reservation" className="active">
                                        <span className="calendar-add-on-icon"></span> Book Reservation
                                    </Link>
                                </li>
                            </>
                        )}

                        {/*Book Guest User Privileges: Admin, and SuperAdmin */}
                        {(hasBookGuestAccess|| userType === USER_TYPES.SUPER_ADMIN) && (
                            <>
                                {/* Book Guest Feature Tab */}
                                <li className={`list-item-sidebar ${location.pathname === "/dashboard/book-guest" ? "active-page" : ""}`}>
                                    <Link to="/dashboard/book-guest" className="active">
                                        <span className="book-guest-icon"></span> Book Guest
                                    </Link>
                                </li>
                            </>
                        )}

                        {/*Inquire Reservation User Privileges: Guest, and SuperAdmin */}
                        {(hasInquireReservation|| userType === USER_TYPES.SUPER_ADMIN) && (
                            <>
                                {/* Inquire Reservation Feature Tab */}
                                <li className={`list-item-sidebar ${location.pathname === "/dashboard/inquire" ? "active-page" : ""}`}>
                                    <Link to="/dashboard/inquire" className="active">
                                        <span className="inquire-icon"></span> Inquire Reservation
                                    </Link>
                                </li> 
                            </> 
                        )}
                        
                        {/*Calendar User Privileges: All Users */}
                        {(hasCalendarAccess|| userType === USER_TYPES.SUPER_ADMIN) && (
                        <>
                            {/* Calendar Feature Tab */}
                            <li className={`list-item-sidebar ${location.pathname === "/dashboard/calendar" ? "active-page" : ""}`}>
                                <Link to="/dashboard/calendar" className="active">
                                    <span className="event-available-icon"></span> Calendar
                                </Link>
                            </li>
                        </>
                        )}

                        {/*Rooms User Privileges: All Users */}
                        {(hasRoomsAccess && userType !== USER_TYPES.SUPER_ADMIN) && (
                            <>
                                {/* Rooms Feature Tab */}
                                <li className={`list-item-sidebar ${location.pathname === "/dashboard/rooms" ? "active-page" : ""}`}>
                                    <Link to="/dashboard/rooms" className="active">
                                        <span className="meeting-room-icon"></span> Rooms
                                    </Link>
                                </li>
                            </>
                        )}
                        
                        {/*Configuration User Privileges: SuperAdmin */}
                        {(userType === USER_TYPES.SUPER_ADMIN) && (
                            <>
                                {/* Configurations Feature Tab */}                 
                                <li className={`list-item-sidebar ${
                                    location.pathname === "/dashboard/configuration" ? "active-page" : "" ||
                                    location.pathname === "/dashboard/rooms" ? "active-page" : "" ||
                                    location.pathname === "/dashboard/class-schedules" ? "active-page" : "" ||
                                    location.pathname === "/dashboard/users" ? "active-page" : "" ||
                                    location.pathname === "/dashboard/settings" ? "active-page" : "" ||
                                    isSubMenuHovered ? "active-page" : ""
                                    }`}>
                                    <Link to="/dashboard/configuration" className="custom-link">
                                        <span className="configuration-icon"></span>Configuration
                                        <i
                                        className="material-icons has-sub-menu"
                                        onClick={toggleSubMenu}
                                        style={{ cursor: "pointer", transform: isSubMenuOpen ? "rotate(90deg)" : "none" }}
                                        >
                                        keyboard_arrow_right
                                        </i>
                                    </Link>
                                {isSubMenuOpen && (
                                    <ul className={"sub-menu"} onMouseEnter={handleSubMenuEnter} onMouseLeave={handleSubMenuLeave}>
                                    <li>
                                        <Link to="/dashboard/rooms" className={`custom-link ${location.pathname === "/dashboard/rooms" ? "active" : ""}`}>
                                            Rooms
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/class-schedules" className={`custom-link ${location.pathname === "/dashboard/class-schedules" ? "active" : ""}`}>
                                            Class Schedules
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/users" className={`custom-link ${location.pathname === "/dashboard/users" ? "active" : ""}`}>
                                            Users
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/settings" className={`custom-link ${location.pathname === "/dashboard/settings" ? "active" : ""}`}>
                                            Settings
                                        </Link>
                                    </li>
                                    </ul>
                                )}
                                </li>
                            </>
                        )}
                        <>
                            <li>
                                <div className="buffer">
                                    <p>buffer</p>
                                </div>
                            </li> 
                        </>
                        <>
                            {/* Log out */} 
                            <li className="list-item-sidebar bottom-position">
                                <Link to="/" onClick={handleLogout} className="active">
                                    <span className="logout-icon"></span> Logout
                                </Link>
                            </li>
                        </> 
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SidebarComponent;