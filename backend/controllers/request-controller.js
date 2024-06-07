/**
 * Request Controller
 * 
 * Manages booking and reservation requests including creation, editing, approval, and cancellation functionalities.
 * 
 * @description This module controls all aspects of reservation management within the application.
 * @date 04/16/2024
 */

/**
 * Use of Constants
 * 
 * Refactored file to use constants from constant.js
 * 
 * @description Uses constants from constant.js to ensure consistency and maintainability of the codebase.
 * @author Rheana Mindo
 * @date 04/16/2024
 */

/**
 * @description Allows users to edit pending reservations and cancel any reservations that are not finalized. Verifies room availability by checking for conflicting schedules and existing reservations.
 * @date 04/05/2024
 * 
 * @description Added upload attachments controller, validate file names function, and easy retrieval of user id.
 * @date 04/19/2024
 * 
 * @description Gets request information using request id
 * @date 04/29/2024
 * 
 * @description Gets attachments
 * @date 05/02/2024
 * 
 * @description Gets finalized requests to show in Summary Report
 * @date 05/04/2024
 * 
 * @author Aira Nicole Natividad
 * 
 * @description Removed base64 implementation. Upon upload, attachments now go in cloudinary and upload details are stored in the database instead of base64 information.
 * @author Rodolfo P. Flores III
 * @date 05/04/2024
 * 
 * @description Filter and sort getRequests and getUserReservationRequest
 * showing only ongoing and future events and sorting it by reverse request
 * creation date
 * @author Gacel Perfinian
 * @date 04/24/2024
 */

/**
 * Request Creation
 * 
 * Handles the creation of new reservation requests.
 * 
 * @description Adds new reservation requests into the system, ensuring all necessary data is validated.
 * @author Rafa Magno
 * @date 04/10/2024
 * 
 * @description Allows admin to book a request for GUEST
 * @author Rafa Magno
 * @date 04/28/2024
 */

/**
 * Approval and Finalization
 * 
 * Approves or finalizes reservation requests.
 * 
 * @description Manages the approval and final status updates of reservation requests, including logging activities.
 * @author Joseph Ryan Pena
 * @date 04/10/2024
 */

/**
 * Downloading Attachments
 * 
 * Downloads attachments associated with a reservation request.
 * 
 * @description Allows users to download attachments uploaded for a reservation request in a zip file format.
 * @author Jet Timothy V. Cerezo
 * @date 04/23/2024
 * 
 * @description Download attachments by fetching cloudinary url contained in the request's attachments details in the database.  
 * @author Rodolfo P. Flores III
 * @date 05/04/2024 
*/

/**
 * Get Finalized Requests
 * 
 * Fetches finalized requests
 * 
 * @description Fetches all and specific finalized requests
 * @author Neil Vincent S. Alday
 * @date 04/22/2024
 */

/**
 * Fixed null responses on getRequests and getUserReservationRequest
 *
 * @description Added placeholder description for deleted rooms and null attachments
 * @author Gacel Perfinian
 * @date 04/24/2024
 */

/**
 * Handle Database Changes
 * 
 * Signals all clients that the database has been modified
 * 
 * @description Uses SSE Event to alert active clients that the request table has changes
 * @author Rheana M. Mindo
 * @date 04/25/2024
 */

/**
 * @description Refactored the messages sent
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

/**
 * Cancel Overdue Requests
 * 
 * Disapproves requests that are overdue.
 * 
 * @description This function cancels requests that are pending or approved status that are past their reservation date and time 
 * @author Joseph Ryan Pena
 * @date 05/24/2024
 */


const { Op } = require('sequelize');
const { User } = require('../models/user.js');
const { Request } = require('../models/request.js');
const { Room } = require('../models/room.js');
const { Schedule } = require('../models/schedule.js');
const { Log } = require('../models/log.js');
const { createLogEntry } = require('../controllers/log-controller.js');
const fetch = require('node-fetch');
const cloudinary = require('../config/cloudinary.js');
const archiver = require('archiver');
const { getBaseUrl } = require("../config.js");
const { REQUEST_STATUSES, LOG_TYPES, ROOM_NAMES, USER_TYPES, DAYS_OF_WEEK, CLOUDINARY_FOLDER_NAMES, SUMMARY_REPORT, EMPTY} = require('../../frontend/src/utilities/constant.js');
const { CronJob } = require('cron');


