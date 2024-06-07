/* 
Description: This is a React component for the room page of the website.
It includes the header, portfolio details, and footer components.
It also includes a useParams hook to get the roomId from the URL.

@author Aljon Novelo
@date 03/20/2024
*/

// Description: Refactored file to use constants from constant.js

// @author Rheana Mindo
// @date 04/16/2024

import { ROOM_NAMES } from '../utilities/constant';
import FooterComponent from '../components/footer-component';
import HeaderComponent from '../components/header-component';
import PortfolioDetailsComponent from '../components/portfolio-details-component';
import { useParams } from 'react-router-dom';
import '../Gimri.css'

const RoomsPage = () => {
  // List of rooms with their respective names
  const roomList = {
    'ics-mega-hall': ROOM_NAMES.ICS_MEGA_HALL, 
    'lecture-hall-3': ROOM_NAMES.ICS_LECTURE_HALL_3,
    'lecture-hall-4': ROOM_NAMES.ICS_LECTURE_HALL_4,
    'c100': ROOM_NAMES.PC_LAB_C100,
    'pc-lab-1': ROOM_NAMES.PC_LAB_1,
    'pc-lab-2': ROOM_NAMES.PC_LAB_2,
    'pc-lab-3': ROOM_NAMES.PC_LAB_3,
    'pc-lab-4': ROOM_NAMES.PC_LAB_4,
    'pc-lab-5': ROOM_NAMES.PC_LAB_5,
    'pc-lab-6': ROOM_NAMES.PC_LAB_6,
    'pc-lab-7': ROOM_NAMES.PC_LAB_7,
    'pc-lab-8': ROOM_NAMES.PC_LAB_8,
    'pc-lab-9': ROOM_NAMES.PC_LAB_9,
  };

  // Get the roomId from the URL
  const { roomId } = useParams();
  return (
    <div className="App">
      <title>{roomList[roomId]} | PICSEL</title>
      <HeaderComponent />
      {/* Breadcrumbs & Page Title Start */}
      <div className="room-list-title breadcrumbs-title white-bg pt-90 pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <div className="breadcrumbs-menu">
                <h2>{roomList[roomId]}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PortfolioDetailsComponent roomId = {roomId}/>
      <FooterComponent />
    </div>
  );
}

export default RoomsPage;