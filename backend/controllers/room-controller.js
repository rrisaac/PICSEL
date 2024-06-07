/**
 * Get Room, Get Datas for Summary Reports
 * @description Fetches all rooms and updates room images
 * @date 04/22/2024
 * 
 * @description Fetches and calculates room usage overview and the generated revenue for each room
 * @date 05/04/2024 
 * 
 * @author Aira Nicole Natividad
**/

/**
 * @description Added controller to create a room
 * @author Rafa Magno
 * @date 04/23/2024
 */

/**
 * Edit Room Controller
 * 
 * Edits the room details of a specific room in the database
 * 
 * @description Edits the room details of a specific room in the database, check first if the password is valid, then update the room details
 * @author Joseph Ryan Pena
 * @date 04/21/2024
 *
 */

/**
* Delete Room
* 
* @description Deletes a room unless the room has unfinished finalized requests
* @author Rodolfo P. Flores III
* @date 04/23/2024
*
**/

/**
* Cloudinary implementation
* 
* @description Used cloudinary for image storage
* @author Rainier Pendon
* @date 05/01/2024
*
* @description fixed bugs regarding adding rooms and editing rooms 
* @author Joseph Ryan P. Peña
* @date 05/03/2024
*
* @description Implemented deletion of previous images in Cloudinary for editing rooms
* @author Rainier Pendon
* @date 05/04/2024
*
**/

/**
 * Handle Database Changes
 * 
 * Signals all clients that the database has been modified
 * 
 * @description Uses SSE Event to alert active clients that the request table has changes
 * @author Rheana M. Mindo
 * @date 05/06/2024
 */

/** 
* Refactor 
* 
* @description Refactored controllers to use middleware for user retrieval
* @author Rafa Magno
* @data 05/10/2024
*/
/**
 * @description Refactored the messages sent
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */
/**
 * Log Entries
 * 
 * @description added creation of logs on create, update, delete of room
 * @author Rodolfo P. Flores III
 * @date 05/20/2024
 */

const { Room } = require('../models/room.js');
const { Request } = require('../models/request.js');
const { User } = require('../models/user.js');
const sequelize = require('../config/postgres.js');
const { Op } = require('sequelize');
const { REQUEST_STATUSES, LOG_TYPES, ROOM_NAMES, USER_TYPES, DAYS_OF_WEEK, CLOUDINARY_FOLDER_NAMES, IMAGE_DIMENSIONS, SUMMARY_REPORT} = require('../../frontend/src/utilities/constant.js');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary.js');
const { v4: uuidv4 } = require('uuid');
const { createLogEntry } = require('./log-controller.js');


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

  const editRoom = async (req, res) => {
    const {password, room_type, room_name, description, utility_worker, utility_fee, capacity, rate} = req.body;
    const room_id = req.params.roomId;
    const amenities = JSON.parse(req.body.amenities);

    try {
        const currentUser = req.user;

        const isPasswordValid = await bcrypt.compare(password, currentUser.dataValues.password);
        if (!isPasswordValid) {
            return res.status(401).send({ success: false, message: 'Invalid password.' });
        }

        const currentRoom = await Room.findOne({where: {room_id: room_id}});
        if (!currentRoom) {
            return res.status(404).send({ success: false, message: 'Room not found.' });
        }

        let uploadedImages = [];

        if(req.files.length > 0) {
            // Delete previous images
            for(let image of currentRoom.images) {
                await cloudinary.uploader.destroy(image);
            }

            // Upload images to cloudinary
            for(let file of req.files) {
                const publicId = room_name + '_' + uuidv4().split("-")[0];
                const image = await cloudinary.uploader.upload(file.path, {
                    public_id: publicId,
                    folder: CLOUDINARY_FOLDER_NAMES.ROOM_PICTURES,
                    transformation:[
                        {width: IMAGE_DIMENSIONS.ROOM_IMAGE_WIDTH, height: IMAGE_DIMENSIONS.ROOM_IMAGE_HEIGHT, crop: "fit"}
                    ]
                });
                uploadedImages.push(image.public_id);
            }
        } else {
            uploadedImages = currentRoom.images;
        }

        const newRoom = {
            room_type: room_type,
            room_name: room_name,
            description: description,
            amenities: amenities,
            images: uploadedImages,
            utility_worker: utility_worker,
            utility_fee: utility_fee,
            capacity: capacity,
            rate: rate
        };

        await Room.update(newRoom, {where: {room_id: room_id}});

        // Add room_id to newRoom object
        newRoom.room_id = room_id;

        // Update image urls
        for (let i = 0; i < newRoom.images.length; i++) {
            const imageUrls = cloudinary.url(newRoom.images[i], {
                httpOnly: true,
                secure: true, // Use HTTPS
                sameSite: 'None' // Set sameSite attribute to 'None'
            });
            newRoom.images[i] = imageUrls;
        }

        // Collect fields that were updated
        const updatedFields = [];
        if (room_type !== currentRoom.room_type) updatedFields.push("room type");
        if (room_name !== currentRoom.room_name) updatedFields.push("room name");
        if (description !== currentRoom.description) updatedFields.push("description");
        if (JSON.stringify(amenities) !== JSON.stringify(currentRoom.amenities)) updatedFields.push("amenities");
        if (uploadedImages.join(',') !== currentRoom.images.join(',')) updatedFields.push("images");
        if (utility_worker !== currentRoom.utility_worker) updatedFields.push("utility worker");
        if (utility_fee !== currentRoom.utility_fee) updatedFields.push("utility fee");
        if (capacity !== currentRoom.capacity) updatedFields.push("capacity");
        if (rate !== currentRoom.rate) updatedFields.push("rate");

        // Create log
        const updatedFieldsString = updatedFields.join(", ");
        await createLogEntry(currentUser.dataValues.user_id, null, LOG_TYPES.SUPER_ADMIN_EDITS_ROOM, `Super Admin updated ${room_name}'s ${updatedFieldsString}.`);
        
        handleDbChange();
        return res.status(200).send({ success: true, newRoom: newRoom, message: 'Room updated successfully!' });

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
}


const getRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();

        for (let room of rooms) {
            const imageUrls = await Promise.all(room.images.map(async publicId => {
                return cloudinary.url(publicId, {
                  httpOnly: true,
                  secure: true, // Use HTTPS
                  sameSite: 'None' // Set sameSite attribute to 'None'
                });
              }));
            room.images = imageUrls;
          }

        res.status(200).send({ success: true, rooms: rooms });
        
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

const updateRoomImages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).send({ success: false, message: "Room not found." });
        }
    
        const publicId = room.room_name + '_' + uuidv4().split("-")[0]

        const result = await cloudinary.uploader.upload(req.file.path, {
            public_id: publicId,
            folder: CLOUDINARY_FOLDER_NAMES.ROOM_PICTURES,
        })

        const update = await room.update({
            images: [result.public_id]
        });

        if (!update) {
            return res.status(500).send({ success: false, message: "Failed to update room images." });
        }

        res.status(200).send({ success: true, room: room });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}

