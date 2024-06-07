/**
 * @description added modals for ICS guidelines in Main Dashboard
 * @author Reynaldo Isaac Jr.
 * @date 04/27/2024
 */

import React from 'react';
import '../Neptune.css';
import { ROOM_NAMES } from '../utilities/constant';

const GuidelinesModalComponent = ({ showModal, handleClose }) => {
    

    return (
        <div className={`modal ${showModal ? 'show' : ''}`} style={{ overflow: 'hidden' }}>
          <div className="modal-backdrop fade show">
          </div>
          <div className={`modal ${showModal ? 'show' : ''}`}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content umm" style={{textAlign:"left"}}>
                <div className="modal-header">
                  <h5 className="modal-title announcement-title" id="exampleModalCenterTitle" style={{textTransform:"none"}}>
                    Guidelines on the use of ICS Lecture Halls</h5>
                  <h5 className="modal-title" id="exampleModalCenterTitle" style={{textTransform:"none", fontWeight:"normal", fontSize:"14px"}}>
                    Revised 3 October 2014</h5>
                </div>
                <div className="modal-body announcement-width"style={{paddingTop: '5px', paddingBottom: '0px', minWidth:"200px"}} >
                    <div class="card text-center" style={{height: '300px', backgroundColor:"#ebebeb"}}>
                        <div className="card-body" style={{ display:"flex", alignItems:"start", justifyContent:"start", textAlign:"justify", overflowY: 'auto'}}>
                            <ol style={{paddingLeft:"15px"}}>
                                <li className="announcement-list">ICS lecture halls refer to the {ROOM_NAMES.ICS_MEGA_HALL} (~220 seats), {ROOM_NAMES.ICS_LECTURE_HALL_3} (~110 seats) and {ROOM_NAMES.ICS_LECTURE_HALL_4} (~110 seats). Standard facilitles include air-conditioning, sound system, an LCD projector and screen, and a desktop PC running Linux.</li>
                                <li className="announcement-list">Exams of UPLB courses (including those from other institutes, e.g., IC, IMSP, INSTAT) can use these lecture halls free, except for the technician's overtime fee (currently P150/hour) beyond 7:00pm or during weekends/holidays.</li>
                                <li className="announcement-list">Outsiders will have the following standard rates:
                                    <ol type="a">
                                        <li>P825/hour for LH3 or LH4, plus the technician's overtime fee, if outside the regular working hours of the technicians </li>
                                        <li>P1,650/hour for the MH, plus the technician's overtime fee, if outside the regular working hours of the technicians </li>
                                    </ol>
                                </li>
                                <li className="announcement-list">OSA-recognized student organizations, particularly those academic organizations whose members and advisers are affiliated with ICS, may avail of a discount subject to certain conditions: 
                                    <ol type="a">
                                        <li>If the activity is non-sponsored and non-income-generating, a discount of 50% —may be given. Otherwise, the standard rates apply.</li>
                                        <li className="announcement-list">OSA points will be respected at the official OSA exchange rate.</li>
                                    </ol>
                                    <b>Note:</b> A faculty adviser will have to certify that the activity is non-sponsored and non-income-generating and he/she must be present for the entire duration of the activity. The technician's overtime fee cannot be waived nor discounted, and the OSA points cannot be used for this purpose. 
                                </li>
                                <li className="announcement-list">The LCD projectors and their bulbs are very expensive, so these should be used properly. They should be used only for actual presentations, and not merely as electronic streamers for the activity. Kindly switch the projector off when not actively used, and allow it to rest and cool off at periodic intervals (minimum of 10 minutes every hour).</li>
                                <li className="announcement-list">All garbage must be collected and disposed of properly at a secure place, away from may dogs and cats that may scatter the trash. If the schedule does not permit this, the organizers are asked to bring home their garbage bags. </li>
                                <li className="announcement-list">ICS reserves the right to deny or to prioritize the use of these lecture halls to specific to specific events/activities, taking into consideration factors such as the requesting party's affiliation with ICS, the purpose of the event, and the availability of the lecture halls. Priority will be given to events/activities organized by ICS faculty or staff, followed by those organized by recognized student organizations affiliated with ICS. Events that directly benefit ICS students, such as review sessions or guest lectures, may also be given priority.</li>
                            </ol>             
                        </div>
                    </div>
                </div>
                <div className="modal-footer" style={{paddingTop:'0px', paddingBottom:"20px"}}>
                  <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default GuidelinesModalComponent;
