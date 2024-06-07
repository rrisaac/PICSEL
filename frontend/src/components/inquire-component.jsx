/* Description: To future frontend developer please change this docs. This is only a placeholder component prepared by Frontend TL Isaac

@author 
@date 
*/

/**
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

// Description: Added explicit validators on fields: Capacity, Contact Number, Purpose.

// @author Jan Andrew Senires
// @date 05/13/2024

// Description: Added explicit validator for the character limit of Event Title.

// @author Jan Andrew Senires
// @date 05/14/2024


import React, { useState } from 'react';
import * as api from '../utilities/api';
import { LOG_TYPES } from '../utilities/constant';
import AlertNotificationComponent from './alert-notification-component';

const InquireComponent = () => {
    const [eventTitle, setEventTitle] = useState('');
    const [purpose, setPurpose] = useState('');
    const [date, setDate] = useState('');
    const [capacity, setCapacity] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const max_length = 300;
    const [characterLimitExceeded, setCharacterLimitExceeded] = useState(false);

    const eventTitle_max_length = 30;
    const [eventTitleCharacterLimitExceeded, setEventTitleCharacterLimitExceeded] = useState(false);

    const validateContactNumber = (number) => {
        const contactNumberRegex = /^09\d{2}-\d{3}-\d{4}$/;
        return contactNumberRegex.test(number);
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();

        // check if capacity is a number and not a negative
        if (isNaN(capacity)) {
            setAlertSuccess(false);
            setAlertMessage('Capacity must be a positive number.');
            setShowAlert(true);
            return;
        } else if (capacity <= 0) {
            setAlertSuccess(false);
            setAlertMessage('Capacity must be greater than 0.');
            setShowAlert(true);
            return;
        }

        // check if contact number follows the format 09XX-XXX-XXXX
        const contactNumberPattern = /^09\d{2}-\d{3}-\d{4}$/;
        if (!contactNumberPattern.test(contactNumber)) {
            setAlertSuccess(false);
            setAlertMessage('Contact number must follow the format 09XX-XXX-XXXX.');
            setShowAlert(true);
            return;
        }

        const remarks = `Guest ${contactPerson}(${contactNumber}) is inquiring for ${date} reservation for ${eventTitle} with ${capacity} pax. Purpose: ${purpose}.`;

        const response = await api.getUserInfo();
        const userId = response.data.user_id;
        const logType = LOG_TYPES.USER_OPENS_INQUIRY;

        const data = {
            userId: userId,
            logType: logType,
            remarks: remarks
        }
        const options = {body:data};

        const logResponse = await api.createJetLog(options);

        if (logResponse.data.success) {
            setAlertSuccess(true);
            setAlertMessage('Inquiry submitted successfully!');
            setShowAlert(true);
        } else {
            setAlertSuccess(false);
            setAlertMessage('Failed to submit inquiry. Please try again.');
            setShowAlert(true);
        }

        // Clear the form
        setEventTitle('');
        setPurpose('');
        setDate('');
        setCapacity('');
        setContactPerson('');
        setContactNumber('');
    }

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

    const handlePurposeChange = (e) => {
        const value = e.target.value;
        setPurpose(value);
        if (value.length > max_length) {
            setCharacterLimitExceeded(true);
        } else {
            setCharacterLimitExceeded(false);
        }
        if (value.trim() === '') {
            setValidationErrors(prev => ({
                ...prev,
                purpose: 'Please enter a purpose',
            }));
        } else {
            setValidationErrors(prev => ({ ...prev, purpose: '' }));
        }
    }

    const handleEventTitleChange = (e) => {
        const value = e.target.value;
        setEventTitle(value);
        if (value.length > eventTitle_max_length) {
            setEventTitleCharacterLimitExceeded(true);
        } else {
            setEventTitleCharacterLimitExceeded(false);
        }
        if (value.trim() === '') {
            setValidationErrors(prev => ({
                ...prev,
                eventTitle: 'Please enter an event title',
            }));
        } else {
            setValidationErrors(prev => ({ ...prev, eventTitle: '' }));
        }
    }

    const handleCapacityChange = (e) => {
        const value = e.target.value;
        setCapacity(value);
        const newValue = parseInt(value, 10);
        if (!isNaN(newValue) && newValue > 0) {
            setCapacity(newValue);
            setValidationErrors(prev => ({ ...prev, capacity: '' }));
        } else {
            setValidationErrors(prev => ({
                ...prev,
                capacity: 'Capacity must be a positive whole number',
            }));
        }
    }

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

    return (
        <>
        {renderAlert(alertSuccess, alertMessage)}
        <form onSubmit={handleInquirySubmit}>
        <div>
            <div >
                <title>Settings | PICSEL</title>
                <div className="page-description">
                    <h1>Inquire Reservation</h1>
                </div>
            </div>
            <div className="white-rectangle" style={{
                borderRadius: 15,
                marginLeft: 0,
                marginRight: 8,
                }}>

                <div className="widget-stats-container d-flex" style={{ flexGrow: 1, padding: 40, overflow: 'hidden' }}>
                    <div className="widget-stats-content flex-fill" >
                    <div className='inquire-container' style={{ display: "flex", flexDirection: "column" }}>
                        <div className='form-group'>
                            <h3 className='gray-text'>Event Title</h3>
                            <input class="form-control"
                            className="form-control"
                            value={eventTitle}
                            onChange={handleEventTitleChange}
                            />
                            {eventTitleCharacterLimitExceeded && (
                                <div className="error-message">{eventTitle_max_length}-character limit exceeded</div>
                            )}
                            {validationErrors.eventTitle && (
                                <div className="error-message">{validationErrors.eventTitle}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <h3 className='gray-text'>Purpose <i className="material-icons-outlined" style={{ color: "black", fontSize: "14px", marginLeft: "4px", marginTop: "-0.5px" }} data-bs-toggle="tooltip" data-bs-placement="top" title="Please include your preferred time and duration of reservation in your purpose.&#10;Failure to do so will result in the administrator assigning a time and duration for you.">info</i></h3>
                            <textarea
                            className="form-control"
                            required
                            value={purpose}
                            onChange={handlePurposeChange}
                            />
                            {characterLimitExceeded && (
                                <div className="error-message">{max_length}-character limit exceeded</div>
                            )}
                            {validationErrors.purpose && (
                                <div className="error-message">{validationErrors.purpose}</div>
                            )}
                            </div>

                                </div>
                        <div className='inquire-group'>
                            <div className="form-group" style={{ flexBasis: '50%', marginRight: "20px" }}>
                                <h3 className='gray-text'>Date</h3>
                                <input
                                type="date"
                                className="form-control"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]} // Get today's date in YYYY-MM-DD format
                                />
                            </div>
                            <div className='form-group' style={{ flexBasis: '50%' }}>
                                <h3 className='gray-text'>Capacity</h3>
                                <input class="form-control"
                                className="form-control"
                                type="number"
                                value={capacity}
                                onChange={handleCapacityChange}
                                />
                                {validationErrors.capacity && (
                                    <div className="error-message">{validationErrors.capacity}</div>
                                )}
                            </div>
                        </div>
                        <div className='inquire-group'>
                            <div className='form-group' style={{ flexBasis: '50%', marginRight: "20px" }}>
                                <h3 className='gray-text'>Contact Person</h3>
                                <input class="form-control"
                                className="form-control"
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                />
                            </div>
                            <div className='form-group' style={{ flexBasis: '50%' }}>
                                <h3 className='gray-text'>Contact Number</h3>
                                <input class="form-control"
                                className="form-control"
                                type="tel"
                                placeholder='09XX-XXX-XXXX'
                                value={contactNumber}
                                onChange={handleContactNumberChange}
                                onBlur={handleContactNumberBlur}
                                />
                                {validationErrors.contactNumber && (
                                    <div className="error-message">{validationErrors.contactNumber}</div>
                                )}
                            </div>
                        </div>
                        <div className='submit-inquiry'>
                            <button type="submit" className="btn btn-primary float-end" disabled={validationErrors.capacity || validationErrors.contactNumber || purpose.trim() === "" || characterLimitExceeded || eventTitle.trim() === '' || eventTitleCharacterLimitExceeded}>
                                <span className="btn-text">Submit Inquiry</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </form>
        </>
    );
}


export default InquireComponent;