const deleteRoom = async(req, res) => { 
    const { password, roomName } = req.body;
    const { roomId } = req.params;
    try {
        const currentUser = req.user;

        // Password validation for room delete
        const isPasswordValid = await bcrypt.compare(password, currentUser.dataValues.password);
        if (!isPasswordValid) {
            return res.status(401).send({ success: false, message: 'Invalid password.' });
        }

        // ROOM DELETION
        const room = await Room.findOne({ where: { room_id: roomId } });
        if (room) {
    
        // Check for unfinished finalized requests associated with the room
        const unfinishedFinalizedRequests = await Request.findAll({
            where: {
                room_id: roomId,
                request_status: 'Finalized',
                // localtimestamp is less than or equal end time of request (event's not finished yet)
                [Op.and]: sequelize.literal(`LOCALTIMESTAMP <= ("Request"."reservation_date" + date_trunc('second', "Request"."reservation_end_time"::time))`)
            },
            attributes: ['request_id']
        });

        // If there are any unfinished finalized requests, prevent deletion
        if (unfinishedFinalizedRequests.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete room: there are finalized requests that are not yet completed."
            });
        }
        
        const result = cloudinary.uploader.destroy(room.images[0])
        
        // Proceed to deletion
        await Room.destroy({ 
            where: { room_id: roomId },
            force: true //to hard delete
        });

        // Create log
        await createLogEntry(currentUser.dataValues.user_id, null, LOG_TYPES.SUPER_ADMIN_DELETES_ROOM, `Super Admin deleted room ${roomName}.`);
        handleDbChange();
        res.status(200).send({ success: true, message: 'Room deleted successfully!' });

    } else {
      res.status(404).json({ success: false, message: "Room not found." });
    } 
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting room." });
  }
};

