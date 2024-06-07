/**
 * Schedule Controller
 * 
 * Handles CRUD for Schedules
 * 
 * @description Added getSchedules and getRoomSchedules
 * @author Eric Conrad Panga
 * @date 04/21/2024
 * 
 * @description Added deleteSchedule
 * @author Rainier John P. Pendon
 * @date 04/23/2024
 * 
 * @description Added editSchedule
 * @author Eric Conrad Panga
 * @date 04/24/2024
 * 
 * @description Added createSchedule and deleteRoomSchedules
 * @author Eric Conrad Panga
 * @date 04/25/2024
 * 
 * @description Added password validators
 * @author Neil Vincent Alday
 * @date 05/01/2024
 * 
 * @description Added deleteAllSchedules
 * @author Ariel Raphael Magno
 * @date 05/05/2024
 * 
 * @description Refactored controllers to use middleware for user retrieval
 * @author Rafa Magno
 * @data 05/10/2024
 * 
 */

/**
 * Handle Database Changes
 * 
 * Signals all clients that the database has been modified
 * 
 * @description Uses SSE Event to alert active clients that the schedule table has changes
 * @author Rheana M. Mindo
 * @date 05/02/2024
 */

/**
 * @description Refactored the messages sent
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

/**
 * Log Entries
 * 
 * @description added creation of logs on create, update, delete of schedule
 * @author Rodolfo P. Flores III
 * @date 05/20/2024
 */

const { Op } = require('sequelize');

const { Schedule } = require('../models/schedule.js');
const { Room } = require('../models/room.js');

const { isRoomAvailable } = require('./request-controller.js');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.js');
const bcrypt = require('bcrypt');
const { createLogEntry } = require('./log-controller.js');
const { LOG_TYPES } = require('../../frontend/src/utilities/constant.js');

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

