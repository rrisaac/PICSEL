/* 

This is only a placeholder component prepared by Frontend TL Isaac

Description: This is Toggle page for the superAdmin where the access to the component can be toggled on and off.

@author Jan Andrew Señires
@date 04/22/2024
*/

/* 

Description: Added functions to get value of permission from the backend, and flip their value on click

@author Kristian Paolo David
@date 05/8/2024
*/
import React, { useState, useEffect } from 'react';
import { getSwitches, flipSwitch } from '../utilities/api';
import '../Neptune.css';

const SettingsComponent = () => {
    const [permissions, setPermissions] = useState({});

    // Fetch values of switches
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await getSwitches();
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

    // Flip the value of switch
    const handleToggle = async (permissionName, userType) => {
        // let key = permissionName
        // // If not signup/login permission, then append the user type
        // if(userType!='Users'){
        //     key = `${permissionName}_${userType}`;
        // }

        const key = `${permissionName}_${userType}`;

        const currentStatus = permissions[key];
    
        console.log(`Toggling ${key}: currently ${currentStatus}`);

        const payload = {
            user_type: userType,
            permission_name: permissionName
        };
    
        console.log(`Frontend payload:`, payload);

        try {
            const response = await flipSwitch(payload);

            console.log('Response from server:', response);
    
            if (response.data && response.data.success) {
                console.log('Update successful:', response.data.message);
                setPermissions(prev => ({
                    ...prev,
                    [key]: !currentStatus
                }));
            } else {
                console.error('Failed to update the permission:', response.data ? response.data.message : "No response data");
                // Optionally, you might want to reset the UI to reflect that the change did not persist
                // setPermissions(prev => ({ ...prev })); // re-render without changes if needed
            }
        } catch (error) {
            console.error('Error toggling permission:', error);
            // Show an error message to the user, e.g., using a toast notification or a modal
        }
    };
    

    // Render the toggle switches
    const renderSwitch = (permissionName, userType) => {
        // let key = permissionName
        // // If not signup/login permission, then append the user type
        // if(userType!='Users'){
        //     key = `${permissionName}_${userType}`;
        // }

        const key = `${permissionName}_${userType}`;

        // Limit the user type to 11 characters(Done to change 'Student Organization' to 'Student Org')
        const truncatedUserType = userType.slice(0, 11);
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                <label className="switch" style={{ marginRight: "10px" }}>
                    <input type="checkbox"
                        checked={permissions[key]}
                        onChange={() => handleToggle(permissionName, userType)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <span className="slider round"></span>
                </label>
                <h5 className="card-users">{userType !== 'null' ? truncatedUserType: permissionName}</h5>
            </div>
        );
    };


    return (
        <>
            <div>
                <div >
                    <title>Settings | PICSEL</title>
                    <div className="page-description">
                        <h1>Settings</h1>
                    </div>
                </div>
                <div className="white-rectangle" style={{ paddingTop:"40px" }}>
                    <div class="container-component">
                        <div class="col-md-3">
                            {/* Account Settings */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Account Settings</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                            <div className="card-left-column">
                                                {renderSwitch('Allow Account Settings', 'Admin')}
                                                {renderSwitch('Allow Account Settings', 'Student')}
                                                {renderSwitch('Allow Account Settings', 'Guest')}
                                            </div>
                                            <div className="card-right-column">
                                                {renderSwitch('Allow Account Settings', 'Faculty')}
                                                {renderSwitch('Allow Account Settings', 'Student Organization')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Book Reservation */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Book Reservation</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                            <div className="card-right-column">
                                                {renderSwitch('Allow Book Reservation', 'Student')}
                                                {renderSwitch('Allow Book Reservation', 'Faculty')}
                                                {renderSwitch('Allow Book Reservation', 'Student Organization')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Dashboard */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Dashboard</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                        <div className="card-left-column">
                                                {renderSwitch('Allow Dashboard', 'Admin')}
                                                {renderSwitch('Allow Dashboard', 'Student')}
                                                {renderSwitch('Allow Dashboard', 'Guest')}
                                            </div>
                                            <div className="card-right-column">
                                                {renderSwitch('Allow Dashboard', 'Faculty')}
                                                {renderSwitch('Allow Dashboard', 'Student Organization')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div class="col-md-3">
                            {/* Activity Log */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Activity log</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                        <div className="card-left-column">
                                                {renderSwitch('Allow Activity Log', 'Admin')}
                                                {renderSwitch('Allow Activity Log', 'Student')}
                                                {renderSwitch('Allow Activity Log', 'Guest')}
                                            </div>
                                            <div className="card-right-column">
                                                {renderSwitch('Allow Activity Log', 'Faculty')}
                                                {renderSwitch('Allow Activity Log', 'Student Organization')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Booking Status */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Booking Status</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                        <div className="card-left-column">
                                                {renderSwitch('Allow Booking Status', 'Student')}
                                                {renderSwitch('Allow Booking Status', 'Guest')}
                                            </div>
                                            <div className="card-right-column">
                                                {renderSwitch('Allow Booking Status', 'Faculty')}
                                                {renderSwitch('Allow Booking Status', 'Student Organization')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Inquire Reservation */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Inquire Reservation</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                            <div className="card-left-column">
                                                {renderSwitch('Allow Inquire Reservation', 'Admin')}
                                                {renderSwitch('Allow Inquire Reservation', 'Guest')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div class="col-md-3">
                            
                            {/* Rooms */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Rooms</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                            <div className="card-left-column">
                                                {renderSwitch('Allow Rooms', 'Admin')}
                                                {renderSwitch('Allow Rooms', 'Student')}
                                                {renderSwitch('Allow Rooms', 'Guest')}
                                            </div>
                                            <div className="card-right-column">
                                                {renderSwitch('Allow Rooms', 'Faculty')}
                                                {renderSwitch('Allow Rooms', 'Student Organization')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Booking Requests */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Booking Requests</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                            <div className="card-left-column">
                                                {renderSwitch('Allow Booking Request', 'Admin')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Login */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Login</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                            <div className="card-left-column">
                                                {/* Change userType to 'Users' */}
                                                {renderSwitch('Allow Login', 'null')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>
                        <div class="col-md-3">
                            {/* Calendar */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Calendar</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                            <div className="card-left-column">
                                                {renderSwitch('Allow Calendar', 'Admin')}
                                                {renderSwitch('Allow Calendar', 'Student')}
                                                {renderSwitch('Allow Calendar', 'Guest')}
                                            </div>
                                            <div className="card-right-column">
                                                {renderSwitch('Allow Calendar', 'Faculty')}
                                                {renderSwitch('Allow Calendar', 'Student Organization')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Book Guest */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Book Guest</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                            <div className="card-left-column">
                                                {renderSwitch('Allow Book Guest', 'Admin')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Signup */}
                            <div class="card setting-button">
                                <div className="example-content">
                                    <div className="card-body setting-body setting-card">
                                        <h5 className="card-component-title">Sign Up</h5>
                                        <hr style={{ borderTop: "3px solid #bbb" }} />
                                        <div className="card-component">
                                            <div className="card-left-column">
                                                {/* Change userType to 'Users' */}
                                                {renderSwitch('Allow Signup', 'null')}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default SettingsComponent;