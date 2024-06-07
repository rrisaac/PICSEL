import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter,RouterProvider,Navigate} from "react-router-dom";
import './index.css';
import HomeLandingPage from './pages/home-landing-page';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';
import RoomListPage from './pages/room-list-page';
import RoomsPage from './pages/rooms-page';
import ProcessPage from './pages/process-page';
import AboutPage from './pages/about-page';
import ClassificationPage from './pages/classification-page';
import GoogleSignUpClassificationPage from './pages/google-signup-classification-page';
import AccountDashboardPage from './pages/account-dashboard-page';
import AccountSettingsComponent from './components/account-settings-component';
import BookingReservationComponent from './components/booking-reservation-component';
import BookingStatusComponent from './components/booking-status-component';
import BookingRequestsComponent from './components/booking-requests-component';
import ActivityLogComponent from './components/activity-log-component';
import ErrorPage from "./pages/error-page";
import MainDashboardComponent from './components/main-dashboard-component';
import CalendarComponent from './components/calendar-component';
import ErrorComponent from './components/error-component';
import RoomsComponent from './components/rooms-component';
import ConfigurationComponent from './components/configuration-component';
import UsersComponent from './components/users-component';
import ClassSchedulesComponent from './components/class-schedules-component';
import SettingsComponent from './components/settings-component';
import BookGuestComponent from './components/booking-guest-component';
import InquireComponent from './components/inquire-component';
import TermsAndConditionsPage from './pages/terms-and-conditions-page';
import * as api from './utilities/api';
import { USER_TYPES } from './utilities/constant';
import PrivacyPolicyPage from './pages/privacy-policy-page';

/**
 * @description This is a protected route component that checks if the user's role is authorized to access the route. If the user's role is not authorized, it redirects to the forbidden page.
 * @author Pamela Joy Santos
 * @date 04/29/2024
**/
const ProtectedRoute = ({ children, roleRequired }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
          const userInfo = await api.getUserInfo();
          if (userInfo && userInfo.data) {
              setUser(userInfo.data);
              setLoading(false);
          } else {
              setUser({});
          }
      } catch (error) {
        console.error('Error fetching user information: ', error);
        setUser({});
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <div className="spinner-container" style={{height: '70vh'}}>
              <div className="spinner"></div>
          </div>;
  }

  if (!user || !roleRequired.includes(user.user_type)) {
    return <Navigate to="/dashboard/forbidden" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <AccountDashboardPage/>,
    children: [
      {
        path: "/dashboard",
        element: <MainDashboardComponent/>
      },
      {
        path: "/dashboard/account-settings",
        element: <AccountSettingsComponent/>
      },
      {
        path: "/dashboard/booking-status",
        element: (
          <ProtectedRoute roleRequired={[USER_TYPES.STUDENT, USER_TYPES.FACULTY, USER_TYPES.STUDENT_ORGANIZATION, USER_TYPES.GUEST, USER_TYPES.SUPER_ADMIN]}>
            <BookingStatusComponent />
          </ProtectedRoute>
        ),
      }, 
      {
        path: "/dashboard/booking-requests",
        element: (
          <ProtectedRoute roleRequired={[USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN]}>
            <BookingRequestsComponent />
          </ProtectedRoute>
        ),
      }, 
      {
        path: "/dashboard/book-reservation",
        element: (
          <ProtectedRoute roleRequired={[USER_TYPES.STUDENT, USER_TYPES.FACULTY, USER_TYPES.STUDENT_ORGANIZATION, USER_TYPES.SUPER_ADMIN]}>
            <BookingReservationComponent />
          </ProtectedRoute>
        ),
      }, 
      {
        path: "/dashboard/activity-log",
        element: <ActivityLogComponent/>
      },
      {
        path: "/dashboard/calendar",
        element: <CalendarComponent/>
      },
      {
        path: "/dashboard/forbidden",
        element: <ErrorComponent/>
      },
      {
        path: "/dashboard/rooms",
        element: <RoomsComponent/>
      },
      {
        path: "/dashboard/configuration",
        element: (
          <ProtectedRoute roleRequired={[USER_TYPES.SUPER_ADMIN]}>
            <ConfigurationComponent />
          </ProtectedRoute>
        ),
      },      
      {
        path: "/dashboard/users",
        element: (
          <ProtectedRoute roleRequired={[USER_TYPES.SUPER_ADMIN]}>
            <UsersComponent />
          </ProtectedRoute>
        ),
      },    
      {
        path: "/dashboard/class-schedules",
        element: (
          <ProtectedRoute roleRequired={[USER_TYPES.SUPER_ADMIN]}>
            <ClassSchedulesComponent />
          </ProtectedRoute>
        ),
      }, 
      {
        path: "/dashboard/settings",
        element: (
          <ProtectedRoute roleRequired={[USER_TYPES.SUPER_ADMIN]}>
            <SettingsComponent />
          </ProtectedRoute>
        ),
      }, 
      {
        path: "/dashboard/book-guest",
        element: (
          <ProtectedRoute roleRequired={[USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN]}>
            <BookGuestComponent />
          </ProtectedRoute>
        ),
      },   
      {
        path: "/dashboard/inquire",
        element: (
          <ProtectedRoute roleRequired={[USER_TYPES.GUEST, USER_TYPES.SUPER_ADMIN]}>
            <InquireComponent />
          </ProtectedRoute>
        ),
      },   
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/terms-and-conditions",
    element: <TermsAndConditionsPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/room-list",
    element: <RoomListPage />,
  },
  { 
    path: "/room-list/:roomId", 
    element: <RoomsPage />,
  },
  {
    path: "/process",
    element: <ProcessPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/classification",
    element: <ClassificationPage />,
  },
  {
    path: "/google-sign-up-classification",
    element: <GoogleSignUpClassificationPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

