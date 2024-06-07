/**
 * User Model
 * 
 * @description This module contains the User Model, along with its attributes and model validators.
 * @author Eric Conrad Panga
 * @date 04/03/2024
 * 
 * @description Moved the constants here to constant.js.
 * @author Rheana Mindo
 * @date 04/16/2024
 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/postgres.js');
const { USER_TYPES } = require('../../frontend/src/utilities/constant.js');

class User extends Model {}

User.init({
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  google_id: {
    type: DataTypes.TEXT,
    // Google id can be null so no need for allowNull
  },
  user_type: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "User type is required."
      },
      notEmpty: {
        msg: "User type cannot be empty."
      },
      isIn: {
        args: [Object.values(USER_TYPES)],
        msg: "Invalid user type."
      }
    }
  },
  first_name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "First name is required."
      },
      notEmpty: {
        msg: "First name cannot be empty."
      }
    }
  },
  middle_name: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "N/A",
    validate: {
      notNull: {
        msg: "Middle name is required."
      },
      notEmpty: {
        msg: "Middle name cannot be empty."
      },
    }
  },
  last_name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Last name is required."
      },
      notEmpty: {
        msg: "Last name cannot be empty."
      }
    }
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: "Email is required."
      },
      notEmpty: {
        msg: "Email cannot be empty."
      },
      isEmail: {
        msg: "Must be a valid email address."
      }
    }
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: "Username is required."
      },
      notEmpty: {
        msg: "Username cannot be empty."
      }
    }
  },
  contact_number: {
    type: DataTypes.STRING(13),
    allowNull: false,
    validate: {
      notNull: {
        msg: "Contact number is required."
      },
      notEmpty: {
        msg: "Contact number cannot be empty."
      },
      matches: {
        args: [/^09\d{2}-\d{3}-\d{4}$/],
        msg: "Invalid contact number format. Must be in the format 09XX-XXX-XXXX."
      }
    }
  },
  display_picture: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Display picture is required."
      },
      notEmpty: {
        msg: "Display picture cannot be empty."
      },
    }
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Password is required."
      },
      notEmpty: {
        msg: "Password cannot be empty."
      },
      is: {
        args: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()-_=+{};:,<.>]{8,}$/],
        msg: "Password must be 8 characters long, contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      }
    }
  },
  student_number: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      is: {
        args: ['^2\\d{3}-\\d{5}$'],
        msg: "Invalid student number format.",
      },
    },
  },
  organization_name: {
    type: DataTypes.TEXT,
  },
  college: {
    type: DataTypes.TEXT,
  },
  department: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'user_account',
  timestamps: true, // Enable automatic timestamps
  paranoid: true,   // Enable soft-deletion of records
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = { User };