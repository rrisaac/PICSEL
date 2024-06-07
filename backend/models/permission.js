/**
 * Permission Model
 * 
 * @description This module contains the Permission Model, along with its attributes and model validators.
 * @author Eric Conrad Panga
 * @date 04/03/2024
 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/postgres.js');
const { USER_TYPES } = require('../../frontend/src/utilities/constant.js');

class Permission extends Model {}

Permission.init({
    permission_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_type: {
        type: DataTypes.TEXT,
        validate: {
          isIn: {
            args: [Object.values(USER_TYPES)],
            msg: "Invalid user type."
          }
        }
      },
    permission_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Permission name is required."
          },
          notEmpty: {
            msg: "Permission name cannot be empty."
          }
        }
    },
    is_enabled: { 
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
        allowNull: false,
        validate: {
          notNull: {
            msg: "Is enabled is required."
          },
          notEmpty: {
            msg: "Is enabled cannot be empty."
          }
        }
    }
}, {
    sequelize,
    modelName: 'Permission',
    tableName: 'permission',
    timestamps: false, // Enable automatic timestamps
    paranoid: true,   // Enable soft-deletion of records
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = { Permission };