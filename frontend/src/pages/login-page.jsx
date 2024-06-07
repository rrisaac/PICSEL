// Description: This React component render the login page
// The page layout includes a designated area for the app logo, a sign-up prompt, input fields for the
// user's email and password, a 'Forgot password?' link, and a 'Sign In' button.
// Additionally, it provides an alternative sign-in option with a 'Login with your Google account' button.

// @author Kristian David
// @date 03/16/2024

// Description: added login functionality

// @author Jet Timothy V. Cerezo
// @date 03/31/2024

// Description: Made the backend functionalities dynamic

// @author Neil Vincent S. Alday
// @date 04/06/2024

// Description: Added Google login functionality

// @author Jet Timothy V. Cerezo
// @date 04/09/2024

// Description: Added Google Signup functionality if user doesn't exist

// @author: Neil Vincent S. Alday
// @date: 04/20/2024

// Description: changed username to identifier for login

// @author: Jet Timothy V. Cerezo
// @date: 04/27/2024

// Description: Added error alerts for login

// @author: Jet Timothy V. Cerezo
// @date: 05/01/2024

/**
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/08/2024
 * 
 * @description Added loading indicator
 * @author Gacel Perfinian
 * @date 05/10/2024
 * 
 * @description Implemented unified loading indicator
 * @author Gacel Perfinian
 * @date 05/14/2024
 * 
 * @description Disabled log-in button when username and password
 * do not satisfy constraints
 * @author Gacel Perfinian
 * @date 05/14/2024
 * 
 * @description Added information if login is restricted to super admin
 * @author Gacel Perfinian
 * @date 05/14/2024
 */

// Description: Added Back button

// @author: Jan Andrew Senires
// @date: 05/15/2024

// Description: Added spacing between back button and logo

// @author: Jan Andrew Senires
// @date: 05/16/2024

import React, { useState, useEffect } from "react";
import "./App.css";
import "../Neptune.css";
import { useNavigate } from "react-router-dom";
import * as api from "../utilities/api";
import AlertNotificationComponent from '../components/alert-notification-component';
import { PERMISSIONS } from "../utilities/constant";

