
/* Description: This component is the Rooms page where Rooms CRUD and checking of room schedules can be done.

@author Reynaldo R. Isaac Jr.
@date 04/18/2024
*/

/**
 * @description Displays the fetched rooms from the database and renders the room cards.
 * @author Aira Nicole Natividad
 * @date 04/22/2024
 */

/**
 * @description Integrated the create, edit, and delete rooms. 
 * @author Pamela Joy Santos
 * @date 04/22/2024
**/

/**
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

import '../Neptune.css';
import '../utilities/constant';
import React, { useState, useEffect } from 'react';
import ClassSchedulesModalComponent from './class-schedule-modal-component';
import RoomsModalComponent from './rooms-modal-component';
import AccountDashboardModalComponent from './account-dashboard-modal-component';
import * as api from "../utilities/api";
import { USER_TYPES } from '../utilities/constant';
import AlertNotificationComponent from './alert-notification-component';

const sortRooms = (rooms) => {
    // Sort rooms by room_type first and then alphabetically by room_name
    return rooms.sort((a, b) => {
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
}

const RoomsComponent = () => {
    const [showRooms, setShowRooms] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [userInfo, setUserInfo] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);
      
            return () => clearTimeout(timer);
        }

        fetchRooms(); 
        fetchUserInfo();
    }, [showAlert]);

    const fetchRooms = async () => {    
        try {
            const result = await api.getRooms();
            if (result.data && result.data.success) {
                const sortedRooms = sortRooms(result.data.rooms);
                setRooms(sortedRooms);
                setShowRooms(true);
            }
        } catch (error) {
            console.error("Error during fetchRooms:", error.message);
            return;
        }
    };

    const fetchUserInfo = async () => {
        try {
            const user = await api.getUserInfo();
            if (user && user.data) {
                setUserInfo(user.data);
            } else {
                setUserInfo({});
            }
        } catch (error) {
            console.error('Error fetching user information: ', error);
            setUserInfo({});
        }
    };

    const handleDeleteRoom = async (roomId) => {
        setRooms(rooms.filter(room => room.room_id !== roomId));
    }

    const handleEditRoom = async (roomId, updatedRoomData) => {
        const sortedRooms = sortRooms(rooms.map(room => {
            if (room.room_id === roomId) {
                return { ...room, ...updatedRoomData };
            } else {
                return room;
            }
        }));
        setRooms(sortedRooms);
    }

    const handleAddRoom = async (newRoomData) => {
        const sortedRooms = sortRooms([...rooms, newRoomData]);
        setRooms(sortedRooms);
    }

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
                    <title>Rooms | PICSEL</title>
                    <div className="page-description">
                        <h1>Rooms</h1>
                    </div>
                </div>
                {/* Greeting Card */}
                <div class="content-wrapper">
                    {showRooms? (
                    <div class="container">
                        <div class="row">
                            {
                                rooms.map((room, i) => 
                                    <RoomInstanceComponent key={room.room_id} room={room} rooms={rooms} onAddRoom={handleAddRoom} onEditRoom={handleEditRoom} onDeleteRoom={handleDeleteRoom} userInfo={userInfo} handleShowAlert={handleShowAlert}/>
                                )
                            }
                            {/* Toggle this Add Button - Only when a user is a superadmin can have access to this */}
                            {userInfo && userInfo.user_type === USER_TYPES.SUPER_ADMIN && (
                                <AddRoomComponent rooms={rooms} onAddRoom={handleAddRoom}/>
                            )}
                        </div>
                    </div>
                    ) : <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>}
                </div>
            </div>
        </>
    );
}