// Create schedule
const createSchedule = async (req, res) => {
  try {
    const { password, roomName, courseCode, courseTitle, courseSection, faculty, days, startTime, endTime } = req.body;
    const currentUser = req.user;

    // If password is correct, proceed
    const isPasswordValid = await bcrypt.compare(password, currentUser.dataValues.password);
    if (!isPasswordValid) {
        return res.status(401).send({ success: false, message: 'Invalid password.' });
    }

    // Check if the room exists
    const room = await Room.findOne({ where: { room_name: roomName } });
    if (!room) {
      return res.status(404).send({ success: false, message: "Room not found." });
    }
    
    const roomId = room.room_id;
    
    // Check if the combination of room, days of week, and class start and end times is available
    const isAvailable = await Promise.all(days.map(async (day) => {
      const available = await isRoomAvailable(roomId, day, convertTo24HourFormat(startTime), convertTo24HourFormat(endTime));
      return available.success;
    }));

    if (!isAvailable.every(availability => availability)) {
      return res.status(400).send({ success: false, message: "Room is not available on the specified day(s) and time." });
    }

    // Log the data being sent to the database
    console.log("Data to be inserted:", {
      room_id: roomId,
      course_code: courseCode,
      course_title: courseTitle,
      section: courseSection,
      faculty: faculty,
      days_of_week: days,
      class_start_time: convertTo24HourFormat(startTime),
      class_end_time: convertTo24HourFormat(endTime)
    });

    // Proceed with creation
    await Schedule.create({
      room_id: roomId,
      course_code: courseCode,
      course_title: courseTitle,
      section: courseSection,
      faculty: faculty,
      days_of_week: days,
      class_start_time: convertTo24HourFormat(startTime),
      class_end_time: convertTo24HourFormat(endTime)
    });

    // Create log
    await createLogEntry(currentUser.dataValues.user_id, null, LOG_TYPES.SUPER_ADMIN_ADDS_SCHEDULE, `Super Admin created a schedule for room ${roomName}.`);
    handleDbChange();
    res.send({ success: true, message: "Successfully created schedule!" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
}

// Get all schedules
const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll();
    res.status(200).json({ success: true, schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get all schedules of a room
const getRoomSchedules = async (req, res) => {
  try {
    // Check if the room exists
    const room = await Room.findByPk(req.params.roomId);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found.' });
    }

    // Proceed with getting the schedules
    const schedules = await Schedule.findAll({ where: { room_id: req.params.roomId } });
    res.status(200).json({ success: true, schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const editSchedule = async (req, res) => {
  try {
      const { password, roomName, courseCode, courseTitle, section, faculty, daysOfWeek, classStartTime, classEndTime } = req.body;
      const currentUser = req.user;

      // If password is correct, proceed
      const isPasswordValid = await bcrypt.compare(password, currentUser.dataValues.password);
      if (!isPasswordValid) {
          return res.status(401).send({ success: false, message: 'Invalid password.' });
      }

      // Check if the schedule to be edited exists
      const schedule = await Schedule.findByPk(req.params.scheduleId);
      if (!schedule) {
          return res.status(404).send({ success: false, message: "Schedule not found." });
      }

      // Check if the room exists
      const room = await Room.findOne({ where: { room_name: roomName } });
      if (!room) {
          return res.status(404).send({ success: false, message: "Room not found." });
      }

      const roomId = room.room_id;

      // Before checking room availability, exclude the current schedule from the list of schedules 
      const otherSchedules = await Schedule.findAll({
          where: {
              room_id: roomId,
              schedule_id: { [Op.ne]: schedule.schedule_id }  // Exclude the current schedule
          }
      });

      // Check if the combination of room, days of week, and class start and end times is available
      const isAvailable = await Promise.all(daysOfWeek.map(async (day) => {
          // Use isRoomAvailable to check availability without considering the current schedule
          const dayConflicts = otherSchedules.filter(sch => sch.days_of_week.includes(day));
          if (dayConflicts.length === 0) {
              return true;  // No conflicts on this day, the room is available
          }
          return await Promise.all(dayConflicts.map(async sch => {
              // Only check conflicts that are not at the same time as the current schedule
              if (sch.class_start_time < classEndTime && sch.class_end_time > classStartTime) {
                  const available = await isRoomAvailable(roomId, day, classStartTime, classEndTime);
                  return available.success;
              }
              return true;  // No time conflict, so no need to check availability
          })).then(results => results.every(r => r));
      }));

      if (!isAvailable.every(availability => availability)) {
          return res.status(400).send({ success: false, message: "Room is not available on the specified day(s) and time." });
      }

      // Collect fields that are updated
      const updatedFields = [];
      if (roomId !== schedule.room_id) updatedFields.push("room");
      if (courseCode && courseCode !== schedule.course_code) updatedFields.push("course code");
      if (courseTitle && courseTitle !== schedule.course_title) updatedFields.push("course title");
      if (section && section !== schedule.section) updatedFields.push("section");
      if (faculty && faculty !== schedule.faculty) updatedFields.push("faculty");
      if (JSON.stringify(daysOfWeek) !== JSON.stringify(schedule.days_of_week)) updatedFields.push("days of week");
      if (classStartTime && classStartTime !== schedule.class_start_time) updatedFields.push("class start time");
      if (classEndTime && classEndTime !== schedule.class_end_time) updatedFields.push("class end time");

      // Proceed with editing
      await schedule.update({
          room_id: roomId,
          course_code: courseCode,
          course_title: courseTitle,
          section: section,
          faculty: faculty,
          days_of_week: daysOfWeek,
          class_start_time: classStartTime,
          class_end_time: classEndTime
      });

      // Create log entry
      const updatedFieldsString = updatedFields.join(", ");
      await createLogEntry(currentUser.dataValues.user_id, null, LOG_TYPES.SUPER_ADMIN_EDITS_SCHEDULE, `Super Admin edited a schedule of ${courseCode} from room ${roomName}: ${updatedFieldsString}.`);
      handleDbChange();

      res.send({ success: true, message: "Successfully edited schedule!" });
  } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: error.message });
  }
}

// Delete schedule
const deleteSchedule = async (req, res) => {
  try {
      // Check if the schedule exists
      const schedule = await Schedule.findByPk(req.params.scheduleId);
      const { password, roomName } = req.body;
      const currentUser = req.user;
      
      // If password is correct, proceed
      const isPasswordValid = await bcrypt.compare(password, currentUser.dataValues.password);
      if (!isPasswordValid) {
          return res.status(401).send({ success: false, message: 'Invalid password.' });
      }
  
      if (!schedule) {
          return res.status(404).send({ success: false, message: "Schedule not found." });
      }

      const course_code = schedule.course_code;
      let days_of_week = schedule.days_of_week;

      // Join elements with comma if there is more than one element
      if (Array.isArray(days_of_week) && days_of_week.length > 1) {
        days_of_week = days_of_week.join(', ');
      }

      const class_start_time = schedule.class_start_time;
      const class_end_time = schedule.class_end_time;

      // Proceed with soft-deletion
      await schedule.destroy();

      // Create log
      await createLogEntry(currentUser.dataValues.user_id, null, LOG_TYPES.SUPER_ADMIN_DELETES_SCHEDULE, `Super Admin deleted a schedule of ${course_code} from room ${roomName} scheduled on ${days_of_week} at ${class_start_time} - ${class_end_time}.`);
      handleDbChange();
      res.send({ success: true, message: "Successfully deleted schedule!" });
  } catch (error) {
      res.status(500).send({ success: false, message: error.message });
  }
}

// Delete all schedules of a room
const deleteRoomSchedules = async (req, res) => {
  try {
    // Check if the room exists
    const room = await Room.findByPk(req.params.roomId);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found.' });
    }

    // Proceed with deleting the schedules
    await Schedule.destroy({ where: { room_id: req.params.roomId } });
    handleDbChange();
    res.status(200).json({ success: true, message: `Successfully deleted all schedules ${roomName}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Delete all schedules
const deleteAllSchedules = async (req, res) => {
  try {
    const currentUser = req.user;
    
    const { password } = req.body;
    const isPasswordValid = await bcrypt.compare(password, currentUser.dataValues.password);
    if (!isPasswordValid) {
        return res.status(401).send({ success: false, message: 'Invalid password.' });
    }

    const deletedRows = await Schedule.destroy({ where: {}, force: true });
    handleDbChange();

    if (deletedRows === 0) {
      return res.status(404).json({ success: false, error: 'No schedules found to delete.' });
    }
    
    res.status(200).json({ success: true, message: 'Successfully deleted all schedules!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

function convertTo24HourFormat(timeStr) {
  // Split the time string into its components
  let [time, modifier] = timeStr.split(' ');

  // Split the time component into hours and minutes
  let [hours, minutes] = time.split(':');

  // Convert hours to an integer to make modifications easier
  hours = parseInt(hours);

  // Adjust hours for AM/PM
  if (modifier === 'PM' && hours < 12) {
      hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
  }

  // Format hours to two digits
  hours = hours.toString().padStart(2, '0');

  // Return the formatted time string with seconds set to '00'
  return `${hours}:${minutes}:00`;
}
module.exports = { 
  createSchedule: createSchedule,
  getSchedules: getSchedules, 
  getRoomSchedules: getRoomSchedules,
  editSchedule: editSchedule,
  deleteSchedule: deleteSchedule,
  deleteRoomSchedules: deleteRoomSchedules,
  deleteAllSchedules: deleteAllSchedules,
};