const createRoom = async (req, res) => {

    const { password, room_type, room_name, description,  utility_worker, utility_fee, capacity, rate } = req.body;
    // parsed amenities from string to array
    const amenities = JSON.parse(req.body.amenities)
  try {

    const currentUser= req.user;

    const isPasswordValid = await bcrypt.compare(password, currentUser.dataValues.password);
    if (!isPasswordValid) {
        return res.status(401).send({ success: false, message: 'Invalid password.' });
    }

    let uploadedImages = [];
    
    for(let file of req.files){
        const publicId = room_name + '_' + uuidv4().split("-")[0];
        const image = await cloudinary.uploader.upload(file.path, {
            public_id: publicId,
            folder: CLOUDINARY_FOLDER_NAMES.ROOM_PICTURES,
            transformation:[
                {width: IMAGE_DIMENSIONS.ROOM_IMAGE_WIDTH, height: IMAGE_DIMENSIONS.ROOM_IMAGE_HEIGHT, crop: "fit"}
            ]
        });
        uploadedImages.push(image.public_id)
    }

    const newRoom = {
      room_type: room_type,
      room_name: room_name,
      description: description,
      amenities: amenities,
      images: uploadedImages,
      utility_worker: utility_worker,
      utility_fee: utility_fee,
      capacity: capacity,
      rate: rate
    };
    
    const createdRoom = await Room.create(newRoom);
    const roomId = createdRoom.room_id;

    newRoom.room_id = roomId;

    for (let i = 0; i < newRoom.images.length; i++) {
        const imageUrls = cloudinary.url(newRoom.images[i], {
            httpOnly: true,
            secure: true, // Use HTTPS
            sameSite: 'None' // Set sameSite attribute to 'None'
        });
        newRoom.images[i] = imageUrls;
    }

    // Create log entry
    await createLogEntry(currentUser.dataValues.user_id, null, LOG_TYPES.SUPER_ADMIN_ADDS_ROOM, `Super Admin created room ${room_name}.`);
    handleDbChange();
    return res.status(201).send({ success: true, newRoom:newRoom, message: 'Room created successfully!' });
  } catch (error) {
    console.log(error)
    return res.status(500).send({ success: false, message: error.message });
  }
}

const getRoomUsageOverview = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        
        // Create an array of promises for each room processing
        const overviewPromises = rooms.map(async (room) => {
            // where room.reservation_date is between SEM_START and SEM_END
            const requests = await Request.findAll({
                where: {
                    room_id: room.room_id,
                    request_status: REQUEST_STATUSES.FINALIZED,
                    reservation_date: {
                        [Op.between]: [SUMMARY_REPORT.SEM_START, SUMMARY_REPORT.SEM_END] // Use Op.between for date range
                    }
                }
            });

            const totalReservations = requests.length;
            const totalDuration = requests.reduce((acc, request) => {
                // Parsing the start and end time directly from the time strings
                const startHour = parseInt(request.reservation_start_time.split(':')[0], 10);
                const endHour = parseInt(request.reservation_end_time.split(':')[0], 10);
            
                // Calculate duration in hours directly
                const duration = endHour - startHour;
    
                // Accumulate the total duration
                return acc + duration;
            }, 0);
            const averageDuration = totalReservations > 0 ? parseFloat((totalDuration / totalReservations).toFixed(2)) : 0;
            
            return {
                room: room.room_name,
                totalReservations,
                totalDuration,
                averageDuration
            };
        });

        // Use Promise.all to wait for all promises in the array to resolve
        const overviewData = await Promise.all(overviewPromises);

        // Sort the overview data alphabetically by the room name. Handles numerical parts for natural sorting
        overviewData.sort((a, b) => {
            return a.room.localeCompare(b.room, undefined, { numeric: true, sensitivity: 'base' });
        });

        res.send({ success: true, overviewData });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
}

const getRevenueGeneration = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        
        // Create an array of promises for each room processing
        const revenuePromises = rooms.map(async (room) => {
            const requests = await Request.findAll({
                where: {
                    room_id: room.room_id,
                    request_status: REQUEST_STATUSES.FINALIZED,
                    reservation_date: {
                        [Op.between]: [SUMMARY_REPORT.SEM_START, SUMMARY_REPORT.SEM_END]
                    }
                }
            });
        
            const totalReservations = requests.length;
            const totalRevenue = requests.reduce((acc, request) => {
                const startHour = parseInt(request.reservation_start_time.split(':')[0], 10);
                const endHour = parseInt(request.reservation_end_time.split(':')[0], 10);
                const duration = endHour - startHour;
        
                const rate = parseFloat(room.rate) || 0;
                const utilityFee = parseFloat(room.utility_fee) || 0;
                const revenue = (rate + utilityFee) * duration;
        
                console.log("Duration:", duration, "Rate:", rate, "Utility Fee:", utilityFee, "Revenue:", revenue);
                
                return acc + revenue;
            }, 0);
        
            const averageRevenue = totalRevenue > 0 ? parseFloat((totalRevenue / totalReservations).toFixed(2)) : 0;
            
            return {
                room: room.room_name,
                totalReservations,
                totalRevenue,
                averageRevenue
            };
        });        

        // Use Promise.all to wait for all promises in the array to resolve
        const revenueData = await Promise.all(revenuePromises);

        // Sort the overview data alphabetically by the room name. Handles numerical parts for natural sorting
        revenueData.sort((a, b) => {
            return a.room.localeCompare(b.room, undefined, { numeric: true, sensitivity: 'base' });
        });

        res.send({ success: true, revenueData });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
}

module.exports = { 
    editRoom: editRoom,
    getRooms: getRooms,
    updateRoomImages: updateRoomImages, 
    deleteRoom: deleteRoom,
    createRoom: createRoom,
    getRoomUsageOverview: getRoomUsageOverview,
    getRevenueGeneration: getRevenueGeneration
}