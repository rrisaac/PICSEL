/*
  Description: A calendar for checking finalized booking reservations and classes per room.
  For the successor devs of this module, only finalized booking requests should be displayed
  in Monthly View, while finalized booking requests + class scheds, are displayed in time weekly
  view. 

  @author Reynaldo Isaac Jr.
  @date 04/08/2024

  References:
  https://fullcalendar.io/docs/event-model - an event will be displayed using these attributes in Full Calendar
  https://fullcalendar.io/docs - Full Calendar Documentation
*/

/*
  Description: Updated for responsiveness in mobile devices and make it dynamic. By clicking a room button, 
  the calendar will change the state of events according to room schedule 

  @author Diana Marie Compahinay
  @date 04/21/2024
*/

/*
  Description: Separated the viewed schedule for monthly view and weekly view.
  In the monthly view, only the finalized schedule will be shown in the calendar while 
  both of the class schedule and finalized schedule will be rendered on weekly view.

  @author Diana Marie Compahinay
  @date 05/05/2024
*/

import '../Neptune.css';
import * as api from "../utilities/api";
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'


const CalendarComponent = () => {             
    const [showCalendar, setShowCalendar] = useState(false);
    const [showMainCalendar, setShowMainCalendar] = useState(true);
    const [roomNames, setRoomNames] = useState([]);
    const [roomIds, setRoomIds] = useState({});
    const [classSched, setClassSched] = useState([]);
    const [finalizedSched, setFinalizedSched] = useState([]);
    const [roomSched, setRoomSched] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null); 
    const [currentView, setCurrentView] = useState('dayGridMonth'); 

    const handleRoomChange = async (room) => {
        setActiveRoom(room);
    
        // fetch finalized and class schedule
        try {
            setShowMainCalendar(false);
            const finalized_scheds = await api.getRoomFinalizedRequests(room);
            const finalized_sched_data = finalized_scheds.data.requests;
            finalized_sched_data.forEach(sched => {
                sched['color'] = '#009688';
                sched['textColor'] = '#ffffff';
            });
            setFinalizedSched(finalized_sched_data);

            const class_sched_data = [];
            try {    
                const room_scheds = await api.getRoomSchedules(roomIds[room]);
                (room_scheds.data.schedules).forEach(sched => {
                    let class_sched = {
                        title: `${sched.course_code} ${sched.section}`,
                        startTime: sched.class_start_time,
                        endTime: sched.class_end_time,
                        daysOfWeek: getDayNumber(sched.days_of_week)
                    }
                    class_sched_data.push(class_sched);
                });
                
                setClassSched(class_sched_data);
                setShowMainCalendar(true);
            } catch (error) {
                console.error('Error fetching class room schedule: ', error);
                setShowMainCalendar(false);
            }

            // combine class and finalized schedules based on the current view
            const combinedSched = (currentView === 'timeGridWeek') ? class_sched_data.concat(finalized_sched_data) : finalized_sched_data;
            setRoomSched(combinedSched);
        } catch (error) {
            console.error('Error fetching finalized schedule: ', error);
            setShowMainCalendar(false);
        }
    };
    
    const handleViewChange = (viewInfo) => {
        const currentView = viewInfo.view.type;

        // switch event source based on the current view
        if (currentView === 'timeGridWeek') {
            const class_and_finalized = classSched.concat(finalizedSched);
            setRoomSched(class_and_finalized);
            setCurrentView('timeGridWeek');
        } else {
            setRoomSched(finalizedSched);
            setCurrentView('dayGridMonth');
        }
    };

    const getDayNumber = (days) => {
        const day_number_map = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 7
        };

        // loop through the list of day strings and map each day to its number
        return days.map(day => {
            let lower_day_str = day.toLowerCase();
            if (lower_day_str in day_number_map) { // return the day's corresponding number
                return day_number_map[lower_day_str];
            } else {
                return null;
            }
        });
    };

    useEffect(() => {
        const fetchRoomsList = async () => {
            try {
                const get_rooms = await api.getRooms();
                
                // Map to get only necessary room data and retain the original structure for easier sorting
                const rooms = get_rooms.data.rooms.map(room => ({
                    room_name: room.room_name,
                    room_id: room.room_id,
                    room_type: room.room_type
                }));
                
                // Create a map of room IDs indexed by room names for quick lookup
                const room_ids = rooms.reduce((acc, room) => {
                    acc[room.room_name] = room.room_id;
                    return acc;
                }, {});
    
                // Set room IDs state
                setRoomIds(room_ids);
                
                // Sort rooms first by room_type, then by room_name alphabetically
                const sorted_rooms = rooms.sort((a, b) => {
                    let typeCompare = a.room_type.localeCompare(b.room_type);
                    if (typeCompare !== 0) return typeCompare;
                    return a.room_name.localeCompare(b.room_name);
                }).map(room => room.room_name);  // Extract sorted room names
                
                // Set room names state
                setRoomNames(sorted_rooms);
    
                setShowCalendar(true);
            } catch (error) {
                console.error('Error fetching room lists: ', error);
            }
        };
    
        fetchRoomsList();
    }, []);    

    return (
        <>
            <div>
                <div >
                    <title>Calendar | PICSEL</title>
                    <div className="page-description">
                        <h1>Calendar</h1>
                    </div>
                </div>
                <div className="white-rectangle" style={{ 
                    borderRadius: 15, 
                    marginLeft: 0,
                    marginRight: 8, 
                    }}>
                    {showCalendar? (
                    <div className="widget-stats-container d-flex" style={{flexGrow: 1, paddingTop: 20, overflow: 'hidden'}}>
                        <div className="widget-stats-content flex-fill" style={{ width: '100%' }}>
                            <div class="content-wrapper">
                                <div class="container-fluid">
                                    <div className="status-filter-container booking-info-container">
                                        <div className="rooms-filter">
                                            <div className="todo-menu">
                                                <div className='room-title'>
                                                    <h5 className="todo-menu-title">Rooms</h5>
                                                </div>
                                                <ul className="list-unstyled todo-status-filter">
                                                {/* The room filter is rendered here*/}
                                                {roomNames.map((item) => (
                                                    // eslint-disable-next-line
                                                    <li><a href="#" onClick={() => handleRoomChange(item)} 
                                                        className={item === activeRoom ? 'active' : ''}>{item}</a></li> 
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="calendar-container">
                                            <div>
                                                {showMainCalendar? (
                                                <div class="card-body">
                                                    {/* The FullCalendar component is rendered here. Attributes in regard to the calendar display is listed here*/}
                                                    <FullCalendar
                                                        plugins={[dayGridPlugin, timeGridPlugin]}
                                                        initialView={currentView}
                                                        weekends={true}
                                                        events={roomSched} 
                                                        eventContent={renderEventContent}
                                                        headerToolbar={{
                                                            left: 'prev,next today',
                                                            center: 'title',
                                                            right: 'dayGridMonth,timeGridWeek'
                                                        }}
                                                        slotMinTime={'07:00:00'}
                                                        slotMaxTime={'22:00:00'}
                                                        dayMaxEventRows={true} // shows the max number of events within a given day, the rest will show up in a popover
                                                        views={{
                                                            timeGrid: {
                                                                dayMaxEventRows: 2 
                                                            }
                                                        }}
                                                        viewDidMount={handleViewChange}
                                                        height={currentView === 'dayGridMonth' ? '' : 'auto'}
                                                    />
                                                </div>
                                                ) : <div className="spinner-container" style={{height: "80vh"}}>
                                                        <div className="spinner"></div>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    
    // a custom render function
    function renderEventContent(eventInfo) {
        return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
        )
    }

export default CalendarComponent;