require('dotenv').config();

// SSE Event
const handleDbChange = () => {
  console.log("I've been called");
  fetch(`${process.env.REACT_APP_SERVER_URL}/change`, { 
    method: 'POST',
  })
    .then(response => {
      if (response.ok) {
        console.log('Db change signal sent to server');
      } else {
        console.error('Failed to send Db change signal to server');
        console.log(response)
      }
    })
    .catch(error => {
      console.error('Error occurred while sending Db change signal:', error);
    });
};

// Checks if a room is available for reservation.
const isRoomAvailable = async (roomId, dateOrDayOfWeek, startTime, endTime) => {
    // Check if the input is a date object or a day of the week string
    const dayOfWeek = Object.values(DAYS_OF_WEEK).includes(dateOrDayOfWeek) ?
        dateOrDayOfWeek :
        new Date(dateOrDayOfWeek).toLocaleString('en-US', { weekday: 'long' });

    // Define the operating hours as time strings. Rooms are only available from 7AM - 10PM.
    const openingTime = "07:00:00";
    const closingTime = "22:00:00";

    // Check if the requested times are within the room's operating hours.
    if (startTime < openingTime || endTime > closingTime || endTime <= startTime) {
        // If the requested time is outside 7 AM to 10 PM, or end time is before start time, return false.
        return { success: false, message: 'The room is unavailable because the requested time is outside operating hours (7 AM to 10 PM).' };
    }

    const tempDate = new Date(dateOrDayOfWeek);
    const reservationDate = isNaN(tempDate.getTime()) ? null : tempDate.toISOString().slice(0, 10);

    // Check for overlapping reservation requests
    const overlappingRequests = await Request.findAll({
        where: {
            room_id: roomId,
            reservation_date: reservationDate,
            [Op.or]: [
                {
                    reservation_start_time: { [Op.lt]: endTime },
                    reservation_end_time: { [Op.gt]: startTime },
                },
            ],
            request_status: {
                [Op.in]: [REQUEST_STATUSES.APPROVED, REQUEST_STATUSES.FINALIZED] // Assuming these statuses mean the room is booked
            }
        },
    });

    if (overlappingRequests.length != 0) {
      return { success: false, message: "Room is not available due to an already approved/finalized reservation for the same date and time." };
    }

    // Check for class schedule conflicts
    const classConflict = await Schedule.findOne({
        where: {
            room_id: roomId,
            days_of_week: {
                [Op.contains]: [dayOfWeek]  // This will check if dayOfWeek is an element of the days_of_week array
            },
            [Op.or]: [
                {
                    class_start_time: { [Op.lt]: endTime },
                    class_end_time: { [Op.gt]: startTime },
                },
            ],
        },
    });

    if (classConflict) {
      return { success: false, message: 'The room is not available because it is in conflict with a class schedule.' };
    } // Room is not available due to a class schedule

    return { success: true }; // Room is available
}

const validateFileNames = async (files) => {
  // Format: <Surname><First and Middle Name Initials>_<Document Type>.pdf
  const pattern = /^[A-Z][a-z]+[A-Z]+_(letter|form|receipt|other)\.pdf$/;
  const invalidFiles = files.filter(file => !pattern.test(file.originalname));

  if (invalidFiles.length > 0) {
      // Return a list of invalid file names to provide specific feedback
      return `Invalid file names: ${invalidFiles.map(file => file.originalname).join(', ')}`;
  }

  return null; // Return null if all files are valid
}

const createRequest = async (req,res) => {
  const { room_name, title, purpose, reservation_date, reservation_end_time, reservation_start_time, user_id} = req.body;

  try {
      let userId = user_id || req.user.user_id;

      const user = await User.findOne({
        where: {
          user_id: userId
        }
      });

      const username = user.username;

      const room = await Room.findOne({
      where: {
          room_name: room_name
      }
      });

      if (!room) {
          return res.status(404).send({ success: false, message: 'Room not found.' });
      } 

      // Check if the room is available at a given time
      const available = await isRoomAvailable(room.room_id, reservation_date, reservation_start_time, reservation_end_time);
      if (available.success == false) {
        return res.send({ success: false, message: available.message });
      }

      const request = await Request.create({
          title: title,
          user_id: userId,
          room_id: room.room_id,
          purpose: purpose,
          reservation_date: reservation_date,
          reservation_start_time: reservation_start_time,
          reservation_end_time: reservation_end_time,
      });

      await createLogEntry(userId, request.dataValues.request_id, LOG_TYPES.USER_CREATES_REQUEST, `User ${username} created request ${request.title}.`);
      
      if (createLogEntry) {
          handleDbChange();
          res.status(200).send({ success: true, message: 'Request succesfully created!' });
      }
  } catch (error) {
      console.log(error);
      return res.status(500).send({ success: false, message: 'Internal server error.'});
  }
}

const getRequests = async (req,res) => {
  try {
      const userId = req.user.user_id;
      const [dateNow, timeNow] = (new Date(Date.now() + 8*60*60*1000)).toISOString().slice(0,-5).split('T');
      // Retrieve user requests
      const userRequests = await Request.findAll({
        where: {
            user_id: userId,
            // [Op.or]: [
            //   {
            //     reservation_date: dateNow,
            //     reservation_end_time: {[Op.gte]: timeNow}
            //   },
            //   {
            //     reservation_date: {[Op.gt]: dateNow}
            //   }
            // ]
        },
        order: [
          ['created_at', 'DESC'],
        ],
        paranoid: false
      });
      
      // For retrieval of roomname
      const roomIds = userRequests.map(query => query.room_id);
      const rooms = await Room.findAll({
          where: {
              room_id: roomIds
          },
          attributes: ['room_name', 'room_id']
      });

      // Combining request with room name and user type
      const combinedRequests = userRequests.map(request => {
          const room = rooms.find(room => room.room_id === request.room_id); 
          return {
              ...request.toJSON(),
              room_name: room ? room.room_name : "Deleted Room",
              user_type: req.user.user_type
          };
      });
      res.status(200).send({success: true, requests: combinedRequests});
  } catch (error) {
      console.log(error);
      res.status(500).json({success: false, error: 'Internal Server Error' });
  }
}

const getUserRequestUsingId = async (req,res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findOne({ where: { request_id: requestId } });

    if (request) {
        res.json({ success: true, request: request });
    } else {
        res.status(404).json({ success: false, message: "Request not found." });
    }
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error getting user's request information." });
  }
}

// Edit reservation (can edit room, title, date, starting time, ending time, and purpose)
const editReservation = async (req, res) => {
  const { requestId } = req.params; // Send the request ID as a parameter
  const { userId, room_name, title, date, startTime, endTime, purpose } = req.body;

  try {
    const request = await Request.findOne({
      where: {
        request_id: requestId,
        user_id: userId, // Ensure the reservation belongs to the user
      },
    });

    const user = await User.findOne({
      where: {
        user_id: userId
      }
    });

    const username = user.username;
    // Check if the reservation exists
    if (!request) {
      return res.status(404).json({success: false, message: 'Reservation not found.' });
    }

    // Option can only be available if the status is pending
    if (request.request_status !== REQUEST_STATUSES.PENDING) {
      return res.status(400).json({success: false, message: 'Reservation cannot be edited unless it is pending.' });
    }

    const roomID = await Room.findOne({
      where: {
        room_name: room_name
      }

    });

    // Check if the room exists
    const room = await Room.findByPk(roomID.room_id);
    if (!room) {
      return res.status(404).json({success: false, message: 'Room not found.' });
    }

    // Check if the room is available at a given time
    const available = await isRoomAvailable(roomID.room_id, date, startTime, endTime);
    if (available.success == false) {
      return res.send({ success: false, message: available.message });
    }

    // Update the reservation
    await request.update({
      room_id: roomID.room_id,
      title: title,
      reservation_date: date,
      reservation_start_time: startTime,
      reservation_end_time: endTime,
      purpose: purpose,
    });

    await createLogEntry(userId, requestId, LOG_TYPES.USER_UPDATES_REQUEST, `User ${username} successfully updated their request ${request.title}.`);

    if (createLogEntry) {
      handleDbChange();
      res.status(200).send({success: true, message: 'Reservation updated and log entry created successfully!' });
    }

  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({success: false, message: 'Error updating reservation.' });
  }
}

// Cancel reservation 
const cancelReservation = async (req, res) => {
  const { requestId } = req.params; // Assuming the request ID is passed in the URL
  const { userId, remarks } = req.body;

  try {
    // First, find the request to check its current status
    const request = await Request.findOne({
      where: {
        request_id: requestId,
        user_id: userId, // Ensure the reservation belongs to the user
      },
    });

    const user = await User.findOne({
      where: {
        user_id: userId
      }
    });

    const username = user.username;

    // If no request is found, respond accordingly
    if (!request) {
      return res.status(404).json({success: false, message: 'Reservation not found or user mismatch.' });
    }

    // Check if the reservation request is already finalized
    if (request.request_status === REQUEST_STATUSES.FINALIZED) {
      return res.status(403).json({success: false, message: 'Finalized reservations cannot be canceled.' });
    }

    // Combine the reservation date and start time into a single Date object
    const reservationDateTime = new Date(`${request.reservation_date}T${request.reservation_start_time}`);

    // Calculate the difference between the reservation datetime and the current datetime
    const currentDate = new Date();
    const timeDiff = reservationDateTime - currentDate;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    // Check if the reservation is less than 3 days away
    if (request.request_status == REQUEST_STATUSES.APPROVED && daysDiff < 3) {
      return res.status(403).json({success: false, message: 'Reservations cannot be canceled less than 3 days in advance.' });
    }

    // Update request status to Cancelled
    await Request.update({
      request_status: REQUEST_STATUSES.CANCELLED
    }, {
      where: {
        request_id: requestId, 
        user_id: userId        
      }
    });

    // Proceed to delete the reservation request since it's not finalized
    await Request.destroy({
      where: {
        request_id: requestId,
      },
    });

    // Log the cancellation
    await createLogEntry(userId, requestId, LOG_TYPES.USER_CANCELS_REQUEST, remarks);

    handleDbChange();
    
    return res.status(200).send({success: true, status: REQUEST_STATUSES.CANCELLED, message: 'Reservation canceled successfully!' });
  } catch (error) {
    console.error('Error canceling reservation:', error);
    return res.status(500).json({success: false, message: 'Failed to cancel reservation.' });
  }
};

const getUserReservationRequest = async (req,res) =>  {
  try {  

      // const [dateNow, timeNow] = (new Date(Date.now() + 8*60*60*1000)).toISOString().slice(0,-5).split('T');
      const reservationRequests = await Request.findAll({
        // where: {
        //   [Op.or]: [
        //     {
        //       reservation_date: dateNow,
        //       reservation_end_time: {[Op.gte]: timeNow}
        //     },
        //     {
        //       reservation_date: {[Op.gt]: dateNow}
        //     }
        //   ]
        // },
        order: [
          ['created_at', 'DESC'],
        ],
        paranoid: false
      });
      const processingPromises = reservationRequests.map(async (currentReservation) => {
          const currentRoom = await Room.findOne({ where: { room_id: currentReservation.room_id } });
          const user = await User.findOne({where: {user_id: currentReservation.user_id}});
          const reservation = {
              reservationId: currentReservation.request_id,
              userType: USER_TYPES.ADMIN,
              userId: currentReservation.user_id,
              username: user.username,
              status: currentReservation.request_status,
              title: currentReservation.title,
              attachmentCount: currentReservation.attachments ? currentReservation.attachments.length : 0,
              details: currentReservation.purpose,
              location: currentRoom ? currentRoom.room_name : "Deleted Room",
              date: currentReservation.reservation_date,
              startTime: currentReservation.reservation_start_time,
              endTime: currentReservation.reservation_end_time,
          };
          return reservation;
      });
      
      // Wait for all processing promises to resolve
      const processedReservations = await Promise.all(processingPromises);
      
      const requestsArr = processedReservations;
      res.send({reservationRequests: requestsArr, success: true, message: "Successfully get all reservation requests!"});
  } catch (error) {
      res.send({success: false, error: 'Error occurred while fetching reservation requests: '+ error});
  }
}

