/**
 * Announcement Model
 * 
 * @description This module contains the Announcement Model, along with its attributes and model validators.
 * @author Eric Conrad Panga
 * @date 05/01/2024
 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/postgres.js');

class Announcement extends Model {}

Announcement.init({
    announcement_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Content is required."
          },
          notEmpty: {
            msg: "Content cannot be empty."
          }
        }
    },
}, {
    sequelize,
    modelName: 'Announcement',
    tableName: 'announcement',
    timestamps: true, // Enable automatic timestamps
    paranoid: true,   // Enable soft-deletion of records
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = { Announcement };