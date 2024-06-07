/**
 * Handle Switch Actions
 * 
 * Get all switches and handle when flipped
 * 
 * @description Created both handler and getter
 * @author Neil Vincent Alday
 * @date 05/05/2024
 */

/**
 * Handle Database Changes
 * 
 * Signals all clients that the database has been modified
 * 
 * @description Uses SSE Event to alert active clients that the toggle table has changes
 * @author Rheana M. Mindo
 * @date 05/06/2024
 */

/**
 * @description Refactored the messages sent
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

const { Permission } = require('../models/permission.js');
const { createLogEntry } = require('./log-controller.js');
const { LOG_TYPES } = require('../../frontend/src/utilities/constant.js');

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

// GET all switches
const getSwitches = async (req, res) => {
    try {
        const switches = await Permission.findAll({
            where: {}
        });
        res.send({success: true, switches: switches});
    } catch (error) {
        res.status(500).send({success: false, message: "Error retrieving switches."});
    }
};

// FLIP current switch
const flipSwitch = async (req, res) => {
    try {
        const { permission_name, user_type } = req.body;

        // Find the permission document
        const permission = await Permission.findOne({
            where: {
                user_type: user_type !== 'null'? user_type: null,
                permission_name: permission_name
            }
        });

        // Check if permission was found
        if (!permission) {
            return res.status(404).send({success: false, message: 'Permission not found.'});
        }

        // Get the user id from the request
        const userId = req.user.user_id;

        await createLogEntry(userId, null, permission.is_enabled ? LOG_TYPES.SUPER_ADMIN_DISABLES_FEATURE : LOG_TYPES.SUPER_ADMIN_ENABLES_FEATURE , `Super Admin ${permission.is_enabled ? "disabled" : "enabled"} permission ${permission.permission_name} for user type ${permission.user_type}.`);

        // Toggle the is_enabled value
        permission.is_enabled = !permission.is_enabled;

        // Save the updated document
        await permission.save();

        handleDbChange();
        // Send a success response
        res.send({success: true, message: 'Permission updated successfully!', permission: permission.is_enabled});
    } catch (error) {
        // Send error response
        res.status(500).send({success: false, message: 'Error updating permission: ' + error.message});
    }
};


module.exports = {
    getSwitches: getSwitches,
    flipSwitch: flipSwitch
}