const LoginPage = () => {
  const [identifier, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.getSwitches();
        if (response.data.success) {
          const perms = response.data.switches.reduce((acc, curr) => {
            const key = `${curr.permission_name}_${curr.user_type}`;
            acc[key] = curr.is_enabled;
            return acc;
          }, {});
          setPermissions(perms);
          setShowLogin(true);
        } else {
          console.error('Failed to fetch permissions');
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);


  const hasLoginAccess = permissions[`${PERMISSIONS.ALLOW_LOGIN}_null`];
  const hasSignupAccess = permissions[`${PERMISSIONS.ALLOW_SIGNUP}_null`];


  const renderAlert = (success, message) => {
    if (showAlert) {
      return (
        <AlertNotificationComponent
          success={success}
          message={message}
        />
      );
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setAlertMessage('');
    setAlertSuccess(false);
    setShowAlert(false);
    document.getElementById("picsel-login").disabled = true;
    if (document.getElementById("gsi-login")) document.getElementById("gsi-login").disabled = true;
    document.getElementById("picsel-login").textContent = "Logging In...";

    try {
      const logInDetails = {
        identifier: identifier,
        password: password
      }

      const options = { body: logInDetails };
      const result = await api.logIn(options);

      if (result.data.success) {
        setAlertSuccess(true);
        setAlertMessage('Login successful!');
        setShowAlert(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else if (logInDetails.identifier === "" || logInDetails.password === "") {
        setAlertSuccess(false);
        setAlertMessage("Please fill out all fields.");
        setShowAlert(true);
        document.getElementById("picsel-login").disabled = false;
        document.getElementById("picsel-login").textContent = "Log In";
      } else {
        setAlertSuccess(false);
        setAlertMessage(result.data.message);
        setShowAlert(true);
        document.getElementById("picsel-login").disabled = false;
        if (document.getElementById("gsi-login")) document.getElementById("gsi-login").disabled = false;
        document.getElementById("picsel-login").textContent = "Log In";
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      setAlertSuccess(false);
      setAlertMessage((error.response ? error.response.data.message : error.toString()));
      setShowAlert(true);
      document.getElementById("picsel-login").disabled = false;
      if (document.getElementById("gsi-login")) document.getElementById("gsi-login").disabled = false;
      document.getElementById("picsel-login").textContent = "Log In";
    }
  };

  useEffect(() => {
    window.google?.accounts?.id?.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      use_fedcm_for_prompt: false,
      callback: handleCredentialResponse,
    });

    const fetchData = async () => {
      try {
        const res = await api.logInGetter();
        if (res.data.isLoggedIn) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error during GET request:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line 
  }, [navigate]);

  const handleCredentialResponse = async (response) => {
    setAlertMessage('');
    setAlertSuccess(false);
    setShowAlert(false);

    const options = { body: { token: response.credential } };
    const result = await api.googleVerify(options);

    try {
      if (result.data.success) {
        if (result.data.signup) {
          setAlertSuccess(true);
          setAlertMessage(`Your account is new! Redirecting you to finish your signup process...`);
          setShowAlert(true);
          setTimeout(() => {
            navigate("/google-sign-up-classification", { state: { userId: result.data.googleId } });
          }, 1000);
        } else {
          setAlertSuccess(true);
          setAlertMessage("Login successful!");
          setShowAlert(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      setAlertSuccess(false);
      setAlertMessage(error.response.data.message);
      setShowAlert(true);
      document.getElementById("picsel-login").disabled = false;
      if (document.getElementById("gsi-login")) document.getElementById("gsi-login").disabled = false;
      document.getElementById("picsel-login").textContent = "Log In";
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();

    const g_state = document.cookie.split(';').map((x) => x.trim()).find((x) => x.startsWith('g_state='));
    if (g_state && JSON.parse(g_state.split('=')[1]).i_l) {
      document.cookie = `g_state=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }

    setAlertMessage('');
    setAlertSuccess(false);
    setShowAlert(false);

    document.getElementById("picsel-login").disabled = true;
    if (document.getElementById("gsi-login")) document.getElementById("gsi-login").disabled = true;
    document.getElementById("picsel-login").textContent = "Logging In...";

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        document.getElementById("picsel-login").disabled = false;
        if (document.getElementById("gsi-login")) document.getElementById("gsi-login").disabled = false;
        document.getElementById("picsel-login").textContent = "Log In";
        const reason = notification.getNotDisplayedReason();
        switch (reason) {
          case 'browser_not_supported':
            setAlertSuccess(false);
            setAlertMessage("Unsupported browser detected! Please update your browser to the latest version.");
            setShowAlert(true);
            return;
          case 'suppressed_by_user':
            setAlertSuccess(false);
            setAlertMessage("Your attempt to log in with your Google Account has timed out. Try again or try logging in directly if possible.");
            setShowAlert(true);
            return;
          case 'unknown_reason':
          case undefined:
            setAlertSuccess(false);
            setAlertMessage("Failed to log in with your Google Account. Try logging in directly if possible.");
            setShowAlert(true);
            return;
          default:
            setAlertSuccess(false);
            setAlertMessage(`Please enable third party cookies to log in with Google.`);
            setShowAlert(true);
            return;
        }
      } else if (notification.isSkippedMoment()) {
        document.getElementById("picsel-login").disabled = false;
        if (document.getElementById("gsi-login")) document.getElementById("gsi-login").disabled = false;
        document.getElementById("picsel-login").textContent = "Log In";
        const reason = notification.getSkippedReason();
        switch (reason) {
          case 'user_cancel':
          case 'tap_outside':
            setAlertSuccess(false);
            setAlertMessage("Cancelled logging in with your Google Account.");
            setShowAlert(true);
            return;
          case 'auto_cancel':
            setAlertSuccess(false);
            setAlertMessage("Your attempt to log in with your Google Account has timed out. Try again or try logging in directly if possible.");
            setShowAlert(true);
            return;
          // If Google forced FedCM into our authentication system, handle with generic message
          case undefined:
            setAlertSuccess(false);
            setAlertMessage("Failed to log in with your Google Account. Try to reset your cookies and site settings for PICSEL or try logging in directly if possible.");
            setShowAlert(true);
            return;
          default:
            setAlertSuccess(false);
            setAlertMessage(`GSIError: skipped::${reason}`);
            setShowAlert(true);
            return;
        }
      } else if (notification.isDismissedMoment()) {
        document.getElementById("picsel-login").disabled = false;
        if (document.getElementById("gsi-login")) document.getElementById("gsi-login").disabled = false;
        document.getElementById("picsel-login").textContent = "Log In";
      }
    });
  };

  const handleBackClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (identifier.trim() && password.length >= 8) {
          handleLogin(event);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [identifier, password]);

  return (
    <>
      {renderAlert(alertSuccess, alertMessage)}
      <div className="app app-auth-sign-in align-content-stretch d-flex flex-wrap justify-content-end">
        <title>Log In | PICSEL</title>
        <div className="app-auth-background"></div>
        <div className="app-login-container">
          <div className="app-auth-container-background">

          <button className="back-button" onClick={handleBackClick}>
          <div className="back-arrow-icon"></div>
            Back
          </button>
          <div className="logo-placeholder"> 
            <div className="logo"></div>
          </div>
          {(!hasLoginAccess && showLogin) && (
          <p className="auth-description  m-t-md m-b-md" style={{color: "red"}}>
            Important notice:
            Logging in to PICSEL is currently restricted. Please try again later.
            If you have the appropriate maintenance credentials, try logging in below.
          </p> 
          )}
          {(!showLogin) && (
          <p className="auth-description m-t-md m-b-md" style={{visibility: "hidden"}}>
              *Space when loading
          </p>
          )}
          {(hasSignupAccess && showLogin) ? (
          <p className="auth-description  m-t-md m-b-md">
            Don't have an account? <a href="signup">Sign Up</a>
          </p>
          ) : (hasLoginAccess && 
          <p className="auth-description" style={{visibility: "hidden"}}>
             *Space when signup button is disabled
          </p>
          )}
          <div className="auth-credentials ">
            <label
              htmlFor="signUpUsername"
              className="form-label  m-t-xxs m-b-xxs auth-font-label"
            >
              Username or Email
            </label>
            <input
              type="text"
              className="form-control"
              id="signUpUsername"
              aria-describedby="signUpUsername"
              placeholder=""
              value={identifier}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label
              htmlFor="signInPassword"
              className="form-label  m-t-xxs auth-font-label"
            >
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="signInPassword"
              aria-describedby="signInPassword"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br></br>
          </div>
          <div className="auth-submit ">
            <button 
              id="picsel-login"
              className="btn btn-primary m-b-xxs"
              onClick={handleLogin}
              disabled={!(identifier.trim() && password.length >= 8 && hasLoginAccess)}
            >
              Log In
            </button>
          </div>
          {hasLoginAccess && (<>
          <div className="divider  m-t-xxs m-b-xxs" />
          <div className="auth-alts">
            <button
              id="gsi-login"
              className="btn btn-light w-100 d-flex align-items-center justify-content-center  m-t-xxs m-b-xxs"
              style={{alignItems: "center"}}
              type="button"
              onClick = {handleGoogleLogin}
            >
              <img
                src="./assets/images/icons/google.png"
                alt="Google"
                style={{ marginRight: "8px", height: "20px"}}
              />
              Log in with Google account
            </button>
          </div>
          </>)}
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;