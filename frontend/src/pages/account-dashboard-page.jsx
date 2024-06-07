/* Description: Page component for account dashboards

@author Prince Czedrick Nepomuceno
@date 03/23/2024

Description: Automatically hide sidebar menu when window size is reduced 

@author Diana Marie Compahinay
@date 04/12/2024

Description: Listen to server-side events and respond to them 

@author Rheana Mindo
@date 04/20/2024

Description: Implemented SSEs on the deployed server

@author Rheana Mindo
@date 05/02/2024
*/
  
import "./App.css";
import "../Neptune.css";
import SidebarComponent from "../components/sidebar-component";
import HeaderDashboardComponent from "../components/header-dashboard-component";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import * as api from "../utilities/api";
import { USER_TYPES } from '../utilities/constant';


// // GET
export const executeOpenGetRequest = (url) => {
  return axios.get(url, {headers: {"Access-Control-Allow-Origin": "*"}, withCredentials:true});
}

// // GET Login
// export const logInGetter = () => {
//   const url = '${getBaseUrl()}/user/session';
//   return requestBuilder.executeOpenGetRequest(url);
// }

// Description: This function handles the login form submission

// @author Jet Timothy V. Cerezo
// @date 04/03/2024
const AccountDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const initialUserInfo = {
    user_type: USER_TYPES.SUPER_ADMIN,
    username: '',
    display_picture: 'https://i.pinimg.com/originals/68/3d/8f/683d8f58c98a715130b1251a9d59d1b9.jpg',
  };

  const [userInfo, setUserInfo] = useState(initialUserInfo);

  const handleSidebarChange = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  useEffect(() => {
    // axios.get("http://localhost:3000/user/session", { withCredentials: true })
    //   .then((response) => {
    //     if (!response.data.isLoggedIn) {
    //       navigate("/login");
    //     }
    //     })
    //   .catch((error) => {
    //     console.error("Error during GET request:", error);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
    const fetchData = async () => {
      try {
        const response = await api.logInGetter();
        if (!response.data.isLoggedIn) {
          navigate("/login");
        } else {
          const user = await api.getUserInfo();
          setUserInfo(user.data);
          
        }
      } catch (error) {
        navigate("/login");
        console.error("Error during GET request:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const handleResize = () => {
      if (window.innerWidth <= 1296) {
        if (!isSidebarHidden) handleSidebarChange();  // hide sidebar menu when opened
      }
    };

    // add event listener for window resize
    window.addEventListener('resize', handleResize);

    handleResize();

    // listen to SSEs 
    const eventSource = new EventSource(`${process.env.REACT_APP_SERVER_URL}/events`, { withCredentials: true });
    
    eventSource.onopen = () => {
      console.log('SSE connection established');
    };
    
    eventSource.onmessage = (event) => {
      console.log('Message from server:', event.data);

      // temporary solution: automatically reload the page when the database has changes
      /* eslint-disable no-restricted-globals */
      location.reload();
      /* eslint-enable no-restricted-globals */

    };
    
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };
    // cleanup event listener
    return () => {
      eventSource.close();
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, [navigate]);


    if (isLoading) {
      return <div className="spinner-container" style={{height: '100vh'}}>
                <div className="spinner"></div>
            </div>
    }

    return (
      <div>
        <div className="app align-content-stretch d-flex flex-wrap">
          <SidebarComponent isSidebarHidden={isSidebarHidden} 
          userType={userInfo.user_type}
          userName={userInfo.username}
          userImage={userInfo.display_picture}
          />
          <div
            className={`app-container ${isSidebarHidden ? "sidebar-hidden" : ""}`}
          >
            <div className="search">
              <form>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Type here..."
                  aria-label="Search"
                />
              </form>
              {/* eslint-disable-next-line */}
              <a href="#" className="toggle-search">
                <i className="material-icons">close</i>
              </a>
            </div>
            <HeaderDashboardComponent onChange={handleSidebarChange} sidebarState={isSidebarHidden} userType={userInfo.user_type} />
            {/* Start of App Content */}
            <div className="app-content">
              <div className="content-wrapper">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-4">
                      <div className="card-body">
                        
                              {/* This is where the nested routes appear */}
                              <Outlet />
                  
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


export default AccountDashboardPage;