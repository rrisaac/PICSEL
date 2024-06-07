/**
 * Room Model
 * 
 * @description This module contains the Room Model, along with its attributes and model validators.
 * @author Eric Conrad Panga
 * @date 04/03/2024
 * 
 * @description Moved the constants here to constant.js.
 * @author Rheana Mindo
 * @date 04/16/2024
 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/postgres.js');
const { ROOM_TYPES, UTILITY_WORKERS } = require('../../frontend/src/utilities/constant.js');

class Room extends Model {}

Room.init({
  room_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  room_type: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Room type is required."
      },
      notEmpty: {
        msg: "Room type cannot be empty."
      },
      isIn: {
        args: [Object.values(ROOM_TYPES)],
        msg: "Invalid room type."
      }
    }
  },
  room_name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: "Room name is required."
      },
      notEmpty: {
        msg: "Room name cannot be empty."
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Description is required."
      },
      notEmpty: {
        msg: "Description cannot be empty."
      }
    }
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    validate: {
      notNull: {
        msg: "Amenities is required."
      },
      notEmpty: {
        msg: "Amenities cannot be empty."
      }
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    validate: {
      notNull: {
        msg: "Images is required."
      },
      notEmpty: {
        msg: "Images cannot be empty."
      }
    }
  },
  utility_worker: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Utility worker is required."
      },
      notEmpty: {
        msg: "Utility worker cannot be empty."
      },
      isIn: {
        args: [Object.values(UTILITY_WORKERS)],
        msg: "Invalid utility worker."
      }
    }
  },
  utility_fee: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      notNull: {
        msg: "Utility fee is required."
      },
      isDecimal: {
        msg: "Utility fee must be a decimal."
      },
      isPositive(value) {
        if (value <= 0) {
          throw new Error("Utility fee must be a positive value.");
        }
      }
    }
  },
  capacity: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Capacity is required."
      },
      isInt: {
        msg: "Capacity must be an integer."
      },
    }
  },
  rate: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    validate: {
      notNull: {
        msg: "Rate is required."
      },
      isDecimal: {
        msg: "Rate must be a decimal."
      },
      isPositive(value) {
        if (value <= 0) {
          throw new Error("Rate must be a positive value.");
        }
      }
    }
  },
}, {
  sequelize,
  modelName: 'Room',
  tableName: 'room',
  timestamps: true, // Enable automatic timestamps
  paranoid: true,   // Enable soft-deletion of records
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = { Room };