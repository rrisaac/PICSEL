/* 
Description: This is a React component for the portfolio section of the website.
It includes a list of rooms with their respective images and names.

@author Aljon Novelo
@date 03/20/2024
*/

// Description: Refactored file to use constants from constant.js

// @author Rheana Mindo
// @date 04/16/2024

// Description: Refactored file to get room from backend and store them into a state variable and display them in the portfolio section of the website.
// @author Joseph Ryan Peña
// @date 05/10/2024

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../utilities/api';

const PortfolioComponent = () => {
    // List of rooms with their respective images and names
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
        <>
            {/* Portfolio Section Start */}
            <div className="room-list-content portfolio-area style-1 column-3 white-bg pt-80 pb-120 clearfix">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="portfolio-grid fitRows-grid row-arrangement">
                                {roomList.map(room => (
                                    <div className="grid-item percent-33" key={getID(room)}>
                                        <div className="single-portfolio">
                                            <Link to={`/room-list/${getID(room)}`} state={{room}}>
                                                <img src={room.images[0]} alt={room.alt} />
                                            </Link>
                                            <div className="project-title text-center">
                                                <Link to={`/room-list/${getID(room)}`} state={{room}}>
                                                    <h4>{room.room_name}</h4>
                                                </Link>
                                                <p>{room.type}</p>
                                                <p style={{textTransform:"none", marginTop:"7px"}}>{room.capacity} pax</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
            {/* Portfolio Section End */}
    </>
    );
}

export default PortfolioComponent;