/* Description: Main Dashboard page which houses helpful information after user authentication.

@author Reynaldo R. Isaac Jr.
@date 04/04/2024
*/

/*
    Description: Integrated retrieval of user_name

    @author Neil Vincent S. Alday
    @date 04/17/2024    

 */

/**
 * Description: integrated admin office availability card, upcoming events card and essential documents card.
 * @author Prince Czedrick Nepomuceno
 * @date 04/27/2024
 */

import '../Neptune.css';
import * as api from "../utilities/api";
import React, { useState, useEffect } from 'react';

import AdminOfficeAvailabilityCardComponent from './admin-office-availability-card-component';
import AdminOfficeAnnouncementCardComponent from './admin-office-announcement-card-component';
import UpcomingEventsCardComponent from './upcoming-events-card-component';
import EssentialDocumentsCardComponent from './essential-documents-card-component';

const MainDashboardComponent = () => {
    const downloadLink = document.createElement("a"); // Create hidden link element
    document.body.appendChild(downloadLink); // Append to body for accessibility
    downloadLink.style.display = "none"; // Hide the element

    const [showMainDashboard, setShowMainDashboard] = useState(false);
    const [displayName, setDisplayName] = useState('');


    const documents = [
        { id: 1, name: 'Activity Permit.pdf', size: '248kb' },
        { id: 2, name: 'Letter to CAS Template (Faculty).pdf', size: '21kb' },
        { id: 3, name: 'Reservation Form.pdf', size: '91kb' },
      ];  



    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await api.getUserInfo();
                if (user.data.user_type === 'Student Organization') {
                    const regex = /\((.*?)\)/;

                    // executing the regular expression on the input string
                    const matches = regex.exec(user.data.organization_name);

                    // if there are matches, return the string inside the parentheses (for org name)
                    if (matches && matches.length > 1) {
                        setDisplayName(', ' + matches[1]);
                    }
                } else {
                    setDisplayName(', ' + user.data.first_name);
                }
                setShowMainDashboard(true);
            } catch (error) {
                console.error('Error fetching user information: ', error);
            }
        };
        fetchUserInfo();
    }, []);



    return (
        <>
            <div>
                <div >
                    <title>Dashboard | PICSEL</title>
                    <div className="page-description">
                        <h1>Dashboard</h1>
                    </div>
                </div>
                {/* Greeting Card */}
                <div class="content-wrapper">
                    {showMainDashboard? (
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card">
                                    <img src="../../assets/images/backgrounds/icsuplb.png" class="card-img img-bigger headliner-img" alt="..." />
                                    <div class="card-img-overlay">
                                    <div class="card-body">
                                        <h1 class="card-title-bigger">Hello{displayName}</h1>
                                        <h1 class="card-text under-title"><span className='long-txt'>Ready to make a reservation?</span><span className='short-txt'>Up for reservation?</span></h1>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                        <div class="col-md-4">
                                {/* Tips List Card */}
                                <div class="card">
                                    <img src="https://lh3.googleusercontent.com/p/AF1QipNE4upWCdWH6ppwi69euTB4Fj0eX21qMY1sJn-d=s1360-w1360-h1020" class="card-img-top img-bigger" alt="..."></img>
                                    <div class="card-body">
                                      <h5 class="card-title">BOOK It! Your Key to Easy Reservations</h5>
                                      <p class="card-text">
                                        To assist you in your reservation needs, we've streamlined the process with a user-friendly system, <b>P</b>latform for <b>I</b>nstitute of <b>C</b>omputer <b>S</b>cience Scheduling, <b>E</b>vents, and <b>L</b>ogistics, or simply, <b>PICSEL</b>. Here are some tips we call <b>BOOK</b>:</p>
                                    </div>
                                    <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><b>B</b>rowse: Explore available options online via PICSEL or visit the admin office.</li>
                                    <li class="list-group-item"><b>O</b>ccupy: Choose your desired ICS room, date, and time slot based on availability.</li>
                                    <li class="list-group-item"><b>O</b>ffer Details: Confirm additional requirements through forms and letters.</li>
                                    <li class="list-group-item"><b>K</b>onfirmation: Track the progress of your reservation requests until finalized.</li>
                                    </ul>
                                </div>
                            </div>
                        <div class="col-md-4">
                                {/* Admin Office Availability Card */}
                                <AdminOfficeAvailabilityCardComponent/>
                            </div>
                            <div class="col-md-4">
                                {/* Upcoming Events Card */}
                                <UpcomingEventsCardComponent/>
                            </div>
                            <div class="col-md-8">
                                {/* Admin Office Announcement Card */}
                                <AdminOfficeAnnouncementCardComponent/>
                                {/* Essential Documents Card */}
                                <EssentialDocumentsCardComponent documents={documents} />
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

export default MainDashboardComponent;