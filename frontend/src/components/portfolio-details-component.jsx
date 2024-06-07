/* 
Description: This is a React component for the portfolio details section of the website.
It includes the room details such as name, amenities, capacity, utility worker, and rates.

@author Aljon Novelo
@date 03/20/2024
*/

// Description: Refactored file to get room from the stored state variable in the link and display the room details.
// @author Joseph Ryan Peña
// @date 05/10/2024

import React, { useState } from "react";
import RoomCarouselComponent from "./room-carousel-component";
import { useLocation } from "react-router-dom";
import * as api from '../utilities/api';
import { useEffect } from "react";

const PortfolioDetailsComponent = () => {
    const location = useLocation();
    
    // eslint-disable-next-line
    const [rooms, setRooms] = useState([]);

    const [room, setRoom] = useState({
        room_name: "",
        description: "",
        amenities: [],
        capacity: "",
        utility_worker: "",
        rate: "",
        images: [],
    });

    const fetchAllRooms = async () => {
        try {
            if(location.state === undefined || location.state === null){
                const response = await api.getRooms();
                const roomName = getRoomName();
                const data = response.data.rooms.sort((a, b) => a.room_name.localeCompare(b.room_name));
                setRooms(data);
                getCurrentRoom(data,roomName)
            }else{
                setRoom(location.state.room);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAllRooms()
        // eslint-disable-next-line
    }, [location]);

    const getCurrentRoom = (rooms,roomName) => {
        const currentRoom = rooms.find(room => room.room_name === roomName);
        setRoom(currentRoom);
    }
    

    const getRoomName = () => {
        return window.location.pathname.split("/")[2].replace(/-/g, " ")
    }


    return (
        <>
            {/* Portfolio Details Section Start */}
            <div className="room-list-content portfolio-details style2 white-bg pt-30 pb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="row pb-80 ">
                                <div className="col-xs-12 text-center">
                                    <div id="one-item" className="one-item project-image">
                                      <RoomCarouselComponent assets={room.images} alt={room.alt} />
                                    </div>
                                </div>
                            </div>
                            <div className="row room-specifics">
                                <div className="col-xs-12 col-sm-7 mobi-mb-30">
                                    <div className="project-details">
                                        <h2>{room.room_name}</h2>
                                        <p className="mb-20">
                                            {room.description}
                                        </p>
                                        <p className="mb-20">
                                            <strong>Note:</strong> Utility workers maintain the cleanliness and orderliness of the rooms. 
                                            It comes with a separate rate of Php 200 per hour for their services.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-5">
                                    <div className="project-sidebar room-details">
                                        <div className="project-info">
                                            <ul>
                                                <li>
                                                    <h5>Amenities</h5>
                                                    <p>
                                                      {room.amenities.map(amenity => (
                                                        <ul>{amenity}<br /></ul>
                                                      ))}
                                                    </p>
                                                </li>
                                                <li>
                                                    <h5>Capacity</h5>
                                                    <p>{room.capacity}</p>
                                                </li>
                                                <li>
                                                    <h5>Utility Worker</h5>
                                                    <p>{room.utility_worker}</p>
                                                </li>
                                                <li>
                                                    <h5>Rates</h5>
                                                    <p>{room.rate}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Portfolio Details Section End */}
        </>
    );
}

export default PortfolioDetailsComponent;