// This renders an instance component card of room
const RoomInstanceComponent = ({ room, rooms, onEditRoom, onDeleteRoom, userInfo, handleShowAlert }) => {
    const [activeTab, setActiveTab] = useState('General');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % room.images.length);
      };
    
      const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
        );
      };

    return (
        <>
           <div class="col-md-4">
                {/* Room instance Cards */}
                <div class="card">
                    
                    <div className="room-carousel-container">
                    <img
                        src={room.images.length > 0 ? room.images[currentImageIndex] : "https://lh3.googleusercontent.com/p/AF1QipNE4upWCdWH6ppwi69euTB4Fj0eX21qMY1sJn-d=s1360-w1360-h1020"}
                        className="card-img-top img-bigger room-img"
                        alt="Room"
                    />
                    {room.images.length > 1 && (
                        <div className="carousel-buttons">
                        <button onClick={prevImage} className="prev-btn" style={{ color: 'white' }}>
                            {/* <i className="fa fa-chevron-left"></i> */}
                            <i className="material-icons">arrow_back_ios</i>
                        </button>
                        <button onClick={nextImage} className="next-btn" style={{ color: 'white' }}>
                            {/* <i className="fa fa-chevron-right"></i> */}
                            <i className="material-icons">arrow_forward_ios</i>
                        </button>
                        </div>
                    )}

                    <div className="example-content">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item nav-room" role="presentation">
                                <button className={`nav-link clear ${activeTab === 'General' ? 'active' : ''}`} onClick={() => setActiveTab('General')}>General</button>
                            </li>
                            <li className="nav-item nav-room" role="presentation">
                                <button className={`nav-link clear ${activeTab === 'Properties' ? 'active' : ''}`} onClick={() => setActiveTab('Properties')}>Properties</button>
                            </li>
                            {/* Toggle this Actions Button - Only when a user is a superadmin can have access to this tab */}
                            {userInfo && userInfo.user_type === USER_TYPES.SUPER_ADMIN && (
                                <li className="nav-item nav-room" role="presentation">
                                    <button className={`nav-link clear ${activeTab === 'Actions' ? 'active' : ''}`} onClick={() => setActiveTab('Actions')}>Actions</button>
                                </li>
                            )}
                        </ul>
                        <div className="card-body" style={{height: '180px'}}>
                            <h5 className="card-title">{room.room_name} | {room.room_type}</h5>
                            <RoomInfoComponent activeTab={activeTab} room={room} rooms={rooms} onEditRoom={onEditRoom} onDeleteRoom={onDeleteRoom} handleShowAlert={handleShowAlert}/>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// This houses the information of the room inside the instance
const RoomInfoComponent = ({ activeTab, room, rooms, onEditRoom, onDeleteRoom, handleShowAlert }) => {
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showEditRoomModal, setShowEditRoomModal] = useState(false);
    const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false);

    const handleCheckScheduleButtonClick = () => {
        setShowScheduleModal(true); // Open the modal
    };

    const handleEditRoomButtonClick = () => {
        setShowEditRoomModal(true); // Open the modal
    };

    const handleDeleteRoomClick = () => {
        setShowDeleteRoomModal(true); 
    };

    const handleDeleteRoom = async (password) => {
        try {
            const data = { password: password, roomName: room.room_name};
            const options = { body: data };
            const result = await api.deleteRoom(options, room.room_id);
            if (result.data.success) {
                handleShowAlert(true, result.data.message);
                setTimeout(() => {
                    onDeleteRoom(room.room_id);
                }, 5000);
            }
        } catch (error) {
            handleShowAlert(false, error.response.data.message);
            console.error('Error deleting room: ', error);
        }
    }

    const handleEditRoom = (updatedRoomData) => {
        onEditRoom(room.room_id, updatedRoomData);
    }

    const renderModal = (onConfirm, showModal, setShowModal, action, room) => {
        if (showModal && action === "Check Schedule") {
            return (
                <ClassSchedulesModalComponent
                    showModal={showModal}
                    handleClose={() => setShowModal(false)}
                    onConfirm={onConfirm}
                    room={room}
                />
            );
        } else if (showModal && action === "Edit Room") {
            return (
                <RoomsModalComponent
                    showModal={showModal}
                    handleClose={() => setShowModal(false)}
                    onConfirm={handleEditRoom}
                    action={"Edit"}
                    initialData={room}
                    rooms={rooms}
                />
            )
        } else if (showModal && action === "Delete Room") {
            return (
                <AccountDashboardModalComponent
                    showModal={showModal}
                    handleClose={() => setShowModal(false)}
                    value={action.toLowerCase()}
                    onConfirm={handleDeleteRoom}
                />
            );
        }
        return null;
    };

    return (
        <>
        {/* General Tab */}
        {activeTab === 'General' && (
            <div>  
                <ul>
                    <li className='room-li'><p>Utility Worker: {room.utility_worker}</p></li>
                    <li className='room-li'><p>Capacity: {room.capacity} pax</p></li>
                    <li className='room-li'><p>Rate: P{room.rate} per hour</p></li>
                </ul>
            </div>
        )}
        {/* Properties Tab */}
        {activeTab === 'Properties' && (
            <div>  
            <ul>
                {room.amenities.length > 1 ? (
                    <li className='room-li'>
                        <p style={{ lineHeight: '30px' }}>
                            Amenities: {room.amenities.slice(0, -1).join(", ")}{room.amenities.length > 2 ? "," : ""} and {room.amenities.slice(-1)}
                        </p>
                    </li>
                ) : (
                    <li className='room-li'>
                        <p style={{ lineHeight: '30px' }}>
                            Amenity: {room.amenities[0]}
                        </p>
                    </li>
                )}
            </ul>
        </div>
        )}
        {/* Actions Tab */}
        {activeTab === 'Actions' && (
            <div className="room-action-buttons">
                <div className="room-btn-group">
                    <button className="btn btn-gray btn-primary btn-dashboard room-btn" onClick={handleEditRoomButtonClick}>Edit Room</button>
                    {renderModal(handleEditRoomButtonClick, showEditRoomModal, setShowEditRoomModal, "Edit Room",room)}
                    <button className="btn btn-red btn-primary btn-dashboard room-btn" onClick={handleDeleteRoomClick}>Delete Room</button>
                    {renderModal(handleDeleteRoomClick, showDeleteRoomModal, setShowDeleteRoomModal, "Delete Room")}
                </div>
                <div className="room-btn-single">
                    <button className="btn btn-primary btn-dashboard room-btn" style={{ width: "100%" }} onClick={handleCheckScheduleButtonClick}>Check Schedule</button>
                    {renderModal(handleCheckScheduleButtonClick, showScheduleModal, setShowScheduleModal, "Check Schedule", room)}
                </div>
            </div>
        )}
        </>
    );
}

// This renders an instance component card of room
const AddRoomComponent = ({ rooms, onAddRoom }) => {
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);

    const handleCheckAddButtonClick = () => {
        setShowAddRoomModal(true); // Open the modal
    };

    const handleAddRoom = async (newRoomData) => {
        onAddRoom(newRoomData);
    };

    const renderModal = (onConfirm, showModal, setShowModal) => {
        if (showModal) {
            return (
                <RoomsModalComponent
                    showModal={showModal}
                    handleClose={() => setShowModal(false)}
                    onConfirm={handleAddRoom}
                    action={"Add"}
                    rooms={rooms}
                />
            );
        }
        return null;
    };

    return (
        <>
           <div class="col-md-4">
                {/* Room instance Cards */}
                <div class="card align-center">
                    <div className="card-body " style={{minHeight: '428px', alignContent: 'center', justifyContent:'center'}}>
                        <i class="material-icons" style={{display: "flex", justifyContent:'center', fontSize:"100px"}} onClick={handleCheckAddButtonClick}>add</i>
                        {renderModal(handleCheckAddButtonClick, showAddRoomModal, setShowAddRoomModal)}
                    </div>
                </div>
            </div>
        </>
    );
}

export default RoomsComponent;