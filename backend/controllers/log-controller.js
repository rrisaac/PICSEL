/**
 * Log Controller
 * 
 * Handles CRUD for Logs
 * 
 * @description Added createLogEntry
 * @author Aira Nicole Natividad
 * @date 04/05/2024
 * 
 * @description Added getOwnLogs
 * @author Mark Jeffrey Zapanta
 * @date 04/18/2024
 * 
 * @description Added getAllLogs
 * @author Mark Jeffrey Zapanta
 * @date 04/22/2024
 */

/**
 * Handle Database Changes
 * 
 * Signals all clients that the database has been modified
 * 
 * @description Uses SSE Event to alert active clients that the log table has changes
 * @author Rheana M. Mindo
 * @date 05/06/2024
 */

/**
 * @description Refactored the messages sent
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

const { Log } = require('../models/log.js');
const { User } = require('../models/user.js');
const { Request } = require('../models/request.js'); 
const { Op } = require('sequelize');
const { LOG_TYPES, EMPTY } = require('../../frontend/src/utilities/constant.js');

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

// Create a log entry for the activity log
const createLogEntry = async (userId, requestId, logType, remarks) => {
    try {
      await Log.create({
        user_id: userId,
        request_id: requestId,
        log_type: logType,
        remarks: remarks,
      });
      console.log('Log entry created successfully.');
      return true;
    } catch (error) {
      console.error('Error creating log entry:', error);
      return false;
    }
}

// Create Guest Log
const createJetLog = async (req, res) => {
  try {
    const { userId, requestId, logType, remarks} = req.body;
    await Log.create({
      user_id: userId,
      request_id: requestId,
      log_type: logType,
      remarks: remarks,
    });
    
    handleDbChange();
    return res.send({ success: true, message: 'Log entry created successfully!' });
  } catch (error) {
    console.error('Error creating log entry:', error);
    return res.send({ success: false, message: 'Error creating log entry.' });
  }
}

const getOwnLogs = async (req, res) => {
  try {
    // Assuming req.user has been set correctly in middleware before this handler.
    const userId = req.user.user_id;

    // Fetch logs by user_id and by request_id in parallel for efficiency.
    const [userLogs, requests] = await Promise.all([
      Log.findAll({ where: { user_id: userId } }),
      Request.findAll({ where: { user_id: userId } })
    ]);
    
    const requestIds = requests.map(request => request.request_id);

    if (requestIds.length === 0) {
      return res.status(200).json(userLogs);
    }

    // Get logs related to requests made by the user.
    const logsOfRequests = await Log.findAll({
      where: { request_id: { [Op.in]: requestIds } }
    });

    // Combine logs and remove duplicates.
    const allLogs = [...userLogs, ...logsOfRequests];
    const uniqueLogs = Array.from(new Map(allLogs.map(log => [log.log_id, log])).values());

    // Sort logs by creation date.
    uniqueLogs.sort((a, b) => b.created_at - a.created_at);

    return res.status(200).json(uniqueLogs);
  } catch (error) {
    console.error('Error getting logs:', error);
    return res.status(500).json({ success: false, error: 'Error getting logs.' });
  }
}

const getAllLogs = async (req, res) => {
  try{
    const users = await User.findAll();
    const userIds = users.map(user => user.user_id);

    let logs;
    if (userIds.length === 0){
      logs = await Log.findAll(); //get all logs if no user IDs exist
    } else {
      logs = await Log.findAll({ where: { user_id: { [Op.in]: userIds } } }); //get logs for existing user IDs only
    }

    logs = logs.sort((a, b) => b.created_at - a.created_at); //sort logs by createdAt
    return res.status(200).json(logs);
  }
  catch (error){
    console.error('Error getting logs:', error);
    return res.status(500).json({ success: false, error: 'Error getting logs.' });
  }
}

const deleteAllLogs = async (req, res) => {
  try {
    const { remarks } = req.body;
    console.log(remarks);
    const logs = await Log.findAll();
    if (!logs) {
      return res.status(404).json({ success: false, error: 'No logs found.' });
    }
    await Log.destroy({ where: {}, force: true });

    const userId = req.user.user_id;

    await createLogEntry(userId, null, LOG_TYPES.SUPER_ADMIN_DELETES_ALL_LOGS, remarks);

    if (createLogEntry) {
      handleDbChange();
      return res.status(200).json({ success: true, message: 'Logs deleted successfully!' });
    }
  } catch (error) {
    console.error('Error deleting logs:', error);
    return res.status(500).json({ success: false, error: 'Error deleting logs.' });
  }
}


module.exports = { createLogEntry, getOwnLogs, getAllLogs, deleteAllLogs, createJetLog};
