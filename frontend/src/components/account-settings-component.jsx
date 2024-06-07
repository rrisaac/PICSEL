/* 
    Description: This component serves as a user interface element enabling users to access and manage their profile details, 
    providing functionalities for both viewing and modifying the information stored within their profiles.

    @author Pamela Joy Santos
    @date 03/28/2024
*/

// Description: Refactored file to use constants from constant.js

// @author Rheana Mindo
// @date 04/16/2024

/**
 * @description Refactored to use customized alert and fixed a bug in file handling
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

// Description: Changed the text in the password hover info when editing account settings

// @author: Jan Andrew Senires
// @date: 05/16/2024

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AccountDashboardModalComponent from './account-dashboard-modal-component';
import AlertNotificationComponent from './alert-notification-component';
import * as api from "../utilities/api";
import { USER_TYPES } from '../utilities/constant';
import '../Neptune.css';

const AccountSettingsComponent = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [image, setImage]=useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleUpdateButtonClick = () => {
        setShowUpdateModal(true); 
    };

    const handleDeactivateButtonClick = () => {
        setShowDeactivateModal(true); 
    };

    const renderModal = (value, onConfirm, showModal, setShowModal) => {
        if (showModal) {
            return (
                <AccountDashboardModalComponent
                    showModal={showModal}
                    handleClose={() => setShowModal(false)}
                    value={value}
                    onConfirm={onConfirm}
                    
                />
            );
        }
        return null;
    };

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
    
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await api.getUserInfo();
                if (user && user.data) {
                    setUserInfo(user.data);
                } else {
                    setUserInfo({});  // Set default empty object if no user info is found
                }
            } catch (error) {
                console.error('Error fetching user information: ', error);
                setUserInfo({});
            }
        };

        fetchUserInfo();
    }, []);

    const [updatedUserInfo, setUpdatedUserInfo] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        username: "",
        contact_number: "",
        display_picture: "",
        password: "",
    });

    useEffect(() => {
        if (userInfo) {
            setUpdatedUserInfo({
                first_name: userInfo ? userInfo.first_name : "",
                middle_name: userInfo ? userInfo.middle_name : "",
                last_name: userInfo ? userInfo.last_name : "",
                username: userInfo ? userInfo.username : "",
                contact_number: userInfo ? userInfo.contact_number : "",
                display_picture: userInfo ? userInfo.display_picture : "",
                password: "Password123!",
            });
        }
    }, [userInfo]);

    const [reenteredPassword, setReenteredPassword] = useState("");
    const [editable, setEditable] = useState(false);

    const handleSettingsClick = () => {
        setEditable(true);
        setUpdatedUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            password: "",
        }));
    };

    const handleCancelClick = () => {
        setUpdatedUserInfo({
            first_name: userInfo.first_name,
            middle_name: userInfo.middle_name,
            last_name: userInfo.last_name,
            username: userInfo.username,
            contact_number: userInfo.contact_number,
            display_picture: userInfo.display_picture,
            password: "Password123!",
        });
        setReenteredPassword("");
        setErrorMessage("");
        setImage(null);
        setEditable(false);
    };

    const handleDeactivateUser = async () => {
        setShowDeactivateModal(false);
        try {
            const result = await api.deleteUserInfo(userInfo.user_id);
            if (result.data.success) {
                setAlertSuccess(true);
                setAlertMessage(result.data.message);
                setShowAlert(true);
                setEditable(false);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setAlertSuccess(true);
                setAlertMessage(result.data.message);
                setShowAlert(true);
                setEditable(false);
            }
        } catch (error) {
            console.error('Error deactivating user account: ', error);
            setAlertSuccess(false);
            setAlertMessage(error.response.data.message);
            setShowAlert(true);
        }
    };

    const handleUpdateUserInfo = async () => {
        setShowUpdateModal(false);
        setAlertSuccess(false);
        setAlertMessage('');
        setShowAlert(false);

        const formData = new FormData();
        formData.append("first_name", updatedUserInfo.first_name);
        formData.append("middle_name", updatedUserInfo.middle_name);
        formData.append("last_name", updatedUserInfo.last_name);
        formData.append("username", updatedUserInfo.username);
        formData.append("contact_number", updatedUserInfo.contact_number);
        formData.append("password", updatedUserInfo.password);

        if (image !== null) {
            formData.append("image", image);
        }

        try {
            const options = {body:formData};
            const result = await api.updateUserInfo(options, userInfo.user_id);
            if (result.data.success) {
                setAlertSuccess(true);
                setAlertMessage(result.data.message);
                setShowAlert(true);

                setEditable(false);
                setReenteredPassword("");
                setUserInfo(prevUserInfo => ({
                    ...prevUserInfo,
                    ...updatedUserInfo
                }));
            } else {
                setAlertSuccess(false);
                setAlertMessage(result.data.message);
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error updating user information: ', error);
            setAlertSuccess(false);
            setAlertMessage(error.response.data.message);
            setShowAlert(true);
        }
    };

    const getClassificationLabel = () => {
        switch (userInfo.user_type) {
            case USER_TYPES.STUDENT:
                return "Student Number";
            case USER_TYPES.FACULTY:
                return "Institute/Department";
            case USER_TYPES.STUDENT_ORGANIZATION:
                return "Organization Name";
            default:
                return "";
        }
    };

    const getUserClassification = () => {
        switch (userInfo.user_type) {
            case USER_TYPES.STUDENT:
                return userInfo.student_number;
            case USER_TYPES.FACULTY:
                return userInfo.department;
            case USER_TYPES.STUDENT_ORGANIZATION:
                return userInfo.organization_name;
            default:
                return false;
        }
    };

    const emptyFields = () => {
        for (const key in updatedUserInfo) {
            if (updatedUserInfo.hasOwnProperty(key) && key !== 'middle_name' && updatedUserInfo[key] === '') {
                return true;
            }
        }
        if (reenteredPassword === '') {
            return true;
        }
        return false;
    }

    const validatePassword = () => {
        if (updatedUserInfo.password.length > 0) {
            if (updatedUserInfo.password.length < 8) return "Password must be at least 8 characters long.";
            if (!/[A-Z]/.test(updatedUserInfo.password)) return "Password must contain at least 1 uppercase letter.";
            if (!/[a-z]/.test(updatedUserInfo.password)) return "Password must contain at least 1 lowercase letter.";
            if (!/\d/.test(updatedUserInfo.password)) return "Password must contain at least 1 number.";
            if (!/[!?#@$%^&*()+{};:,[\]<.>"'`/_|=~-]/.test(updatedUserInfo.password)) return "Password must contain at least 1 special character.";
        }
        return true;
    }

    const validateReenterPassword = () => {
        const passwordMatches = updatedUserInfo.password === reenteredPassword;
        if (reenteredPassword.length > 0 && updatedUserInfo.password.length > 0) {
            if (!passwordMatches) {
                return "Passwords do not match.";
            }
        }
        return true;
    }

    const validateContactNumber = () => {
        const contactNumberRegex = /^09\d{2}-\d{3}-\d{4}$/;
        if (!contactNumberRegex.test(updatedUserInfo.contact_number)) {
            return false;
        }
        return true;
    }

    const [errorMessage, setErrorMessage] = useState("");
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setImage(selectedFile);

        const allowedImageFormats = ['image/jpg', 'image/jpeg', 'image/png'];
        if (selectedFile) {
            if (allowedImageFormats.includes(selectedFile.type)) {
                if (selectedFile.size < 10240 || selectedFile.size > 5242880) {
                    setErrorMessage("Image size must be between 10 KB and 5 MB.");
                } else {
                    const reader = new FileReader();
                    
                    reader.onloadend = () => {
                        setUpdatedUserInfo(prevUserInfo => ({
                            ...prevUserInfo,
                            display_picture: reader.result 
                        }));
                        setErrorMessage(""); // Clear existing error messages
                    };
                
                    // File Read Error
                    reader.onerror = (error) => {
                        console.error('Error: ', error);
                        setErrorMessage("An error occurred while reading the file.");
                    };
                    
                    // Read the file as a Data URL (base64 string)
                    reader.readAsDataURL(selectedFile);
                }
            } else {
                setErrorMessage("Invalid image format. Must be JPG or PNG.");
            }
        }
    };

    const capitalize = (str) => {
        if (!str) return ''; //Check if str doesn't exist(User might not have a middle name)
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };
        

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
              
        if (phoneNumber.length < 5) return phoneNumber;
        if (phoneNumber.length < 8) {
          return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4)}`;
        }
        return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 11)}`;
    };    

    const handleContactNumberChange = (e) => {
        const rawNumber = e.target.value.replace(/-/g, '');
        const formattedPhoneNumber = formatPhoneNumber(rawNumber);
        setUpdatedUserInfo({ ...updatedUserInfo, contact_number: formattedPhoneNumber });
    };

    if (!userInfo) {
        return (
            <div>
                <title>Account Settings | PICSEL</title>
                <div className="page-description">
                    <h1>Account Settings</h1>
                </div>
                <div className="white-rectangle" style={{borderRadius: 15, marginLeft: 0, marginRight: 8}}>
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {renderAlert(alertSuccess, alertMessage)}
            <div>
                <title>Account Settings | PICSEL</title>

                <div className="page-description">
                    <h1>Account Settings</h1>
                </div>
                <div className="white-rectangle" style={{
                    borderRadius: 15,
                    marginLeft: 0,
                    marginRight: 8,
                }}>
                    <div className="widget-stats-container d-flex" style={{ flexGrow: 1, padding: 20, overflow: 'hidden' }}>
                        <div className="widget-stats-content flex-fill" >
                            <div>
                                <div className="account-container">
                                    <div className="display-pic-container">
                                        {/* Display Picture */}
                                        <div className="display-pic">
                                            <img src={updatedUserInfo.display_picture} alt='User Profile'/>
                                        </div>
                                        {editable && (
                                            <div className="display-pic-input">
                                                <input type="file" name="file" id="signUpDisplayPicture" className="inputfile m-b-s" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
                                                <label htmlFor="signUpDisplayPicture" className="form-label">{image ? image.name : "Choose Display Picture"}</label>
                                            </div>
                                        )}
                                    </div>
                                    <div className="user-info">
                                        {/* User Type, User ID */}
                                        <div class="row-info">
                                            <div>
                                                <div class="col-md-6">
                                                    <label for="settingsUserId" class="form-label">User ID</label>
                                                    <input type="text" class="account-form-control" id="settingsUserId" value={userInfo ? userInfo.user_id : "User ID"} disabled />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="col-md-6">
                                                    <label for="settingsUserType" class="form-label">User Type</label>
                                                    <input type="text" class="account-form-control" id="settingsUserType" value={userInfo ? userInfo.user_type : "User Type"} disabled />
                                                </div>
                                            </div>
                                        </div>
                                        {/* First Name, Middle Name, Last Name */}
                                        <div class="row-info">
                                            <div>
                                                <div class="col-md-6">
                                                    <label for="settingsFirstName" class="form-label">First Name</label>
                                                    <input type="text" class="account-form-control" id="settingsFirstName" value={capitalize(updatedUserInfo.first_name)} disabled={!editable} onChange={(e) => setUpdatedUserInfo({ ...updatedUserInfo, first_name: capitalize(e.target.value) })} />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="col-md-6">
                                                    <label for="settingsMiddleName" class="form-label">Middle Name</label>
                                                    <input type="text" class="account-form-control" id="settingsMiddleName" value={capitalize(updatedUserInfo.middle_name)} disabled={!editable} onChange={(e) => setUpdatedUserInfo({ ...updatedUserInfo, middle_name: capitalize(e.target.value) })} />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="col-md-6">
                                                    <label for="settingsLastName" class="form-label">Last Name</label>
                                                    <input type="text" class="account-form-control" id="settingsLastName" value={capitalize(updatedUserInfo.last_name)} disabled={!editable} onChange={(e) => setUpdatedUserInfo({ ...updatedUserInfo, last_name: capitalize(e.target.value) })} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* User Name */}
                                        <div className="row-info">
                                            <div>
                                                <div class="col-md-6">
                                                    <label for="settingsInputUserName" class="form-label">Username</label>
                                                    <input type="text" class="account-form-control" id="settingsInputUserName" value={updatedUserInfo.username} disabled={!editable} onChange={(e) => setUpdatedUserInfo({ ...updatedUserInfo, username: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="line-break" />
                                <div className="account-container">
                                    <div className="user-info">
                                        {/* Email Address, Password */}
                                        <div className="row-info">
                                            <div>
                                                <div class="col-md-6">
                                                    <label for="settingsEmailAddress" class="form-label">Email Address</label>
                                                    <input type="text" class="account-form-control input-width" id="settingsEmailAddress" value={userInfo ? userInfo.email : "Email"} disabled />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="col-md-6">
                                                    <label for="settingsInputPassword" class="form-label">
                                                        Password
                                                        {editable && (
                                                            <i className="material-icons-outlined" style={{color:"black", fontSize:"14px", marginLeft: "4px", marginTop:"-0.5px"}} data-bs-toggle="tooltip" data-bs-placement="top" title="If you want to change your password, enter your new password here and in re-enter password.&#10;Otherwise, enter your existing password.&#10;Password must have at least 8 characters with at least one each of the following:&#10;uppercase letter, lowercase letter, number, and special character.">info</i>
                                                        )}
                                                    </label>
                                                    <input type="password" class="account-form-control input-width" id="settingsInputPassword" value={updatedUserInfo.password} disabled={!editable} onChange={(e) => setUpdatedUserInfo({ ...updatedUserInfo, password: e.target.value })} />
                                                    {editable && validatePassword() !== true && (
                                                        <div className="error-message account-settings-error">{validatePassword()}</div>
                                                    )}
                                                </div>
                                            </div>
                                            {editable && (
                                                <div>
                                                    <div class="col-md-6">
                                                        <label for="settingsReenterPassword" class="form-label">Re-enter Password</label>
                                                        <input type="password" class="account-form-control" id="settingsReenterPassword" value={reenteredPassword} disabled={!editable} onChange={(e) => setReenteredPassword(e.target.value)} />
                                                        {editable && validateReenterPassword() !== true && (
                                                            <div className="error-message account-settings-error">{validateReenterPassword()}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* Classification Attribute, Contact Number */}
                                        <div className="row-info">
                                            {getUserClassification() && (
                                                <div>
                                                    <div className="col-md-6">
                                                        <label for="settingsClassificationAttribute" className="form-label">{userInfo ? getClassificationLabel() : "Classification Attribute"}</label>
                                                        <input type="text" className="account-form-control input-width" id="settingsClassificationAttribute" value={userInfo ? getUserClassification() : "Classification Attribute"} disabled />
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <div class="col-md-6">
                                                    <label for="settingsInputContactNumber" class="form-label">Contact Number</label>
                                                    <input type="tel" class="account-form-control input-width" id="settingsInputContactNumber" value={updatedUserInfo.contact_number} disabled={!editable} onChange={handleContactNumberChange} />
                                                    {editable && !validateContactNumber() && (
                                                        <div className="error-message account-settings-error">Invalid contact number format. Must be in the format 09XX-XXX-XXXX.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {!editable && (
                                            <div className="account-settings-icon">
                                                <button className="material-icons settings" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={handleSettingsClick}>settings</button>
                                            </div>
                                        )}
                                        {errorMessage && <div className="validation-message">{errorMessage}</div>}
                                        {editable && (
                                            <div className="buttons">
                                                <button type="button" class="btn btn-dark" onClick={handleDeactivateButtonClick}>Deactivate</button>
                                                {renderModal('deactivate account', handleDeactivateUser, showDeactivateModal, setShowDeactivateModal)}
                                                <div className="divider m-t-xxs m-b-xxs button-div" />
                                                <div className="cancel-submit">
                                                    <button type="button" className="btn btn-light" onClick={handleCancelClick}>Cancel</button>
                                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" onClick={handleUpdateButtonClick} disabled={emptyFields() || validatePassword() !== true || validateReenterPassword() !== true || !validateContactNumber() || errorMessage.trim().length > 0}>Update</button>
                                                    {renderModal('update account', handleUpdateUserInfo, showUpdateModal, setShowUpdateModal)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountSettingsComponent;