/* 
Description: This is a React component for the header section of the website. 
It includes a logo, navigation menu with links to various pages such as rooms, 
about us, and process. It also has a login button, which navigates to login page. 

@author Diana Marie Compahinay
@date 03/16/2024
*/

import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import * as api from '../utilities/api';
import { PERMISSIONS } from "../utilities/constant";

const HeaderComponent = () => {
    const location = useLocation();
    const isRoomListActive = location.pathname.startsWith("/room-list");

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

    const hasLoginAccess = permissions[`${PERMISSIONS.ALLOW_LOGIN}_null`];
    // const hasLoginAccess = true;

    const [roomList, setRooms] = useState([]);

    const fetchAllRooms = async () => {
        try {
            const response = await api.getRooms();
            const data = response.data.rooms.sort((a, b) => {
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
            setRooms(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAllRooms()
    }, []);

    const getID = (room) => {  
        return room.room_name.replace(/ /g, "-");
    }

    return (
        <div>
            {/* Header Section Start */}
            <header className="header-style-1">
                <div className="header-top active-sticky bg-color-3">
                    <div className="container">
                        <div className="row">
                            <div className="col-6 col-xs-7 col-sm-5 col-md-3 col-lg-3">
                                <div className="left">
                                    <div className="logo">
                                        <Link to="/"><img src="../assets/img/logo.png" alt="PICSEL" /></Link>
                                    </div>
                                </div>
                            </div>
                            {/* Navigation menu */}
                            <div className="col-6 col-xs-12 col-sm-7 col-md-9 col-lg-9">
                                <div className="right">
                                    <nav className="mainmenu menu-hover-1 pull-right">
                                        <div class="navbar-header">
                                            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse" aria-expanded="false">
                                                <span class="icon-bar"></span>
                                                <span class="icon-bar"></span>
                                                <span class="icon-bar"></span>
                                            </button>
                                        </div>
                                        <div className="navbar-collapse clearfix collapse" aria-expanded="false">
                                            <ul className="navigation clearfix">
                                                <li className="dropdown">
                                                    {/* eslint-disable-next-line */}
                                                    <a className={isRoomListActive ? "active" : ""}>
                                                        <Link to="/room-list" style={{color: 'white'}}> Rooms</Link>
                                                    </a>
                                                    <ul>
                                                        {roomList.map(room => (
                                                            <li key={getID(room)}>
                                                                <Link to={`/room-list/${getID(room)}`} state={{room}}>{room.room_name}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                                {/* HOME END */}
                                                <li>
                                                    {/* eslint-disable-next-line */}
                                                    <a className={location.pathname === "/about" ? "active" : ""}>
                                                        <Link to="/about" style={{color: 'white'}}>About Us</Link>
                                                    </a>
                                                </li>
                                                <li>
                                                    {/* eslint-disable-next-line */}
                                                    <a className={location.pathname === "/process" ? "active" : ""}>
                                                        <Link to="/process" style={{color: 'white'}}>Process</Link>
                                                    </a>
                                                </li>  
                                                <Link to="/login">
                                                    <button className="btn theme-btn1 mt-15" disabled={!hasLoginAccess}> Log in </button>
                                                </Link>
                                            </ul>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="header-space bg-color-2" />
        </div>

    );
}

export default HeaderComponent;