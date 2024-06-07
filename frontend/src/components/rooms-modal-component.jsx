/**
 * @description This is the component for the modals of adding and editing rooms. 
 * @author Pamela Joy Santos
 * @date 04/22/2024
**/

/**
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

import React, { useState } from 'react';
import '../assets/css/modals.css'
import '../Neptune.css';
import { ROOM_TYPES, UTILITY_WORKERS } from '../utilities/constant.js'
import AccountDashboardModalComponent from './account-dashboard-modal-component';
import * as api from "../utilities/api";
import AlertNotificationComponent from './alert-notification-component';

const RoomsModalComponent = ({ showModal, handleClose, onConfirm, initialData, action, rooms }) => {
    const [name, setName] = useState(initialData ? initialData.room_name : '');
    const [type, setType] = useState(initialData ? initialData.room_type : '---');
    const [amenities, setAmenities] = useState(initialData ? initialData.amenities : []);
    const [utilityWorker, setUtilityWorker] = useState(initialData ? initialData.utility_worker : '---');
    // const [utilityFee, setUtilityFee] = useState(initialData ? initialData.utility_fee : '');
    const [capacity, setCapacity] = useState(initialData ? initialData.capacity : '');
    const [rate, setRate] = useState(initialData ? initialData.rate : '');
    const [description, setDescription] = useState(initialData ? initialData.description : '');
    const [images, setImages] = useState(initialData ? initialData.images : []);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [nameError, setNameError] = useState('');
    const [capacityError, setCapacityError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleNameChange = async (event) => {
        const newName = event.target.value;
        setName(newName);
        const existingRoomNames = rooms.map(room => room.room_name.toLowerCase());
        if (existingRoomNames.includes(newName.toLowerCase())) {
            setNameError('Room name already exists.');
        } else {
            setNameError('');
        }
    };

    const handleCapacityChange = async (event) => {
        const newCapacity = parseInt(event.target.value, 10);
        setCapacity(event.target.value);
        if (newCapacity < 1) {
            setCapacityError('Capacity must be a positive whole number.');
        } else {
            setCapacityError('');
        }
    }

    const handleAmenitiesChange = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            let value = event.target.value.trim();
            if (value && !amenities.includes(value)) {
                setAmenities([...amenities, value]);
            }
            event.target.value = '';
        }   
    };
      
    const removeAmenity = (amenityToRemove) => {
        setAmenities(amenities.filter(amenity => amenity !== amenityToRemove));
    };

    const handleFileChange = (event) => {
        setImages([...images, ...event.target.files]);
        event.target.value = null;
    };

    const removeFile = (fileToRemove) => {
        setImages(images.filter(file => file !== fileToRemove));
    };

    const generateDummyFileName = (index) => {
        return `image_${index + 1}.jpg`;
    };

    const handleSaveClick = () => {
        setShowUpdateModal(true);
    }

    const renderModal = (value, onConfirm, showModal, setShowModal) => {
        if (showModal) {
            return (
                <AccountDashboardModalComponent
                    showModal={showModal}
                    handleClose={() => setShowModal(false)}
                    value={value}
                    onConfirm={handleSubmitButton}
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

    const allFieldsFilled = () => {
        return name && type && type !== '---' && utilityWorker && utilityWorker !== '---' && capacity && rate && description && amenities.length > 0 && images.length > 0;
    };      

    const handleSubmitButton = async (password) => {
        setShowAlert(false);
        setAlertSuccess(false);
        setAlertMessage('');

        try {
            const formData = new FormData();
            formData.append('password', password);
            formData.append('room_type', type);
            formData.append('room_name', name);
            formData.append('description', description);
            formData.append('amenities', JSON.stringify(amenities));
            formData.append('utility_worker', utilityWorker);
            formData.append('utility_fee', 200);
            formData.append('capacity', capacity);
            formData.append('rate', rate);

            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
    
            if (action === "Add") {
                const options = { body: formData };
                const response = await api.createRoom(options);
                if (response.data.success) {
                    setAlertSuccess(true);
                    setAlertMessage(response.data.message);
                    setShowAlert(true);
                    onConfirm(response.data.newRoom);
                }
            } else if (action === "Edit") {
                const options = { body: formData };
                const response = await api.editRoom(options, initialData.room_id);
                if (response.data.success) {
                    setAlertSuccess(true);
                    setAlertMessage(response.data.message);
                    setShowAlert(true);
                    onConfirm(response.data.newRoom);
                }
            }
    
            // Close the modal after the submission attempt
            setTimeout(handleClose, 5000);
        } catch (error) {
            setAlertSuccess(false);
            setAlertMessage(error.response.data.message);
            setShowAlert(true);
        }
    };

    return (
        <div className={`modal ${showModal ? 'show' : ''}`} style={{ overflow: 'hidden' }}>
            <div className="modal-backdrop fade show" style={{ overflow: 'auto' }}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable"  >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">
                                {action} Room
                            </h5>
                        </div>
                        <div className="modal-body" style={{display:"flex", flexDirection:"row", flexWrap:"wrap", alignItems:"start", minWidth: 200}}>
                            {/* Form Section Start */}
                            {renderAlert(alertSuccess, alertMessage)}
                            <form className="room-form-container">
                                <div className='row'>
                                    <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                                        <h3 className='gray-text'>Room Name</h3>
                                        <input
                                            style={{ height: 40 }}
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            value={name}
                                            onChange={handleNameChange}
                                            required
                                        />
                                        {nameError && <div className="error-message">{nameError}</div>}
                                    </div>
                                    <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                                        <h3 className='gray-text'>Room Type</h3>
                                        <select class="js-states form-control" tabindex="-1"
                                            style={{ height: 40 }}
                                            id='type'
                                            value={type}
                                            onChange={(event) => setType(event.target.value)}
                                            required>
                                            <option value="">---</option>
                                            {Object.entries((ROOM_TYPES)).map(([key, value]) => (
                                                <option key={key} value={value}>
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                                        <h3 className='gray-text'>Utility Worker</h3>
                                        <select class="js-states form-control" tabindex="-1"
                                            style={{ height: 40 }}
                                            id='utilityWorker'
                                            value={utilityWorker}
                                            onChange={(event) => setUtilityWorker(event.target.value)}
                                            required>
                                            <option value="">---</option>
                                            {Object.entries(UTILITY_WORKERS).map(([key, value]) => (
                                                <option key={key} value={value}>
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                                        <h3 className='gray-text'>Utility Fee</h3>
                                        <input
                                            style={{ height: 40 }}
                                            type="number"
                                            className="form-control room-form"
                                            id="utilityFee"
                                            value={200}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                                        <h3 className='gray-text'>Capacity</h3>
                                        <input
                                            style={{ height: 40 }}
                                            type="number"
                                            className="form-control"
                                            id="capacity"
                                            value={capacity}
                                            onChange={handleCapacityChange}
                                            required
                                        />
                                        {capacityError && <div className="error-message">{capacityError}</div>}
                                    </div>
                                    <div className="form-group col-xs-12 col-sm-4" style={{ flexGrow: 1, paddingRight: 0 }}>
                                        <h3 className='gray-text'>Rate</h3>
                                        <input
                                            style={{ height: 40 }}
                                            type="number"
                                            className="form-control"
                                            id="rate"
                                            value={rate}
                                            onChange={(event) => setRate(event.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="form-group col-xs-12 col-sm-6" style={{ flexGrow: 1, paddingRight: 0 }}>
                                        <h3 className='gray-text'>Amenities</h3>
                                        <div className="amenities-container">
                                            {amenities.map((amenity, index) => (
                                            <div key={index} className="item-tag">
                                                {amenity}
                                                <span className="remove-item" onClick={() => removeAmenity(amenity)}>×</span>
                                            </div>
                                            ))}
                                            <input
                                                style={{ height: 40 }}
                                                type="text"
                                                className="form-control"
                                                id="amenities"
                                                onKeyPress={handleAmenitiesChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group col-xs-12 col-sm-6" style={{ flexGrow: 1, paddingRight: 0 }}>
                                        <h3 className='gray-text'>Images</h3>
                                        <div className="upload-container">
                                            {images.map((file, index) => (
                                                <div key={index} className="item-tag">
                                                    {file.name || generateDummyFileName(index)}
                                                    <span className="remove-item" onClick={() => removeFile(file)}>×</span>
                                                </div>
                                            ))}
                                            <input
                                                type="file"
                                                className="inputfile m-b-s room-file"
                                                id="file-upload"
                                                accept=".jpg, .jpeg, .png"
                                                onChange={handleFileChange}
                                                multiple
                                            />
                                             <label htmlFor="file-upload" className="form-label room-form-label">Upload Images</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="form-group row-xs-12">
                                        <h3 className='gray-text'>Description</h3>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            value={description}
                                            onChange={(event) => setDescription(event.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                            {/* Form Section End */}
                        </div>
                        <div className="modal-footer room-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveClick} disabled={!allFieldsFilled() || nameError !== '' || capacityError !== ''}>Save</button>
                            {action === "Add" && renderModal('add room', handleSubmitButton, showUpdateModal, setShowUpdateModal)}
                            {action === "Edit" && renderModal('update room', handleSubmitButton, showUpdateModal, setShowUpdateModal)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomsModalComponent;