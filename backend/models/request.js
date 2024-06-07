/**
 * Reservation Request Model
 * 
 * @description This module contains the Reservation Request Model, along with its attributes and model validators.
 * @author Eric Conrad Panga
 * @date 04/03/2024
 * 
 * @description Moved the constants here to constant.js.
 * @author Rheana Mindo
 * @date 04/16/2024
 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/postgres.js');
const User = require('./user.js');
const Room = require('./room.js');
const { REQUEST_STATUSES } = require('../../frontend/src/utilities/constant.js');

class Request extends Model {}

Request.init({
  request_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  room_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Room,
      key: 'room_id',
    },
    onDelete: 'CASCADE',
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Title of reservation is required."
      },
      notEmpty: {
        msg: "Title of reservation cannot be empty."
      },
    }
  },
  purpose: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Purpose of reservation is required."
      },
      notEmpty: {
        msg: "Purpose of reservation cannot be empty."
      },
    }
  },
  reservation_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Reservation date is required."
      },
      notEmpty: {
        msg: "Reservation date cannot be empty."
      },
      isDate: {
        msg: "Reservation date must be a valid date."
      },
    }
  },
  reservation_start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      isWithinOperatingHours(value) {
        const [hours, minutes, seconds] = value.split(':').map(Number);
        if (minutes !== 0 || seconds !== 0) {
          throw new Error('Reservation start time must be on the hour (minutes and seconds should be 00).');
        }
        if (hours < 7 || hours >= 22) {
          throw new Error('Reservation start time must be between 7:00 AM and 10:00 PM.');
        }
      },
      notNull: {
        msg: "Reservation start time is required."
      },
      notEmpty: {
        msg: "Reservation start time cannot be empty."
      },
    }
  },
  reservation_end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      isWithinOperatingHours(value) {
        const [hours, minutes, seconds] = value.split(':').map(Number);
        if (minutes !== 0 || seconds !== 0) {
          throw new Error('Reservation end time must be on the hour (minutes and seconds should be 00).');
        }
        if (hours <= 7 || hours > 22) {
          throw new Error('Reservation end time must be between 7:00 AM and 10:00 PM.');
        }
      },
      notNull: {
        msg: "Reservation end time is required."
      },
      notEmpty: {
        msg: "Reservation end time cannot be empty."
      },
    }
  },
  request_status: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: REQUEST_STATUSES.PENDING,
    validate: {
      notNull: {
        msg: "Request status is required."
      },
      notEmpty: {
        msg: "Request status cannot be empty."
      },
      isIn: {
        args: [Object.values(REQUEST_STATUSES)],
        msg: "Invalid request status."
      }
    }
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Request',
  tableName: 'request',
  timestamps: true, // Enable automatic timestamps
  paranoid: true,   // Enable soft-deletion of records
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = { Request };