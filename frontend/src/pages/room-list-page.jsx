/* 
Description: This is a React component for the room list page of the website.
It includes the header, portfolio, and footer components.

@author Aljon Novelo
@date 03/20/2024
*/

import FooterComponent from '../components/footer-component';
import HeaderComponent from '../components/header-component';
import PortfolioComponent from '../components/portfolio-component';
import './App.css';
import '../Gimri.css'

const RoomListPage = () => {  
  return (
    <div className="App">
      <title>Rooms | PICSEL</title>
      <HeaderComponent />
      {/* Breadcrumbs & Page Title Start */}
      <div className="room-list-title breadcrumbs-title white-bg pt-90 pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <div className="breadcrumbs-menu">
                <h2 className="room-list-main-title">List of Rooms</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumbs & Page Title End */}
      <PortfolioComponent/>

      <FooterComponent />
    </div>
  );
}

export default RoomListPage;