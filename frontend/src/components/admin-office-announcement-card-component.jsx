/* Description: Admin announcement card - fetches, displays, allows editing (admin/superadmin), and guidelines modal

@author Prince Czedrick Nepomuceno
@date 05/04/2024
*/

/* Description: Added not resizable textarea

@author Prince Czedrick Nepomuceno
@date 05/24/2024
*/

import React, { useState, useEffect } from 'react';
import GuidelinesModalComponent from './guidelines-modal-component';
import * as api from "../utilities/api";
import { USER_TYPES } from '../utilities/constant';

const AdminOfficeAnnouncementCardComponent = () => {
  const [userInfo, setUserInfo] = useState();
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  
  const handleGuidelinesButtonClick = () => {
    setShowGuidelinesModal(true); // Open the modal
  };

  const renderModal = (onConfirm, showModal, setShowModal) => {
    return (
      <GuidelinesModalComponent
        showModal={showModal}
        handleClose={() => setShowModal(false)}
      />)
  }

  useEffect(() => {
    fetchUserInfo();
    fetchAnnouncements();
    // eslint-disable-next-line
  }, []);

  const fetchUserInfo = async () => {
    try {
      const user = await api.getUserInfo();
      if (user && user.data) {
        setUserInfo(user.data);
      } else {
        setUserInfo({});
      }
    } catch (error) {
      console.error('Error fetching user information: ', error);
      setUserInfo({});
    }
  };

  function formatDateTime(datetimeStr) {
    try {
      // Parse the datetime string in ISO 8601 format
      const datetimeObj = new Date(datetimeStr);

      // Define the desired format for month, day, year, hours, minutes, and AM/PM
      const month = ("0" + (datetimeObj.getMonth() + 1)).slice(-2); // Zero-pad months
      const day = ("0" + datetimeObj.getDate()).slice(-2); // Zero-pad days
      const year = datetimeObj.getFullYear();
      const hour = datetimeObj.getHours() % 12 || 12; // Convert to 12-hour format
      const minute = ("0" + datetimeObj.getMinutes()).slice(-2); // Zero-pad minutes
      const meridiem = datetimeObj.getHours() >= 12 ? "PM" : "AM";

      // Return the formatted datetime string
      return `${month}/${day}/${year} ${hour}:${minute}${meridiem}`;
    } catch (error) {
      console.error("Error formatting datetime:", error);
      return null; // Or return a default value if formatting fails
    }
  }


  const [announcementText, setAnnouncementText] = useState(""); // Replace with actual logic to fetch announcement content
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [latestUpdateDate, setLatestUpdateDate] = useState(""); // Replace with actual logic to fetch timestamps
  const [latestAnnouncement, setLatestAnnouncment] = useState(null);

  const max_length = 300;
  const [characterLimitExceeded, setCharacterLimitExceeded] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    // eslint-disable-next-line
  }, [announcementText]);


  const fetchAnnouncements = async () => {
    try {
      const announcements = await api.getAnnouncements();

      const sortedAnnouncements = announcements.data.data.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });

      // Get the latest announcement (assuming the first element after sorting)
      const latestAnnouncement = sortedAnnouncements[0];
      setLatestAnnouncment(latestAnnouncement);

      setAnnouncementText(latestAnnouncement.content);
      setLatestUpdateDate(formatDateTime(latestAnnouncement.updated_at));

    } catch (error) {
      console.error('Error fetching announcements: ', error);
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setEditedContent(value);
    if (value.length > max_length) {
      setCharacterLimitExceeded(true);
    } else {
      setCharacterLimitExceeded(false);
    }
  }

  const handleEditButtonClick = () => {
    setIsEditing(true);
    setEditedContent(announcementText); // Pre-fill editedContent with current announcement
    setCharacterLimitExceeded(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSaveButtonClick = async () => {
    try {
      const data = {
        content: editedContent
      }
      const options = { body: data }
      // eslint-disable-next-line
      const response = await api.editAnnouncement(options, latestAnnouncement.announcement_id);

      // Update announcement text on card
      setAnnouncementText(editedContent);
    } catch (error) {
      console.error("Error saving announcement:", error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="card widget widget-popular-blog">
      <div className="card-body">
        <div className="widget-popular-blog-container">
          <div className="widget-popular-blog-image">
            <img src="assets/img/staff/CJunsay.png" alt="" />
          </div>
          <div className="widget-popular-blog-content ps-4">
            <span className="widget-popular-blog-title">
              Announcement from the Admin Office
            </span>
            <div className='col' style={{marginLeft: '-15px'}}> 
              {isEditing ? (
                // eslint-disable-next-line
                <textarea
                  className="form-control"
                  contentEditable="true"
                  role="textbox"
                  aria-multiline="true"
                  spellCheck="true"
                  autoCorrect="true"
                  resize="none"
                  style={{ marginBottom: 0, height: 82 }}
                  type="textarea"
                  value={editedContent}
                  onChange={handleTextChange}
                />
              ) : (
                <span className="widget-popular-blog-text">{announcementText}</span>
              )}
            </div>
            {characterLimitExceeded && isEditing && (
              <div className="error-char-limit">{max_length}-character limit exceeded</div>
            )}
          </div>
          
          {(userInfo && (userInfo.user_type === USER_TYPES.SUPER_ADMIN || userInfo.user_type === USER_TYPES.ADMIN)) && (
            <button className="align-self-start" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><i className="material-icons"
              style={{
                pointerEvents: isEditing ? 'none' : 'auto',
              }} onClick={handleEditButtonClick}>edit_note</i></button>
          )}
        </div>
      </div>
      <div className="card-footer">
        <span className="widget-popular-blog-date">
          Latest update: {latestUpdateDate}
        </span>

        {renderModal(handleGuidelinesButtonClick, showGuidelinesModal, setShowGuidelinesModal)}
        {isEditing ? (
          // eslint-disable-next-line
          <a>
            <button className="btn btn-primary float-end"  disabled={editedContent.trim() === "" || characterLimitExceeded}  onClick={handleSaveButtonClick}>Edit</button>
            <button className="btn btn-secondary float-end" onClick={handleCancel}>Cancel</button>
          </a>
        ) :
          // eslint-disable-next-line
          <a class="btn btn-primary float-end btn-dashboard announcement-btn" style={{ lineHeight: "2.7" }} onClick={handleGuidelinesButtonClick}>
            <span className='long-txt'>ICS Lecture Halls Guidelines</span>
            <span className='short-txt'>ICS Guidelines</span>
          </a>
        }
      </div>
    </div>
  );
};

export default AdminOfficeAnnouncementCardComponent;
