/**
 * User Modal for SuperAdmin
 *
 * @description Shows and handles the edit interface, and handles the deletion request
 * (AccountDashboardModalComponent shows the deletion interface)
 * @author Gacel Perfinian
 * @date 04/27/2024
 * 
 * @description Integrated Edit and Delete
 * @author Neil Vincent Alday
 * @date 04/28/2024
 * 
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/09/2024
 */

import React, {useState} from 'react'
import '../assets/css/modals.css'
import '../Neptune.css'
import { USER_TYPES, EMPTY } from '../utilities/constant'
import AccountDashboardModalComponent from './account-dashboard-modal-component'
import * as api from "../utilities/api"
import AlertNotificationComponent from './alert-notification-component';

const UsersModalComponent = ({showModal, closeModal, currentUserId, actionType, userData, setUserData, handleShowAlert}) => {

    // Prepare data for editing
    const currentIndex = userData.findIndex((x) => (x.user_id === currentUserId))
    const [currentUserData, setCurrentUserData] = useState(Object.assign({}, userData[currentIndex]))
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [image, setImage] = useState(null);

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

    // For name construction
    const constructName = (data) => {
        return data.last_name + ', ' + data.first_name + ((!data.middle_name | data.middle_name === 'N/A')? '' : ' ' + data.middle_name)
    }

    const parsePicture = (picture) => {
        // PNG Header
        const headerPNG = 'iVBORw0KGg'
        const blackPicture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQAAAAA3bvkkAAAACklEQVR4AWNgAAAAAgABc3UBGAAAAABJRU5ErkJggg=='

        if (!picture)
            return blackPicture
        else if (picture.includes('.'))
            return picture;
        else if (picture.startsWith(headerPNG))
            return 'data:image/png;base64,'.concat(picture)
        else
            return 'data:image/jpeg;base64,'.concat(picture)
    }

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (file.name) {
                const reader = new FileReader();
    
                reader.onload = () => {
                    const base64String = reader.result.split(',')[1];
                    resolve(base64String);
                };
        
                reader.onerror = () => {
                    reject(new Error('Problem reading the file.'));
                };
        
                reader.readAsDataURL(file);
            } else {
                resolve(file);
            }
        });
    };    

    // const handleUpdateData = () => {
    //     const formData = new FormData();
    //     formData.append("first_name", currentUserData.first_name);
    //     formData.append("middle_name", currentUserData.middle_name);
    //     formData.append("last_name", currentUserData.last_name);
    //     formData.append("username", currentUserData.username);
    //     formData.append("contact_number", currentUserData.contact_number);
    //     formData.append("display_picture", currentUserData.display_picture);
    //     formData.append("password", currentUserData.password);
    // }

    const updateData = (event) => {
        event.preventDefault()
        const el = event.target
        const key = el.dataset.key
        const value = el.value
        
        // Modify the user buffer
        let modifiedUserData = Object.assign({}, currentUserData)
        modifiedUserData[key] = value
        setCurrentUserData(modifiedUserData)

        // Do some things according to key
        switch(key) {
            // Update the display name according to data passed
            case 'first_name':
            case 'middle_name':
            case 'last_name':
                let modifiedUserData = Object.assign({}, currentUserData)
                modifiedUserData[key] = value
                modifiedUserData.name = constructName(currentUserData)
                setCurrentUserData(modifiedUserData)
                break;
            default:
                break;
        }
    }

    const updateDisplayPictureData = async (event) => {
        const selectedFile = event.target.files[0];
        setImage(selectedFile);

        // Update filename
        const fileNameEl = document.getElementById("file-upload-name")
        const fileEl = document.getElementById("file-upload")
        fileNameEl.textContent = fileEl.files.length? fileEl.files[0].name : 'Upload Image'

        // Change data
        if (fileEl.files.length) {
            let modifiedUserData = Object.assign({}, currentUserData)
            modifiedUserData.display_picture = await readFileAsBase64(fileEl.files[0])
            modifiedUserData.parsed_picture = parsePicture(modifiedUserData.display_picture)
            setCurrentUserData(modifiedUserData)
        }
        else {
            let modifiedUserData = Object.assign({}, currentUserData)
            modifiedUserData.display_picture = userData[currentIndex].display_picture
            modifiedUserData.parsed_picture = parsePicture(modifiedUserData.display_picture)
            setCurrentUserData(modifiedUserData)
        }
    }

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
      
        if (phoneNumber.length < 5) return phoneNumber;
        if (phoneNumber.length < 8) {
          return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4)}`;
        }
        return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 11)}`;
    };    

    const updateContactNumber = (event) => {
        const rawNumber = event.target.value.replace(/-/g, '');
        const formattedPhoneNumber = formatPhoneNumber(rawNumber);

        const el = event.target
        const key = el.dataset.key
        const value = formattedPhoneNumber
        
        // Modify the user buffer
        let modifiedUserData = Object.assign({}, currentUserData)
        modifiedUserData[key] = value
        setCurrentUserData(modifiedUserData)

        // Do some things according to key
        switch(key) {
            // Update the display name according to data passed
            case 'first_name':
            case 'middle_name':
            case 'last_name':
                let modifiedUserData = Object.assign({}, currentUserData)
                modifiedUserData[key] = value
                modifiedUserData.name = constructName(currentUserData)
                setCurrentUserData(modifiedUserData)
                break;
            default:
                break;
        }
    };


    const validateContactNumber = (number) => {
        const contactNumberRegex = /^09\d{2}-\d{3}-\d{4}$/;
        return contactNumberRegex.test(number);
    };
    
    const validateData = (data) => {
        return (data.user_id && data.first_name && data.last_name && data.username && data.contact_number && validateContactNumber(data.contact_number) && data.display_picture)
    }

    // DELETES User
    const handleDeleteUser = async (password) => {
        try {
            const data = { password: password};
            const options = { body: data };

            const result = await api.deteleUserSA(options, currentUserData.user_id);
            if (result.data.success) {
                handleShowAlert(true, result.data.message);

                let modifiedUserData = [...userData]
                modifiedUserData.splice(currentIndex, 1)
                setUserData(modifiedUserData)
            }
        } catch (error) {
            handleShowAlert(false, error.response.data.message);
        }
    };

    // UPDATES User
    const handleUpdateUser = async (password) => {
        setAlertSuccess(false);
        setAlertMessage('');
        setShowAlert(false);

        try {
            const formData = new FormData();
            formData.append("password", password);
            formData.append("first_name", currentUserData.first_name);
            formData.append("middle_name", currentUserData.middle_name);
            formData.append("last_name", currentUserData.last_name);
            formData.append("username", currentUserData.username);
            formData.append("contact_number", currentUserData.contact_number);
            formData.append("display_picture", currentUserData.display_picture);
            formData.append("image", image);
            currentUserData["password"] = password;

            currentUserData["isChangingUserName"] = !(currentUserData.username === userData[currentIndex].username)

            const options = { body: formData };
            const result = await api.editUserSA(options, currentUserData.user_id);
            if (result.data.success) {
                handleShowAlert(true, result.data.message);

                let modifiedUserData = [...userData]
                modifiedUserData[currentIndex] = currentUserData
                setUserData(modifiedUserData)
            } 

            closeModal();
        } catch (error) {
            setAlertSuccess(false);
            setAlertMessage(error.response.data.message);
            setShowAlert(true);
        }
    };

    if (actionType === 'delete') return <AccountDashboardModalComponent showModal={showModal} handleClose={closeModal} onConfirm={(password) => {handleDeleteUser(password);}} userData={currentUserData} value={'superadmin delete account'}/>;
    else return (
        <div className={`modal ${showModal ? 'show' : ''}`} style={{ overflow: 'hidden' }}>
        <div className="modal-backdrop fade show" style={{ overflow: 'auto' }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable"  >
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">
                    Edit User Data
                </h5>
            </div>
            <div className="modal-body" style={{display:"flex", flexDirection:"row", flexWrap:"wrap", alignItems:"start", minWidth: 200}}>
                {/* Form Section Start */}
                {renderAlert(alertSuccess, alertMessage)}
                <form className="room-form-container">
                    {/* User ID / Google ID */}
                    <div className='row'>
                        <div className="form-group col-xs-12 col-sm-6" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>User ID</h3>
                            <input
                                style={{ height: 40 }}
                                type="text"
                                className="form-control"
                                id="user-id"
                                data-key="user_id"
                                value={currentUserData.user_id}
                                disabled
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-6" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>Google ID</h3>
                            <input
                                style={{ height: 40 }}
                                type="text"
                                className="form-control"
                                id="google-id"
                                data-key="google_id"
                                value={currentUserData.google_id}
                                disabled
                            />
                        </div>
                    </div>
                    {/* Name */}
                    <div className='row'>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text' style={{ color: currentUserData.first_name? undefined: '#F00' }}>First Name</h3>
                            <input
                                style={{ 
                                    height: 40,
                                    color: currentUserData.first_name? undefined: '#F00',
                                    borderColor: currentUserData.first_name? undefined: '#F00',
                                }}
                                type="text"
                                className="form-control"
                                id="first-name"
                                data-key="first_name"
                                value={currentUserData.first_name}
                                onChange={updateData}
                                required
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>Middle Name</h3>
                            <input
                                style={{ height: 40 }}
                                type="text"
                                className="form-control"
                                id="middle-name"
                                data-key="middle_name"
                                value={currentUserData.middle_name}
                                onChange={updateData}
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text' style={{ color: currentUserData.last_name? undefined: '#F00' }}>Last Name</h3>
                            <input
                                style={{ 
                                    height: 40,
                                    color: currentUserData.last_name? undefined: '#F00',
                                    borderColor: currentUserData.last_name? undefined: '#F00',
                                }}
                                type="text"
                                className="form-control"
                                id="last-name"
                                data-key="last_name"
                                value={currentUserData.last_name}
                                onChange={updateData}
                                required
                            />
                        </div>
                    </div>
                    {/* Email / Username / Contact */}
                    <div className='row'>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>E-mail</h3>
                            <input
                                style={{ height: 40 }}
                                type="text"
                                className="form-control"
                                id="email"
                                data-key="email"
                                value={currentUserData.email}
                                onChange={updateData}
                                disabled
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text' style={{ color: currentUserData.username? undefined: '#F00' }}>Username</h3>
                            <input
                                style={{ 
                                    height: 40,
                                    color: currentUserData.username? undefined: '#F00',
                                    borderColor: currentUserData.username? undefined: '#F00',
                                }}
                                type="text"
                                className="form-control"
                                id="username"
                                data-key="username"
                                value={currentUserData.username}
                                onChange={updateData}
                                required
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text' style={{ color: validateContactNumber(currentUserData.contact_number)? undefined: '#F00' }}>Contact Number</h3>
                            <input
                                style={{ 
                                    height: 40,
                                    color: validateContactNumber(currentUserData.contact_number)? undefined: '#F00',
                                    borderColor: validateContactNumber(currentUserData.contact_number)? undefined: '#F00',
                                }}
                                type="text"
                                className="form-control"
                                id="contact-number"
                                data-key="contact_number"
                                value={currentUserData.contact_number}
                                onChange={updateContactNumber}
                                required
                            />
                        </div>
                    </div>
                    {/* Photo / User Type / Student Number */}
                    <div className='row'>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>Image</h3>
                            <div className="upload-container">
                                <input
                                    type="file"
                                    className="inputfile m-b-s room-file"
                                    id="file-upload"
                                    accept="image/jpeg, image/png"
                                    onChange={updateDisplayPictureData}
                                />
                                <label id="file-upload-name" htmlFor="file-upload" className="form-label room-form-label" style={{ position: 'relative', top: '-5px' }}>Upload Image</label>
                            </div>
                        </div>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>User Type</h3>
                            <input
                                style={{ height: 40 }}
                                type="text"
                                className="form-control"
                                id="user-type"
                                data-key="user_type"
                                value={currentUserData.user_type}
                                required
                                disabled
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>Student Number</h3>
                            <input
                                style={{ height: 40 }}
                                type="text"
                                className="form-control"
                                id="student-number"
                                data-key="student_number"
                                value={currentUserData.user_type === USER_TYPES.STUDENT? currentUserData.student_number : EMPTY}
                                disabled
                            />
                        </div>
                    </div>
                    {/* Org Name / College / Institution */}
                    <div className='row'>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>Organization</h3>
                            <input
                                style={{ height: 40 }}
                                type="text"
                                className="form-control"
                                id="organization-name"
                                data-key="organization_name"
                                value={currentUserData.user_type === USER_TYPES.STUDENT_ORGANIZATION? currentUserData.organization_name : EMPTY}
                                disabled
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>College</h3>
                            <input
                                style={{ height: 40 }}
                                type="text"
                                className="form-control"
                                id="college"
                                data-key="college"
                                value={currentUserData.user_type === USER_TYPES.FACULTY? currentUserData.college : EMPTY}
                                disabled
                            />
                        </div>
                        <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                            <h3 className='gray-text'>Department</h3>
                            <input
                                style={{ height: 40 }}
                                type="text"
                                className="form-control"
                                id="department"
                                data-key="department"
                                value={currentUserData.user_type === USER_TYPES.FACULTY? currentUserData.department : EMPTY}
                                disabled
                            />
                        </div>
                    </div>
                </form>
                {/* Form Section End */}
            </div>
            <div className="modal-footer room-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => setShowConfirmModal(true)} disabled={!validateData(currentUserData)}>Commit</button>
                {showConfirmModal? <AccountDashboardModalComponent showModal={showModal} handleClose={(() => setShowConfirmModal(false))} onConfirm={(password) => {handleUpdateUser(password);}} userData={currentUserData} value={'superadmin edit account'}/>: null}
            </div>
        </div>
        </div>
        </div>
        </div>
    );
}

export default UsersModalComponent;