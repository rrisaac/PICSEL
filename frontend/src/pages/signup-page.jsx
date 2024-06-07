// Description:
// The page layout includes a designated area for the app logo, a sign-in prompt, input fields for the
// the user's first, middle, and last name, email address, contact number, file picker for uploading
// display picture, password and re-enterpassword, and a 'Sign Up' button.
// Additionally, it provides an alternative sign-up option with a button for using the user's google account.

// @author Kristian Paolo P. David
// @date 03/16/2024

// Description: The component uses axios to send an http request from the backend to update the necessary information and navigates to classify after successful signup
// @author Joseph Ryan Pena
// @date 03/22/2024

// Description: Made the backend functionalities dynamic
// @author Neil Vincent S. Alday
// @date 04/04/2024

// Description: Added Google Signup functionality if user doesn't exist

// @author: Neil Vincent S. Alday
// @date: 04/20/2024

// Description:
// Added validators for email, contact number, and password. This will be reflected by a
// red text under the respective input field
// Filename of uploaded picture for Display picture will now be reflected by upload button

// @author: Kristian Paolo P. David
// @date: 04/23/2024

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
 * @description Disable sign-up page when it is actually disabled
 * @author Gacel Perfinian
 * @date 05/14/2024
 */

// Description: Added Back button

// @author: Jan Andrew Senires
// @date: 05/15/2024

import "./App.css";
import "../Neptune.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../utilities/api";
import AlertNotificationComponent from '../components/alert-notification-component';
import { PERMISSIONS } from "../utilities/constant";

const SignupPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [displayPicture, setDisplayPicture] = useState("");
  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [permissions, setPermissions] = useState({});

  const [showSignup, setShowSignup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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
            setShowSignup(true);
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

  const validateContactNumber = (number) => {
    const contactNumberRegex = /^09\d{2}-\d{3}-\d{4}$/;
    return contactNumberRegex.test(number);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const validatePassword = (pass) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least 1 uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least 1 lowercase letter.";
    if (!/\d/.test(pass)) return "Password must contain at least 1 number.";
    if (!/[!?#@$%^&*()+{};:,[\]<.>"'`/_|=~-]/.test(pass)) return "Password must contain at least 1 special character.";
    return "";
  };

  const validatePasswordMatch = (pass, reenteredPass) => {
    if (pass && reenteredPass && pass !== reenteredPass) {
      return "Passwords do not match.";
    }
    return "";
  };
  
  const isFormFilled =
    firstName &&
    lastName &&
    emailAddress &&
    contactNumber &&
    password &&
    resetPassword;

  //functions that handle changes on each input

  const handleFname = (e) => {
    setFirstName(e.target.value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setAlertMessage('');
    setAlertSuccess(false);
    setShowAlert(false);
    document.getElementById("picsel-signup").disabled = true;
    document.getElementById("gsi-signup").disabled = true;
    document.getElementById("picsel-signup").textContent = "Signing Up...";

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("middleName", middleName);
    formData.append("lastName", lastName);
    formData.append("email", emailAddress);
    formData.append("contactNumber", contactNumber);
    formData.append("password", password);
    formData.append("reEnterPassword", resetPassword);
    formData.append("image", displayPicture);

    try{
      const options = {body:formData};
      const result = await api.signUp(options);

      if (result.data.success) {
        setAlertSuccess(true);
        setAlertMessage(result.data.message);
        setShowAlert(true);
        setTimeout(() => {
          navigate('/classification', { state: { email: emailAddress } });
        }, 1000);
      } else {
        setAlertSuccess(false);
        setAlertMessage(result.data.error);
        setShowAlert(true);
        document.getElementById("picsel-signup").disabled = false;
        document.getElementById("gsi-signup").disabled = false;
        document.getElementById("picsel-signup").textContent = "Sign Up";
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      setAlertSuccess(false);
      setAlertMessage((error.response? error.response.data.message: error.toString()));
      setShowAlert(true);
      document.getElementById("picsel-signup").disabled = false;
      document.getElementById("gsi-signup").disabled = false;
      document.getElementById("picsel-signup").textContent = "Sign Up";
    }
    // axios.post(`${process.env.REACT_APP_SERVER_URL}/user/signup`, formData, {
    //     headers: {"Content-Type": "multipart/form-data"},
    // })
    // .then(response => {
    //     // Handle the response here
    //     if (response.data.success) {
    //         alert(response.data.message);
    //         navigate('/classification');
    //     } else {
    //         alert(response.data.error); // Assuming the response is JSON data
    //     } 
    // })
  };

  useEffect(() => {
    window.google?.accounts?.id?.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      use_fedcm_for_prompt: false,
      callback: handleCredentialResponse,
    });
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
        if(result.data.signup){
          setAlertSuccess(true);
          setAlertMessage(`Your account is new! Redirecting you to finish your signup process...`);
          setShowAlert(true);
          setTimeout(() => {
            navigate("/google-sign-up-classification", { state: { userId: result.data.googleId } });
          }, 1000);
        } else {
          setAlertSuccess(true);
          setAlertMessage("Account exists! Your login is successful!");
          setShowAlert(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        }
      } else {
        setAlertSuccess(false);
        setAlertMessage(result.data.message);
        setShowAlert(true);
        document.getElementById("picsel-signup").disabled = false;
        document.getElementById("gsi-signup").disabled = false;
        document.getElementById("picsel-signup").textContent = "Sign Up";
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      setAlertSuccess(false);
      setAlertMessage(error.response.data.message);
      setShowAlert(true);
      document.getElementById("picsel-signup").disabled = false;
      document.getElementById("gsi-signup").disabled = false;
      document.getElementById("picsel-signup").textContent = "Sign Up";
    }
  };

  const handleGoogleSignup = async (e) => {
    e.preventDefault();

    const g_state = document.cookie.split(';').map((x) => x.trim()).find((x) => x.startsWith('g_state='));
    if (g_state && JSON.parse(g_state.split('=')[1]).i_l) {
      document.cookie = `g_state=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }

    setAlertMessage('');
    setAlertSuccess(false);
    setShowAlert(false);

    document.getElementById("picsel-signup").disabled = true;
    document.getElementById("gsi-signup").disabled = true;
    document.getElementById("picsel-signup").textContent = "Signing Up...";

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        document.getElementById("picsel-signup").disabled = false;
        document.getElementById("gsi-signup").disabled = false;
        document.getElementById("picsel-signup").textContent = "Sign Up";
        const reason = notification.getNotDisplayedReason();
        switch (reason) {
          case 'browser_not_supported':
            setAlertSuccess(false);
            setAlertMessage("Unsupported browser detected! Please update your browser to the latest version.");
            setShowAlert(true);
            return;
          case 'suppressed_by_user':
            setAlertSuccess(false);
            setAlertMessage("Please clear your cookies for PICSEL and try signing up again, or try signing up directly if possible.");
            setShowAlert(true);
            return;
          case 'unknown_reason':
          case undefined:
            setAlertSuccess(false);
            setAlertMessage("Failed to sign up with your Google Account. Try signing up directly if possible.");
            setShowAlert(true);
            return;
          default:
            setAlertSuccess(false);
            setAlertMessage(`GSIError: not_displayed::${reason}`);
            setShowAlert(true);
            return;
        }
      } else if (notification.isSkippedMoment()) {
        document.getElementById("picsel-signup").disabled = false;
        document.getElementById("gsi-signup").disabled = false;
        document.getElementById("picsel-signup").textContent = "Sign Up";
        const reason = notification.getSkippedReason();
        switch (reason) {
          case 'user_cancel':
          case 'tap_outside':
            setAlertSuccess(false);
            setAlertMessage("Cancelled signing up with your Google Account.");
            setShowAlert(true);
            return;
          case 'auto_cancel':
            setAlertSuccess(false);
            setAlertMessage("Your attempt to sign up with your Google Account has timed out. Try again or try signing up directly.");
            setShowAlert(true);
            return;
          // If Google forced FedCM into our authentication system, handle with generic message
          case undefined:
            setAlertSuccess(false);
            setAlertMessage("Failed to sign up with your Google Account. Try to reset your cookies and site settings for PICSEL or try logging in directly if possible.");
            setShowAlert(true);
            return;
          default:
            setAlertSuccess(false);
            setAlertMessage(`GSIError: skipped::${reason}`);
            setShowAlert(true);
            return;
        }
      } else if (notification.isDismissedMoment()) {
        document.getElementById("picsel-signup").disabled = false;
        document.getElementById("gsi-signup").disabled = false;
        document.getElementById("picsel-signup").textContent = "Sign Up";
      }
    });
  };

  const handleMname = (e) => {
    setMiddleName(e.target.value);
  };

  const handleLname = (e) => {
    setLastName(e.target.value);
  };

  

  const handleContactNumberChange = (e) => {
    let value = e.target.value;
  
    // Remove any non-digit characters
    value = value.replace(/\D/g, '');
  
    // Remove excess characters beyond 11 digits
    value = value.slice(0, 13);
  
    // Insert hyphens at specific positions
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 8) {
      value = value.slice(0, 8) + '-' + value.slice(8);
    }
  
    // Trim excess characters
    value = value.slice(0, 13);
  
    setContactNumber(value);
  
    // Validate the formatted number
    if (validateContactNumber(value)) {
      setValidationErrors(prev => ({ ...prev, contactNumber: '' }));
    }
  };
  
  
  

  const handleContactNumberBlur = () => {
    if (!validateContactNumber(contactNumber)) {
      setValidationErrors(prev => ({
        ...prev,
        contactNumber: 'Expected format: 09XX-XXX-XXXX',
      }));
    } else {
      setValidationErrors(prev => ({ ...prev, contactNumber: '' }));
    }
  };


  const handleDisplayPicture = (e) => {
    const selectedFile = e.target.files[0];
    const allowedImageFormats = ['image/jpg','image/jpeg','image/png']
    if (selectedFile) {
      if(allowedImageFormats.includes(selectedFile.type)){
        if(selectedFile.size < 10240 || selectedFile.size > 5242880){
          setValidationErrors(prev => ({
            ...prev,
            displayPicture: 'Image size must be between 10 KB and 5 MB.',
          }));
        } else {
          // setDisplayPicture(URL.createObjectURL(e.target.files[0])); USE THIS FOR PIC ITSELF
          setDisplayPicture(e.target.files[0]);
          setValidationErrors(prev => ({
            ...prev,
            displayPicture: '',
          }));
        }
      } else {
        // setDisplayPicture(null); // Clear state if no file selected

        //this can be removed since the file picker is set to only upload png or jpg
        setValidationErrors(prev => ({
          ...prev,
          displayPicture: 'Invalid image format. Must be JPG or PNG.',
        }));
      }
    } 
  };

  const handleEmailAdd = (e) => {
    setEmailAddress(e.target.value);
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: '' }));
    }
  };
  const handleEmailBlur = () => {
    const error = validateEmail(emailAddress);
    setValidationErrors(prev => ({ ...prev, email: error }));
  };
  
  const handlePasswordBlur = () => {
    const error = validatePassword(password);
    const errorMatch = validatePasswordMatch(password, resetPassword);
    setValidationErrors(prev => ({ ...prev, password: error !== "" ? error : errorMatch, reenterPassword: '' }));
  };

  const handleReenterPasswordBlur = () => {
    const error = validatePasswordMatch(password, resetPassword);
    setValidationErrors(prev => ({ ...prev, reenterPassword: error }));
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <>
    {renderAlert(alertSuccess, alertMessage)}
    <div className="app app-auth-sign-up align-content-stretch d-flex flex-wrap justify-content-end">
      <title>Sign Up | PICSEL</title>
      <div className="app-auth-background"></div>
      <div className="app-signup-container">
        <div className="app-auth-container-background">

          <button className="back-button" onClick={handleBackClick}>
            <div className="back-arrow-icon"></div>
            Back
          </button>

          {(!hasSignupAccess && showSignup) && (
            <div>
              <div className="logo-placeholder"> 
                <div className="logo">
                  <a href="index.html">Neptune</a>
                </div>
              </div>
            </div>
          )}

          {(!showSignup) ? 
            (<div className="spinner-container">
              <div className="spinner" style={{width: "45px", height: "45px"}}></div>
            </div>) :
            (hasSignupAccess) ? (
              <div>
                <div className="logo-placeholder"> 
                  <div className="logo">
                  <a href="index.html">Neptune</a>
                </div>
              </div>
            {(hasLoginAccess) ? (
            <p className="auth-description m-t-xs m-b-xs">
              Already have an account? <a href="login">Log In</a>
            </p>
              ) : 
            <p className="auth-description" style={{visibility: "hidden"}}>
              *Space when login button is disabled
            </p>}
          <div className="auth-credentials m-t-xs m-b-xs">
            <div className="fields-wrapper">
              <div className="field">
                <label htmlFor="signUpFirsthandleClickName" className="form-label auth-font-label">
                  First name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="signUpFirstName"
                  placeholder="Earl"
                  value={firstName}
                  onChange={handleFname}
                />
              </div>
              <div className="field">
                <label htmlFor="signUpMiddleName" className="form-label auth-font-label">
                  Middle name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="signUpMiddleName"
                  placeholder="Samuel"
                  value={middleName}
                  onChange={handleMname}
                />
              </div>
              <div className="field">
                <label htmlFor="signUpLastName" className="form-label auth-font-label">
                  Last name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="signUpLastName"
                  placeholder="Capuchino"
                  value={lastName}
                  onChange={handleLname}
                />
              </div>
            </div>

            <label htmlFor="signUpEmail" className="form-label auth-font-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="signUpEmail"
              aria-describedby="signUpEmail"
              placeholder="escapuchino@gmail.com"
              value={emailAddress}
              onChange={handleEmailAdd}
              onBlur={handleEmailBlur}
            />
              {validationErrors.email && (
                <div className="error-message">{validationErrors.email}</div>
              )}
          </div>
          <div className="fields-wrapper">
            <div className="field">
              <label htmlFor="signUpContactNumber" className="form-label auth-font-label">
                Contact number
              </label>
              <input
                type="tel"
                className="form-control"
                id="signUpContactNumber"
                placeholder="09XX-XXX-XXXX"
                value={contactNumber}
                onChange={handleContactNumberChange}
                onBlur={handleContactNumberBlur}
              />
              {validationErrors.contactNumber && (
                <div className="error-message">{validationErrors.contactNumber}</div>
              )}
              </div>
            {/* Adjust y-pos of choose display pic button(hardcoded) */}
            <div className="field" style={{ marginTop: '24px' }}>
              <div className="upload-container-signup">
                <input
                  type="file"
                  name="file"
                  id="signUpDisplayPicture"
                  className="inputfile m-b-s room-file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleDisplayPicture}
                />
                <label htmlFor="signUpDisplayPicture" className="form-label room-form-label">
                    {displayPicture ? displayPicture.name : 'Choose Display Picture'}
                </label>

                {validationErrors.displayPicture && (
                <div className="error-message-displayPicture">{validationErrors.displayPicture}</div>
                )}
              </div>
            </div>
        </div>

        <div className="fields-wrapper">
          <div className="field">
              <label htmlFor="signUpPassword" className="form-label auth-font-label">
                Password
                <i 
                className="material-icons-outlined" 
                style={{color:"black", fontSize:"14px", marginLeft: "4px", marginTop:"-0.5px"}} 
                data-bs-toggle="tooltip" 
                data-bs-placement="top" 
                title="Password must have at least 8 characters with at least one each of the following:&#10;uppercase letter, lowercase letter, number, and special character."
                >
                  info</i>
              </label>
              <input
                type="password"
                className="form-control"
                id="signUpPassword"
                aria-describedby="signUpPassword"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
              />
              {validationErrors.password && (
                <div className="error-message">{validationErrors.password}</div>
              )}
            </div>
            <div className="field">
              <label htmlFor="signUpReEnterPassword" className="form-label auth-font-label">
                Re-enter password
              </label>
              <input
                type="password"
                className="form-control"
                id="signUpReEnterPassword"
                placeholder="••••••••"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                onBlur={handleReenterPasswordBlur}
              />
              {validationErrors.reenterPassword && (
                <div className="error-message">{validationErrors.reenterPassword}</div>
              )}
            </div>
        </div>
        <p className="auth-description m-t-xs m-b-xs" style={{marginTop: "-5px"}}>
          By signing up to create an account, you agree to the <a href="/terms-and-conditions">Terms of Use</a>, <a href="/terms-and-conditions">Data Privacy Act of 2012</a>, and <a href="/privacy-policy">Privacy Policy</a>. I hereby declare that all details entered are correct and valid.
        </p>
      <div className="auth-submit">
        <button
          id="picsel-signup"
          className={`btn btn-primary ${!isFormFilled ? "disabled" : ""}`}
          type="submit"
          disabled={!isFormFilled}
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </div>

      <div className="auth-alts m-t-xs m-b-xs">
        <div className="divider m-b-xs m-t-xs" />
        <button
          id="gsi-signup"
          className="btn btn-light w-100 d-flex align-items-center justify-content-center"
          style={{alignItems: "center"}}
          type="button"
          onClick = {handleGoogleSignup}
        >
          <img
            src="./assets/images/icons/google.png"
            alt="Google"
            style={{ marginRight: "8px", height: "20px"}}
          />
          Sign Up with Google account
        </button>
      </div>
      </div>) : (showSignup &&
        (<p className="auth-description  m-t-md m-b-md" style={{color: "red"}}>
          Important notice:
          Signing up for PICSEL is currently disabled. Please try again later.
        </p> )
      )}

    </div>
    </div>
    </div>
    </>
  );
};

export default SignupPage;