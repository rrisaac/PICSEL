/**
 * Activity Log Model
 * 
 * @description This module contains the Activity Log Model, along with its attributes and model validators.
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
const Request = require('./request.js');
const { LOG_TYPES } = require('../../frontend/src/utilities/constant.js');

class Log extends Model {}

Log.init({
  log_id: {
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
  request_id: {
    type: DataTypes.UUID,
    references: {
      model: Request,
      key: 'request_id',
    },
    onDelete: 'CASCADE',
  },
  log_type: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Log type is required."
      },
      notEmpty: {
        msg: "Log type cannot be empty."
      },
      isIn: {
        args: [Object.values(LOG_TYPES)],
        msg: "Invalid log type."
      }
    }
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "N/A",
    validate: {
      notNull: {
        msg: "Remarks are required."
      },
      notEmpty: {
        msg: "Remarks cannot be empty."
      },
    }
  },
}, {
  sequelize,
  modelName: 'Log',
  tableName: 'log',
  timestamps: true, // Enable automatic timestamps
  paranoid: true,   // Enable soft-deletion of records
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = { Log };