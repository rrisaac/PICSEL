/**
 * Class Schedule Model
 * 
 * @description This module contains the Class Schedule Model, along with its attributes and model validators.
 * @author Eric Conrad Panga
 * @date 04/03/2024
 * 
 * @description Moved the constants here to constant.js.
 * @author Rheana Mindo
 * @date 04/16/2024
 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/postgres.js');
const Room = require('./room.js');
const { FACULTY, DAYS_OF_WEEK } = require('../../frontend/src/utilities/constant.js');

class Schedule extends Model {}

Schedule.init({
  schedule_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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
  course_code: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
        notNull: {
          msg: "Course code is required."
        },
        notEmpty: {
          msg: "Course code cannot be empty."
        },
        is: {
          args: [/^(CMSC|IT) ([0-9]{1,3})$/],
          msg: "Invalid course code."
        }
      }
  },
  course_title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
        notNull: {
          msg: "Course title is required."
        },
        notEmpty: {
          msg: "Course title cannot be empty."
        },
      }
  },
  section: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Section is required."
      },
      notEmpty: {
        msg: "Section cannot be empty."
      }
    }
  },
  faculty: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
        notNull: {
          msg: "Faculty is required."
        },
        notEmpty: {
          msg: "Faculty cannot be empty."
        },
        isIn: {
          args: [Object.values(FACULTY)],
          msg: "Invalid faculty."
        }
      }
  },
  days_of_week: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    validate: {
      notNull: {
        msg: "Day/s of the week is required."
      },
      notEmpty: {
        msg: "Day/s of the week cannot be empty."
      },
      // isIn: {
      //   args: [!(Object.values(DAYS_OF_WEEK))],
      //   msg: "Invalid day/s of the week."
      // }
    }
  },
  class_start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
        isWithinOperatingHours(value) {
          const [hours, minutes, seconds] = value.split(':').map(Number);
          if (minutes !== 0 || seconds !== 0) {
            throw new Error('Class start time must be on the hour (minutes and seconds should be 00).');
          }
          if (hours < 7 || hours >= 19) {
            throw new Error('Class start time must be between 7:00 AM and 7:00 PM.');
          }
        },
        notNull: {
          msg: "Class start time is required."
        },
        notEmpty: {
          msg: "Class start time cannot be empty."
        },
      }
  },
  class_end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
        isWithinOperatingHours(value) {
          const [hours, minutes, seconds] = value.split(':').map(Number);
          if (minutes !== 0 || seconds !== 0) {
            throw new Error('Class end time must be on the hour (minutes and seconds should be 00).');
          }
          if (hours <= 7 || hours > 19) {
            throw new Error('Class end time must be between 7:00 AM and 7:00 PM.');
          }
        },
        notNull: {
          msg: "Class end time is required."
        },
        notEmpty: {
          msg: "Class end time cannot be empty."
        },
      }
  },
}, {
  sequelize,
  modelName: 'Schedule',
  tableName: 'schedule',
  timestamps: true, // Enable automatic timestamps
  paranoid: true,   // Enable soft-deletion of records
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = { Schedule };