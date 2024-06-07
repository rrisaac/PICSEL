/**
 * Cloudinary Connection Module
 * 
 * @description This module is for the connection of the server to the Cloudinary storage.
 * @author Rainier Pendon
 * @date 04/30/2024
 * 
 */

require('dotenv').config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
});

module.exports = cloudinary;