const autoDisapprove = async (approvedRequest) => {
  const conflictingRequests = await Request.findAll({
    where: {
      room_id: approvedRequest.room_id,
      reservation_date: approvedRequest.reservation_date,
      [Op.or]: [
        {
          reservation_start_time: { [Op.lt]: approvedRequest.reservation_end_time },
          reservation_end_time: { [Op.gt]: approvedRequest.reservation_start_time },
        },
      ],
      request_status: REQUEST_STATUSES.PENDING  // Assuming that only pending requests can be disapproved automatically
    }
  });

  for (const request of conflictingRequests) {
    await Request.update({ request_status: REQUEST_STATUSES.DISAPPROVED }, {
      where: {
        request_id: request.request_id
      }
    });

    await createLogEntry(request.user_id, request.request_id, LOG_TYPES.ADMIN_DISAPPROVES_REQUEST, "Auto-disapproved due to conflict with another approved reservation.");
  }
};

const approveReservationRequest = async (req, res) => {
  const requestId = req.params.requestId;
  const userId = req.body.userId;
  const remarks = req.body.remarks;

  try {
      const request = await Request.findOne({
        where: {
          request_id: requestId
        }
      });
      
      const available = await isRoomAvailable(request.room_id, request.reservation_date, request.reservation_start_time, request.reservation_end_time);
      if (available.success == false) {
        return res.send({ success: false, message: available.message });
      }

      const approve = await Request.update({ request_status: REQUEST_STATUSES.APPROVED }, {
          where: {
            request_id: requestId
          }
      });
      
      await createLogEntry(userId, requestId, LOG_TYPES.ADMIN_APPROVES_REQUEST, `Admin approved request ${requestId}.`);
      await autoDisapprove(request);
      handleDbChange();
      res.send({ success: true, message: "Successfully approved reservation request and created log!" });
  } catch (error) {
      res.send({ success: false, error: 'An error occurred while approving reservation request.' });
  }
};


const finalizeReservationRequest = async (req,res) => {
  const requestId = req.params.requestId;
  const userId = req.body.userId;
  const remarks = req.body.remarks;

  try{
    const finalizeRequest =  await Request.update({request_status: REQUEST_STATUSES.FINALIZED},{
        where: {
            request_id: requestId
        }
    });

    await createLogEntry(userId, requestId, LOG_TYPES.ADMIN_FINALIZES_REQUEST, `Admin finalized request ${requestId}.`);
    handleDbChange();
    res.send({success: true, message: "Successfully finalized reservation request and created log!"});
  }catch (error){
      res.send({success: false, error: 'An error occurred while finalizing reservation request.'});
  }

}

const disapproveReservationRequest = async (req,res) => {
  const requestId = req.params.requestId;
  const userId = req.body.userId;
  const remarks = req.body.remarks;

  try{
      // if(!remarks){
      //     res.status(500).send({ success: false, error: 'Remarks cannot be empty'});
      // }

      const disapproveRequest =  await Request.update({request_status: REQUEST_STATUSES.DISAPPROVED},{
          where: {
              request_id: requestId
          }
      });
      const requestLog = await Log.create({
          user_id:userId,
          request_id:requestId,
          log_type: LOG_TYPES.ADMIN_DISAPPROVES_REQUEST,
          remarks:remarks
      });

      handleDbChange();
      res.send({success: true, message: "Successfully disapproved reservation request and created log!"});
  }catch (error){
      res.send({success: false, error: 'An error occurred while disapproving reservation request.'});
  }

}

const deleteReservationRequest = async (req,res) => {
  const requestId = req.params.requestId;
  const userId = req.body.userId;
  const remarks = req.body.remarks;

  try{
      // if(!remarks){
      //     res.status(500).send({ success: false, error: 'Remarks cannot be empty'});
      // }
      const deleteRequest =  await Request.destroy({
          where: {
              request_id: requestId
          },
          force: true
      });
      if (!deleteRequest) {
          return res.send({ success: false, message: 'Reservation not found.' });
      }

      handleDbChange();
      const createLog = await createLogEntry(userId, null, LOG_TYPES.ADMIN_DELETES_REQUEST, remarks);
      if (!createLog) {
          return res.send({ success: false, message: 'Failed to create log entry.' });
      }
      res.send({success: true, message: "Successfully deleted reservation request and created log!"});
  }catch (error){
      res.send({success: false, error: 'An error occurred while deleting reservation request.'});
  }
}

const uploadAttachments = async (req, res) => {
  try {
    // const userId = req.body.userId;
    const userId = req.user.user_id
    const requestId = req.params.requestId;

    // Find the specific request
    const request = await Request.findOne({
      where: {
        request_id: requestId,
        user_id: userId
      }
    });

    const user = await User.findOne({
      where: {
        user_id: userId
      }
    });

    const username = user.username;

    if (!request) {
       res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }

    // Validate file names
    const error = await validateFileNames(req.files);
    if (error) {
      return res.status(404).json({ success: false, message: error });
    }

    const folderPath = `${CLOUDINARY_FOLDER_NAMES.ATTACHMENTS}/REQ-${requestId.slice(0, 8).toUpperCase()}`;

    // Setup attachments
    const attachments = await Promise.all(req.files.map(async (file) => {
        // Construct a custom public_id equal to original file name
        const customPublicId = file.originalname.split('.')[0]; // File extension removed

        // Upload each file to Cloudinary
        const attachment = await cloudinary.uploader.upload(file.path, { folder: folderPath, public_id: customPublicId});
        // Store these as values of each object in attachments
        return {
        originalname: file.originalname, // Used for the rest of code for this function
        attachment: attachment.public_id, // attachment file path in cloudinary 
        url: attachment.url // dependency for download functionality
        };
    }));

    // Initialize counters for file types
    let receiptCount = 0, formCount = 0, letterCount = 0, otherCount = 0;

    attachments.forEach(file => {
      if (file.originalname.includes("receipt")) {
        receiptCount++;
      } else if (file.originalname.includes("form")) {
        formCount++;
      } else if (file.originalname.includes("letter")) {
        letterCount++;
      } else if (file.originalname.includes("other")) {
        otherCount++;
      }
    });

    // Validate file count and types when there are no existing attachments
    if (request.attachments === null) {
      if (receiptCount !== 1 || formCount !== 1 || letterCount !== 1 || otherCount > 1) {
        return res.status(400).json({
          success: false,
          message: 'Please upload exactly one each of receipt, form, and letter, and at most one of other.'
        });
      }
    }

    let updatedAttachments = request.attachments ? [...request.attachments] : [];

    if (request.attachments === null || updatedAttachments.length === 0) {
      updatedAttachments = attachments.map(file => JSON.stringify(file));
    } else {
      // Validate file count and types
      if (receiptCount > 1 || formCount > 1 || letterCount > 1 || otherCount > 1) {
        return res.status(400).json({
          success: false,
          message: 'Please upload exactly one each of receipt/form/letter/other.'
        });
      }

      const types = ["receipt", "form", "letter", "other"];
      types.forEach(type => {
        const newFile = attachments.find(file => file.originalname.includes(type));
        if (newFile) {
          // Remove the existing entry of the same type
          updatedAttachments = updatedAttachments.filter(file => !JSON.parse(file).originalname.includes(type));
          // Add the new entry
          updatedAttachments.push(JSON.stringify(newFile));
        }
      });
    }

    // Update the database
    const update = await request.update({
      attachments: updatedAttachments 
    });
    if (!update) {
      return res.status(500).json({ success: false, message: 'Failed to update attachments.' });
    }

    // Create log entry
    const log = await createLogEntry(userId, requestId, LOG_TYPES.USER_UPLOADS_FILES, `User ${username} uploaded ${attachments.length} attachments.`);
    if (!log) {
      return res.status(500).send({ success: false, message: 'Failed to create log entry.' });
    }

    handleDbChange();
    return res.status(200).json({ success: true, message: 'Attachments updated successfully!', attachments: updatedAttachments.map(file => JSON.parse(file)) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to upload attachments.', error: error.toString() });
  }
};

const downloadAttachments = async (req, res) => {
    try {
      const userId = req.params.userId;
      const requestId = req.params.requestId;
  
      const request = await Request.findOne({
        where: {
          request_id: requestId,
          user_id: userId
        }
      });
  
      if (!request) {
        return res.status(404).json({ success: false, message: 'Reservation not found.' });
      }
  
      const attachments = request.attachments || [];
      if (attachments.length === 0) {
        return res.status(404).json({ success: false, message: 'No attachments found.' });
      }
  
      const archive = archiver('zip', {
        zlib: { level: 9 } // Compression level
      });
    
      const zipFileName = `attachments-${requestId}.zip`;
      res.attachment(zipFileName);
      archive.pipe(res);
  
      // Download each attachment from Cloudinary and add to the archive
        for (const attachmentJson of attachments) {
            const attachment = JSON.parse(attachmentJson);
            const response = await fetch(attachment.url);

            if (!response.ok) {
                console.error(`Failed to download ${attachment.originalname}: ${response.statusText}`);
                continue; // Skip this file and continue with others
            }

            const stream = response.body;
            console.log("Stream", stream)
            archive.append(stream, { name: attachment.originalname });  // Extracts the file name from the path and sets it as the name in the zip
        }

        // Listen for all archives data to be written
        archive.on('error', err => {
            throw err;
        });
  
        archive.finalize().then(() => {
            console.log('Archive finalized and sent successfully.');
        }).catch(err => {
            console.error('Error finalizing archive:', err);
            res.status(500).json({ success: false, message: 'Failed to finalize archive.' });
        });
        return res.status(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to download attachments.' });
    }
  };

function toISOFormat(date, time) {
  const [hours, minutes] = time.split(':');

  // Create a new Date object using date and time components
  const dateTime = new Date(date);
  dateTime.setHours(parseInt(hours));
  dateTime.setMinutes(parseInt(minutes));
  dateTime.setSeconds(0);
  dateTime.setMilliseconds(0);

  // Return the formatted ISO string
  const isoDate = dateTime.toISOString();
  return isoDate.substring(0, 16) + ':00';
}

const getAttachments = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findOne({
      where: {
        request_id: requestId
      }
    });

    if (request && request.attachments && request.attachments.length > 0) {
      const urls = request.attachments.map(attachment => {
        const attachmentInfo = JSON.parse(attachment);
        const publicId = attachmentInfo.attachment; // extract the public id

        // Generating a URL that returns the first page of the PDF as an image
        return cloudinary.url(publicId, {
          secure: true,
          resource_type: 'image',  // changed from 'raw' to 'image'
          format: 'jpg',          // the image format
          flags: 'attachment',    // optionally prompts the file to be downloaded
          pages: 1                // which page of the PDF to convert
        });
      });

      res.status(200).send({ success: true, urls: urls });
    } else {
      res.status(404).send({ success: false, message: "No attachments found or invalid request ID." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error occurred while fetching attachments." });
  }
};


// Fetches all finalized requests
const getFinalizedRequests = async (req, res) => {
  try {
      // Fetch all requests with status "Finalized"
      const finalizedRequests = await Request.findAll({where: { request_status: "Finalized" }});

      // Use Promise.all to efficiently fetch room details for each request
      const calendarFR = await Promise.all(finalizedRequests.map(async (request) => {
          // Fetch room details for each request
          const room = await Room.findOne({
              where: { room_id: request.room_id },
              attributes: ['room_name']
          });

          // Map request to calendar format including room details
          return {
              title: request.title,
              start: toISOFormat(request.reservation_date, request.reservation_start_time),
              end: toISOFormat(request.reservation_date, request.reservation_end_time),
              room: room.room_name
          };
      }));
      
      // Send the mapped requests as a response
      res.status(200).send({ success: true, requests: calendarFR });
  } catch (error) {
      // Handle errors appropriately
      res.status(500).send({ success: false, message: error.message });
  }
};

// Fetches all finalized requests in a specific room
const getRoomFinalizedRequests = async (req, res) => {
  try {
      const room_name = req.params.roomName;
      const roomId  = await Room.findOne({where: {room_name: room_name}});
      const finalizedRequests = await Request.findAll({where: {room_id: roomId.room_id, request_status: "Finalized"}});

      // Use Promise.all to efficiently fetch room details for each request
      const calendarFR = await Promise.all(finalizedRequests.map(async (request) => {
        // Map request to calendar format including room details
        return {
            title: request.title,
            start: toISOFormat(request.reservation_date, request.reservation_start_time),
            end: toISOFormat(request.reservation_date, request.reservation_end_time),
            room: room_name
        };
      }));

      res.status(200).send({ success: true, requests: calendarFR });
  } catch (error) {
      res.status(500).send({ success: false, message: error.message });
  }
};

const getFinalizedRequestsSR = async (req, res) => {
  try {
    // get all finalized requests
    const finalizedRequests = await Request.findAll({ 
      where: { 
        request_status: REQUEST_STATUSES.FINALIZED,
        reservation_date: {
          [Op.between]: [SUMMARY_REPORT.SEM_START, SUMMARY_REPORT.SEM_END] // Use Op.between for date range
        } 
      } 
    });
  
    // Create an array of promises for each room processing
    const requestPromises = finalizedRequests.map(async (request) => {
      const room = await Room.findByPk(request.room_id);
      const user = await User.findByPk(request.user_id);

      // make time readable like 4:00 PM
      const startTime = new Date(`2021-01-01T${request.reservation_start_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      const endTime = new Date(`2021-01-01T${request.reservation_end_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });    

      // change date format to MM/DD/YYYY
      const date = new Date(request.reservation_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      return {
        room: room.room_name, // Assuming each room has a 'room_name' field
        date: date,
        eventTitle: request.title,
        startTime: startTime,
        endTime: endTime,
        reservedBy: user ? user.username : "Deleted User",
      };
    });

     // Use Promise.all to wait for all promises in the array to resolve
    const finalizedRequestsData = await Promise.all(requestPromises);

    // sort by date and start time
    finalizedRequestsData.sort((a, b) => {
      if (a.date === b.date) {
        return a.startTime.localeCompare(b.startTime);
      }
      return a.date.localeCompare(b.date);
    });

    res.send({ success: true, finalizedRequestsData });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
}

const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      order: [
        ['created_at', 'DESC'],
      ],
    });

    res.status(200).send({ success: true, requests: requests });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Failed to fetch all requests.' });
  }
}

const cancelOverdueRequests = async (req, res) => {
  try {
    // const [dateNow, timeNow] = (new Date(Date.now() + 8 * 60 * 60 * 1000)).toISOString().slice(0, -5).split('T');

    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'
    const currentTimeStr = currentDate.toISOString().slice(11, 19); // Format as 'HH:MM:SS'

    const overdueRequests = await Request.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { request_status: REQUEST_STATUSES.PENDING },
              { request_status: REQUEST_STATUSES.APPROVED }
            ]
          },
          {
            reservation_date: {
              [Op.lt]: currentDateStr  // Check if the reservation date is before today's date as 'YYYY-MM-DD'
            }
          },
          {
            [Op.or]: [
              // Include the time check only if the reservation date is today
              {
                [Op.and]: [
                  { reservation_date: currentDateStr },
                  { reservation_end_time: { [Op.lt]: currentTimeStr } } // Check if time is before current time as 'HH:MM:SS'
                ]
              },
              // Or the reservation date itself is before today
              {
                reservation_date: {
                  [Op.lt]: currentDateStr
                }
              }
            ]
          }
        ]
      }
    });

    if(overdueRequests.length === 0) {
      return res.send({ success: false, message: 'No overdue requests to cancel.' });
    }

    for (const request of overdueRequests) {
      await Request.update({ request_status: REQUEST_STATUSES.CANCELLED}, {
        where: {
          request_id: request.dataValues.request_id
        }
      });
      
      await createLogEntry(request.dataValues.user_id, request.dataValues.request_id, LOG_TYPES.ADMIN_CANCELS_OVERDUE_REQUESTS, "Request automatically canceled due to being overdue.");
      
    }

    handleDbChange();
    res.send({ success: true, message: 'Overdue requests canceled successfully.' });
  } catch (error) {
      res.send({success: false, message: 'Error occurred while canceling overdue requests.'});
  }
}



module.exports = { 
  getAllRequests: getAllRequests,
  isRoomAvailable: isRoomAvailable,
  editReservation: editReservation, 
  cancelReservation: cancelReservation, 
  getRequests: getRequests, 
  getUserRequestUsingId: getUserRequestUsingId,
  createRequest: createRequest,     
  getUserReservationRequest: getUserReservationRequest,
  approveReservationRequest: approveReservationRequest,
  finalizeReservationRequest: finalizeReservationRequest,
  disapproveReservationRequest: disapproveReservationRequest,
  deleteReservationRequest: deleteReservationRequest,
  uploadAttachments: uploadAttachments,
  getFinalizedRequests: getFinalizedRequests,
  getRoomFinalizedRequests: getRoomFinalizedRequests,
  downloadAttachments: downloadAttachments,
  getAttachments: getAttachments,
  getFinalizedRequestsSR: getFinalizedRequestsSR,
  cancelOverdueRequests: cancelOverdueRequests
};  