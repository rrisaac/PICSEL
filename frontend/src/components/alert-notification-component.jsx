/**
 * @description A component for customized alert notification that fades out after some seconds. 
 * @author Pamela Joy Santos
 * @date 05/07/2024
**/

import '../Neptune.css';
import React, { useState, useEffect } from 'react';

const AlertNotificationComponent = ({ success, message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);                       // 3 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div className="alert-container fade-in">
            <div className={`alert alert-custom alert-indicator-${success ? 'top' : 'bottom'} indicator-${success ? 'success' : 'danger'}`} role="alert">
                <div className="alert-content">
                    <span className="alert-title">{success ? 'Success!' : 'Error!'}</span>
                    <span className="alert-text">{message}</span>
                </div>
            </div>
        </div>
    );
};

export default AlertNotificationComponent;