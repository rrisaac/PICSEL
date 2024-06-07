/* Description: displays a card indicating the Admin Office's availability ("OPEN" or "CLOSED") based on the current date and time, with optional automatic updates.

@author Prince Czedrick Nepomuceno
@date 04/27/2024
*/

/* Description: Added admin office hover Info Office Schedule

@author Prince Czedrick Nepomuceno
@date 05/24/2024
*/


import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

const AdminOfficeAvailabilityCardComponent = () => {
  const [officeStatus, setOfficeStatus] = useState('CLOSED');

  useEffect(() => {
    // Function to check if current day is a weekday (Monday to Friday)
    const isWeekday = (date) => date.getDay() > 0 && date.getDay() < 6;

    // Function to update office status based on time
    const updateOfficeStatus = () => {
      // Replace these placeholder values with your actual office hours
      const openingHour = 7;
      const closingHour = 19;

      const currentDate = new Date();
      const currentHour = currentDate.getHours();

      if (isWeekday(currentDate) && currentHour >= openingHour && currentHour < closingHour) {
        setOfficeStatus('OPEN');
      } else {
        setOfficeStatus('CLOSED');
      }
    };

    updateOfficeStatus();

    // Update status at regular intervals (optional)
    const intervalId = setInterval(updateOfficeStatus, 60000); // Update every minute (60 seconds)

    return () => clearInterval(intervalId); // Cleanup function to stop interval on unmount
  }, []);

  return (
    <div className="card widget widget-stats">
      <div className="card-body">
        <div className="widget-stats-container d-flex">
          <div className="widget-stats-icon widget-stats-icon-primary">
            <i className="material-icons-outlined">meeting_room</i>
          </div>
          <div className="widget-stats-content flex-fill">
            <span className="widget-stats-title">Admin Office</span>
            <span className="widget-stats-amount">{officeStatus}</span>
            {officeStatus === 'CLOSED' && (
              <span className="widget-stats-info">Please try again later</span>
            )}
            {officeStatus === 'OPEN' && (
              <span className="widget-stats-info" style={{ paddingBottom: 20 }}></span>
            )}
          </div>
          <button className="align-self-start" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><i id="admin-info" className="material-icons">info</i></button>
          <Tooltip anchorSelect="#admin-info" place="bottom">Admin Office Hours:<br/>M-F | 7AM - 7PM</Tooltip>
        </div>
      </div>
    </div>
  );
};

export default AdminOfficeAvailabilityCardComponent;
