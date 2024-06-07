/**
 * Announcement Controller
 * 
 * Handles Read and Update Operations for Announcement
 * 
 * @description Added getAnnouncements and editAnnouncement
 * @author Eric Conrad Panga
 * @date 05/01/2024
 */

/**
 * Handle Database Changes
 * 
 * Signals all clients that the database has been modified
 * 
 * @description Uses SSE Event to alert active clients that the announcement table has changes
 * @author Rheana M. Mindo
 * @date 05/06/2024
 */

/**
 * @description Refactored the messages sent
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

const { Announcement } = require('../models/announcement.js');

require('dotenv').config();

// SSE Event
const handleDbChange = () => {
    console.log("I've been called");
    fetch(`${process.env.REACT_APP_SERVER_URL}/change`, { method: 'POST' })
      .then(response => {
        if (response.ok) {
          console.log('Db change signal sent to server');
        } else {
          console.error('Failed to send Db change signal to server');
        }
      })
      .catch(error => {
        console.error('Error occurred while sending Db change signal:', error);
      });
};

// Get all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll();
    return res.status(200).send({ success: true, data: announcements });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
}

// Edit announcement
const editAnnouncement = async (req, res) => {
  try {
    const { content } = req.body;

    // Check if the announcement exists
    const announcement = await Announcement.findOne({ where: { announcement_id: req.params.announcementId } });
    if (!announcement) {
      return res.status(404).send({ success: false, message: "Announcement not found." });
    }

    // Proceed with updating
    await announcement.update({ content });

    handleDbChange(req.token);
    return res.status(200).send({ success: true, message: "Successfully updated announcement!", announcement: announcement });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
}

module.exports = { 
    getAnnouncements, 
    editAnnouncement 
};