/**
 * User Controller
 * 
 * Contains routes for creating, editing and deleting user accounts.
 * 
 * @author Aljon Novelo 
 * @date 03/16/2024
 * 
 * @author Rodolfo Flores 
 * @date 04/04/2024
 * 
 * @description Deletes the user info in different test cases
 * @author Mark Jeffrey Zapanta 
 * @date 04/05/2024
 * 
 * @description Gets user info using user id
 * @author Aira Nicole Natividad
 * @date 04/29/2024
 * 
 * @description Deleting the display picture in cloudinary when deleting the user account and also editing the display picture when editing the user account
 * @author Joseph Ryan P. Peña
 * @data 04/30/2024
 * 
 * @description Refactored controllers to use middleware for user retrieval
 * @author Rafa Magno
 * @data 05/10/2024
 * 
 */

/**
 * Login Controller
 * 
 * Handles user login functionalityy within the applicaitons
 * 
 * @description Manages user authentication with features like login.
 * @author Rafa Magno 
 * @date 03/14/2024
 * 
 * @description Gets the username and password from the request body. (Edited by Jet Timothy V. Cerezo)
 * @author Jet Timothy V. Cerezo 
 * @date 03/31/2024
 * 
 * @description Changed the password comparer to bcrypt.compare.
 * @author Neil Vincent S. Alday 
 * @date 04/06/2024
 * 
 * @description Made the secure and sameSite values of the cookie dynamic according to the environment.
 * @author Rainier John P. Pendon 
 * @date 04/09/2024
 * 
 * @description Added Google ID verification.
 * @author Jet Timothy V. Cerezo 
 * @date 04/09/2024
 * 
 * @description Limit log-in to superadmin if appropriate
 * @author Gacel Perfinian
 * @date 05/15/2024
 */

/**
 * Signup Controller
 * 
 * Handles user signup functionality within the application.
 * 
 * @description This module manages the signup feature within the application.
 * @author Aira Nicole Natividad
 * @date 03/15/2024
 * 
 * @description Revised signup function for seamless integration.
 * @author Joseph Ryan Pena
 * @date 03/22/2024
 * 
 * @description Modified user account creation process to align with the current database structure.
 * @author Neil Vincent S. Alday
 * @date 04/06/2024
 * 
 * @description Modified storing of display picture to use cloudinary
 * @author Joseph Ryan P. Peña
 * @date 04/30/2024
 * 
 * 
 * @description added user already exists validator
 * @author Jet Timothy V. Cerezo
 * @date 05/01/2024
 */

/**
 * Logout Controller
 * 
 * Handles user logout functionality within the application.
 * 
 * @description Implemented the logout functionality 
 * @author Rainier John P. Pendon
 * @date 04/08/2024
 * 
 * @description Fixed logout functionality in staging environment
 * @author Neil Vincent S. Alday
 * @date 04/09/2024
 */

/**
 * Classify Controller
 * 
 * Handles user classify functionality within the application.
 * 
 * @description Classifies users and updates their user_type in the database using Sequelize.
 * @author Joseph Ryan Pena
 * @date 03/16/2024
 * 
 * @description Modified the file to work on the current database which is using Sequelize. Sequelize uses methods rather than raw queries
 * @author Neil Vincent Alday
 * @date 04/06/2024
 * 
 * @description Refactored file to use constants from constant.js
 * @author Rheana Mindo
 * @date 04/16/2024
 */

/**
 * Google Verifier and Google Authentication using Passport.js
 * 
 * Handles user verifier and Sign-in and Sign-up for Google.
 * 
 * @description Google verifier for authentication and Google Authentication using Passport.js
 * @author Jet Timothy V. Cerezo
 * @date 04/09/2024
 * 
 * @description Modified the verifier and authenticator to work for signing up operations
 * @author Neil Vincent S. Alday
 * @date 04/20/2024
 * 
 * @description Changed the username to identifier for login to handle username and email
 * @author Jet Timothy V. Cerezo
 * @date 04/27/2024
 * 
 * @description Modified google auth function to load the user's profile picture as a base64 string and save it to the database
 * @author Jet Timothy V. Cerezo
 * @date 04/27/2024
 */

/**
 * Get All Guests Controller
 * 
 * Handles getting all guests in the application.
 * 
 * @description Gets all guests in the application and returns them as a JSON object. This is used for the admin dashboard
 * @author Joseph Ryan P. Peña
 * @date 04/28/2024
 * 
 */

/**
 * Super Admin User Controllers
 * 
 * Handles Edit and Delete Users for Super Admin
 * 
 * @description Created controllers for edit and delete
 * @author Neil Vincent S. Alday
 * @date 04/28/2024
 * 
 * @description Prevent password leakage when retrieving data
 * @author Gacel Perfinian
 * @date 04/28/2024
 */

/**
 * Handle Database Changes
 * 
 * Signals all clients that the database has been modified
 * 
 * @description Uses SSE Event to alert active clients that the user table has changes
 * @author Rheana M. Mindo
 * @date 05/02/2024
 */

/**
 * @description Refactored the messages sent, added validation for username, and fixed a bug in the classify user.
 * @author Pamela Joy Santos
 * @date 05/08/2024
 * 
 * @description Added default image in signup
 * @author Pamela Joy Santos
 * @date 05/15/2024
 */

const bcrypt = require('bcrypt');
const sequelize = require('../config/postgres.js');
const { User } = require('../models/user.js');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { USER_TYPES, CLOUDINARY_FOLDER_NAMES, IMAGE_DIMENSIONS, EMPTY, PERMISSIONS } = require('../../frontend/src/utilities/constant.js');
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { Op } = require('sequelize');
const { Request } = require('../models/request.js');
const { get } = require('http');
const fetch = require('node-fetch');
const cloudinary = require('../config/cloudinary.js');
const { createLogEntry } = require('./log-controller.js');
const { LOG_TYPES } = require('../../frontend/src/utilities/constant.js');
const { Log } = require('../models/log.js');
const { Permission } = require('../models/permission.js');

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

const getUserInfo = async (req, res) => {
    try {
        const user = req.user;
        const imageUrl = cloudinary.url(user.display_picture, {
          secure: true, // Use HTTPS
          sameSite: 'None' // Enable third-party cookies
        });

        const userDetails = {
            user_id: user.user_id,
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            user_type: user.user_type,
            username: user.username,
            email: user.email,
            contact_number: user.contact_number,
            display_picture: imageUrl,
            student_number: user.student_number || 'NA',
            organization_name: user.organization_name || 'NA',
            college: user.college || 'NA',
            department: user.department || 'NA'
        }
        
        if (user) {
            res.json(userDetails);
        } else {
            res.status(404).json({ success: false, message: "User not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error getting user information." });
    }
};

const getUserInfoUsingUserId = async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findOne({ where: { user_id: userId } });

      if (user) {
          res.json({ success: true, user: user });
      } else {
          res.status(404).json({ success: false, message: "User not found." });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error getting user information." });
  }
};

const updateUserInfo = async (req, res) => {
  try {
      const { user_id } = req.params;
      const { first_name, middle_name, last_name, username, contact_number, password } = req.body;
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.findOne({ where: { user_id: user_id } });
      const usernameExists = await User.findOne({ where: { username: username } });

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found." });
      }

      if (usernameExists && user.username !== usernameExists.username) {
        return res.send({ success: false, message: "Username already exists." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Check if a new image file has been uploaded
      let imageURL = user.display_picture; // Default to existing image
      if (req.file) {
          const newImageURL = user.email.split('@')[0] + "_" + uuidv4().split('-')[0];
          // Optionally handle old image deletion and new image upload
          const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
              public_id: newImageURL,
              folder: CLOUDINARY_FOLDER_NAMES.DISPLAY_PICTURES,
          });
          imageURL = uploadResponse.public_id; // Update image URL to new uploaded image
      }

      // Collect fields that are updated
      const updatedFields = [];
      if (first_name && first_name !== user.first_name) updatedFields.push("first name");
      if (middle_name && middle_name !== user.middle_name) updatedFields.push("middle name");
      if (last_name && last_name !== user.last_name) updatedFields.push("last name");
      if (username && username !== user.username) updatedFields.push("username");
      if (contact_number && contact_number !== user.contact_number) updatedFields.push("contact number");
      if (!isPasswordValid) updatedFields.push("password");
      if (imageURL !== user.display_picture) updatedFields.push("display picture");

      // Update user details in database
      const [updatedRows] = await User.update({
          first_name,
          middle_name,
          last_name,
          username,
          contact_number,
          display_picture: imageURL,
          password: hashedPassword
      }, {
        where: { user_id: user_id },
        returning: true,
      });

      const updatedFieldsString = updatedFields.join(", ");
      await createLogEntry(user_id, null, LOG_TYPES.USER_UPDATES_ACCOUNT, `User ${user.username} updated their ${updatedFieldsString}.`);
      
      if (updatedRows > 0) {
        handleDbChange();
        res.send({ success: true, message: "Successfully updated user information!" });
      } else {
          res.status(404).json({ success: false, message: "User not found." });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error updating user information." });
  }
}

  const superAdminUpdateUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        const { password, first_name, middle_name, last_name, username, contact_number, display_picture } = req.body;
        const currentUser = req.user;

        if (!currentUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        
        const usernameExists = await User.findOne({ where: { username: username } });

        if (req.body.isChangingUserName && usernameExists && currentUser.username !== usernameExists.username) {
            return res.status(400).json({ success: false, message: "Username already exists." });
        }

        const isPasswordValid = await bcrypt.compare(password, currentUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password.' });
        }

        const userToUpdate = await User.findOne({ where: { user_id: userId } });
        if (!userToUpdate) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const passwordNotChanged = await bcrypt.compare(password, userToUpdate.password);

        let imageURL = userToUpdate.display_picture;
        if (req.file) {
            const newImageURL = userToUpdate.email.split('@')[0] + "_" + uuidv4().split('-')[0];
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                public_id: newImageURL,
                folder: CLOUDINARY_FOLDER_NAMES.DISPLAY_PICTURES,
            });
            imageURL = uploadResponse.public_id;
        }

        const updatedFields = [];
        if (first_name && first_name !== userToUpdate.first_name) updatedFields.push("first name");
        if (middle_name && middle_name !== userToUpdate.middle_name) updatedFields.push("middle name");
        if (last_name && last_name !== userToUpdate.last_name) updatedFields.push("last name");
        if (username && username !== userToUpdate.username) updatedFields.push("username");
        if (contact_number && contact_number !== userToUpdate.contact_number) updatedFields.push("contact number");
        if (!passwordNotChanged) updatedFields.push("password");
        if (imageURL !== userToUpdate.display_picture) updatedFields.push("display picture");

        const [updatedRows, [updatedUser]] = await User.update({
            first_name,
            middle_name,
            last_name,
            username,
            contact_number,
            display_picture: imageURL,
        }, {
            where: { user_id: userId },
            returning: true,
        });

        const updatedFieldsString = updatedFields.join(", ");
        if (updatedRows > 0) {
            await createLogEntry(userId, null, LOG_TYPES.SUPER_ADMIN_EDITS_USER, `Super Admin edited user ${userToUpdate.username}'s ${updatedFieldsString}`);
            handleDbChange();
            return res.status(200).json({ success: true, message: "Successfully updated user information!", user: updatedUser });
        } else {
            return res.status(404).json({ success: false, message: "User not found." });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating user information" });
    }
};


const superAdminDeleteUser = async (req, res) => {
  try{
    const { userId } = req.params;
    const { password } = req.body;
    const currentUser = req.user;

    // If password is correct, proceed
    const isPasswordValid = await bcrypt.compare(password, currentUser.dataValues.password);
    if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    // USER Deletion
    const user = await User.findOne({ where: { user_id: userId } }); 

    if (user) { 
      // Check if the user has any pending requests
      const pendingRequests = await Request.findAll({ 
        where: { 
          user_id: userId,
          request_status: {
            [Op.or]: ['Pending', 'Approved with Pending Documents']
          }
        } 
      });
    
    if (pendingRequests.length > 0) { 
      res.status(400).json({ success: false, message: "User has pending requests and cannot be deleted." }); 
    } else {
      const requests = await Request.findAll({ where: { user_id: userId } });
      for (let i = 0; i < requests.length; i++) {
        await Request.update({ user_id: null }, { where: { request_id: requests[i].request_id } }); //change user_id to null
      }

      // Update logs to remove user association
      const logs = await Log.findAll({ where: { user_id: user.user_id } });
      for (let k = 0; k < logs.length; k++) {
        await Log.update({ user_id: null }, { where: { log_id: logs[k].log_id } }); // Change user_id to null
      }

      const superAdmin = 'fe0371e3-21eb-4595-8e13-26f16f604907';


      const userToDelete = await User.findOne({where: {user_id: userId}});
      const deleteFile = await cloudinary.uploader.destroy(userToDelete.dataValues.display_picture);

      
      
      // Delete user
      await User.destroy({ 
        where: { user_id: userId },
        force: true //to hard delete
      });
      handleDbChange();
      
      await createLogEntry(superAdmin, null, LOG_TYPES.SUPER_ADMIN_DELETES_USER, `Super Admin deleted user ${user.username}.`);
      
      if (createLogEntry) {
          res.send({ success: true, message: "User was deleted but requests were kept if they have any!" });
      }
    }

    } else {
      res.status(404).json({ success: false, message: "User not found." });
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting user." });
  }
}

const deleteUserInfo = async (req, res) => { // Delete user information

  try {
    const { user_id } = req.params;
    const user = await User.findOne({ where: { user_id: user_id } });
    if (user) { 
      // Check if the user has any pending requests
      const pendingRequests = await Request.findAll({ 
        where: { 
          user_id: user_id,
          request_status: {
            [Op.or]: ['Pending', 'Approved with Pending Documents']
          }
        } 
      });
      
      if (pendingRequests.length > 0) { 
        res.status(400).json({ success: false, message: "User has pending requests and cannot be deleted." }); 
      } else {


        const requests = await Request.findAll({ where: { user_id: user_id } });
        for (let i = 0; i < requests.length; i++) {
          await Request.update({ user_id: null }, { where: { request_id: requests[i].request_id } }); //change user_id to null
        }
        const logs = await Log.findAll({ where: { user_id: user_id } });

        const superAdmin = 'fe0371e3-21eb-4595-8e13-26f16f604907';

        for (let i = 0; i < logs.length; i++) {
          await Log.update({ user_id: superAdmin }, { where: { log_id: logs[i].log_id } }); //change user_id to superAdmin
        }
        // Delete user
        await createLogEntry(superAdmin, null, LOG_TYPES.USER_DELETES_ACCOUNT, `User ${user.username} deleted their account.`);

        await User.destroy({ 
          where: { user_id: user_id },
          force: true //to hard delete
        });
        
        const deleteFile = await cloudinary.uploader.destroy(user.dataValues.display_picture);

        if (createLogEntry) {
          handleDbChange();
          res.send({ success: true, message: "User was deleted but requests were kept if they have any!" });
        }
      }
    } else {
      res.status(404).json({ success: false, message: "User not found." });
    } 
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error deleting user." });
  }

  // Cancel button function
  const cancel = async (req, res) => {
    res.json({ message: "Deletion of user was cancelled!" });

  }
  // Return the cancel function
  return cancel;
}


const login = async (req, res) => {
    const { identifier, password } = req.body;
  
    try {
      // Check if there are permissions to log in
      const loginPerm = (await Permission.findOne({
        where: {
          permission_name: PERMISSIONS.ALLOW_LOGIN,
          user_type: null,
        }
      })).is_enabled

      // Ensure username is treated case-insensitively for user convenience
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { email: identifier.trim() },
            { username: identifier.trim() }
          ]
        }
      })

      if (!(loginPerm || user?.user_type == USER_TYPES.SUPER_ADMIN)) {
        // FAIL - Logins are disabled
        return res.send({ success: false, message: 'Logins are currently disabled.' });        
      }

      if (!user) {
        // FAIL - User not found
        return res.send({ success: false, message: 'User not found.' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      // Compare password
      //change this to bcrypt.compare kapag may password hashing na
      if (!isMatch) {
        // FAIL - Incorrect password
        return res.send({ success: false, message: 'Incorrect password.' });
      }
      
      // SUCCESSFUL LOGIN
      const tokenPayload = { user_id: user.user_id };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: '1h' // It's a good practice to have the token expire
      });
  
      // Secure attributes should be set according to the environment
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.REACT_APP_NODE_ENV === "staging" ? true : false,
        sameSite: process.env.REACT_APP_NODE_ENV === "staging" ? 'None': 'Strict', // This helps against CSRF
        maxAge: 3600000 // 1 hour
      });
  
      return res.send({ success: true, token, username: user.username, id: user.user_id });
    } catch (error) {
      console.error('Error during login:', error);
      return res.send({ success: false, message: 'Internal server error.' });
    }
  };
  
const checkIfLoggedIn = async (req, res) => {
    if (!req.cookies || !req.cookies.authToken ) {
      // FAIL - No cookies / no authToken cookie sent
      return res.send({ isLoggedIn: false, success: false, message: 'No authentication token found.' });
    }
  
    try {
      // Verify JWT token
      const tokenPayload = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
      const userId = tokenPayload.user_id;
  
      // Find user in database
      const user = await User.findOne({ where: { user_id: userId } });
      if (!user) {
        // FAIL - User not found in the database
        return res.send({ isLoggedIn: false, success: false, message: 'User not found.' });
      }
  
      // Determine login method based on the presence of googleId
      const loginMethod = user.google_id !== null && user.google_id !== undefined ? 'Google' : 'Standard';
  
      // SUCCESS - User found, respond with login status, method, and user info
      return res.send({ 
        isLoggedIn: true, 
        loginMethod, 
        username: user.username,
        email: user.email, 
        id: user.user_id 
      });
    } catch (error) {
      console.error("Error during token verification:", error);
      // Token verification error, possibly due to expiration or tampering
      return res.status(500).send({ isLoggedIn: false, success: false, message: 'Token verification error.' });
    }
  }; 

const signup = async (req, res) => {

    // Function to capitalize the first letter of a string
    const capitalize = (str) => {
      return str
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
    };
  
    const firstName = capitalize(req.body.firstName);
    const middleName = req.body.middleName ? capitalize(req.body.middleName) : EMPTY;
    const lastName = capitalize(req.body.lastName);
    const email = req.body.email;
    const username = "guest" + uuidv4(); // For testing
    const user_type = 'Guest';
    const contactNumber = req.body.contactNumber;
    const password = req.body.password;
    const reEnterPassword = req.body.reEnterPassword;     
    const existing = await User.findOne({ where: { email: email } });
  
    let image = null;
    if (req.file) {
      image = {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer,
        size: req.file.size,
      };
    }

      // Validation checks
  
    // Validation checks
    // Validate if user already exists
    if (existing) {
      return res.send({ success: false, error: "User already exists." });
    }
    // Validate password matching
    if (password !== reEnterPassword) {
      return res.send({ success: false, error: "Passwords do not match." });
    }
  
    // Validate password format
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
      return res.send({ success: false, error: "Password must be 8 characters long, contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character." });
    }
  
    // Validate contact number format
    const contactNumberRegex = /^09\d{2}-\d{3}-\d{4}$/;
    if (!contactNumberRegex.test(contactNumber)) {
      return res.send({ success: false, error: "Invalid contact number format. Must be in the format 09XX-XXX-XXXX." });
    }
  
    // Validate image size and format
    if (req.file) {
      if (image.size < 10240 || image.size > 5242880) {
        return res.send({ success: false, error: "Image size must be between 10kb and 5mb." });
      }
    
      const allowedImageFormats = ['image/jpeg', 'image/png'];
      if (!allowedImageFormats.includes(image.mimetype)) {
        return res.send({ success: false, error: "Invalid image format. Must be JPG or PNG." });
      }
    }
  
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.send({ success: false, error: "Invalid email format." });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      // Use the Sequelize model's create method to insert a new record
      const imageURL = email.split('@')[0]+"_"+uuidv4().split('-')[0];
      const path = req.file ? req.file.path : "https://i.pinimg.com/originals/68/3d/8f/683d8f58c98a715130b1251a9d59d1b9.jpg";
      const displayImage = await cloudinary.uploader.upload(path, {public_id: imageURL,folder: CLOUDINARY_FOLDER_NAMES.DISPLAY_PICTURES,
    //     transformation: [
    //     { width: IMAGE_DIMENSIONS.DISPLAY_PICTURE, height: IMAGE_DIMENSIONS.DISPLAY_PICTURE, crop: "fit" }
    // ]
      });

      const userAccount = await User.create({
        user_type: user_type,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email: email,
        username: username,
        contact_number: contactNumber,
        display_picture: displayImage.public_id,
        password: hashedPassword
      });
    
      // The create method returns the inserted object directly, so no need to check result.rows
      if (userAccount) {
        handleDbChange();
          res.send({ success: true, message: "Successfully created an account!" });
        }

      else {
        // This else block might be unnecessary since create will throw an error if the insert fails
        res.send({ success: false, error: "User creation failed." });
      }
    } catch (error) {
      console.error('Error executing query', error);
      res.send({ success: false, error: error.message });
    }
};

const logout = async (req, res) => {

    try {
      if (process.env.REACT_APP_NODE_ENV === "development") {
        res.clearCookie('authToken');
        return res.send({ success: true, message: 'Logout successful!' });
        
      } else {
        res.cookie('authToken', "", {
          httpOnly: true,
          path: "/",
          expires: new Date(0),
          secure: process.env.REACT_APP_NODE_ENV === "staging" ? true : false,
          sameSite: process.env.REACT_APP_NODE_ENV === "staging" ? 'None': 'Strict',
        });
        return res.send({ success: true, message: 'Logout successful!'});
      }
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).send({ success: false, message: 'Internal server error.' });
    }
};

const classifyUsers = async (req, res) => {
    const { email, username, classification, studNumber, orgName, department } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ where: { email } });
      const usernameExists = await User.findOne({ where: { username: username } });
  
      // If user does not exist, send an error response
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found." });
      }

      if (usernameExists) {
        return res.send({ success: false, message: "Username already exists." });
      }
  
      // Prepare update values based on classification
      let updateValues = { username: username };
      switch (classification) {
        case USER_TYPES.FACULTY:
          updateValues.department = department;
          break;
        case USER_TYPES.STUDENT:
          updateValues.student_number = studNumber;
          break;
        case USER_TYPES.STUDENT_ORGANIZATION:
          updateValues.organization_name = orgName;
          break;
        default:
          // Handle other classifications as needed
          break;
      }
  
      // Update the user with new classification details
      try {
        await user.update({ user_type: classification, ...updateValues });
        res.send({ success: true, message: "User classification successful!" });
      } catch (error) {
        res.send({ success: false, message: "User classification failed." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, error: "User classification failed." });
    }
};

const classifyGoogleUsers = async (req, res) => {
  const { google_id , username, password, rePassword, contactNumber, classification, studNumber, orgName, department } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { google_id: google_id } });
    const usernameExists = await User.findOne({ where: { username: username } });

    // If user does not exist, send an error response
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found." });
    }

    if (usernameExists) {
      return res.send({ success: false, error: "Username already exists." });
    }

    // Validate password matching
    if (password !== rePassword) {
      return res.send({ success: false, error: "Passwords do not match." });
    }
  
    // Validate password format
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
      return res.send({ success: false, error: "Password must be 8 characters long, contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character." });
    }
  
    // Validate contact number format
    const contactNumberRegex = /^09\d{2}-\d{3}-\d{4}$/;
    if (!contactNumberRegex.test(contactNumber)) {
      return res.send({ success: false, error: "Invalid contact number format. Must be in the format 09XX-XXX-XXXX." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Prepare update values based on classification
    let updateValues = { username: username, password: hashedPassword, contact_number: contactNumber };
    switch (classification) {
      case USER_TYPES.FACULTY:
        updateValues.department = department;
        break;
      case USER_TYPES.STUDENT:
        updateValues.student_number = studNumber;
        break;
      case USER_TYPES.STUDENT_ORGANIZATION:
        updateValues.organization_name = orgName;
        break;
      default:
        // Handle other classifications as needed
        break;
    }

    // Update the user with new classification details
    try {
        await user.update({ user_type: classification, ...updateValues });
        res.send({ success: true, message: "User classification successful!" });
      } catch (error) {
        res.send({ success: false, error: "User classification failed." });
      }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "User classification failed." });
  }
};

function generatePassword(length = 12) {
    if (length < 8) {
        throw new Error("Password length must be at least 8 characters.");
    }
  
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = '!@#$%^&*()-_=+{};:,<.>';
  
    let password = [
        lower[Math.floor(Math.random() * lower.length)],
        upper[Math.floor(Math.random() * upper.length)],
        digits[Math.floor(Math.random() * digits.length)],
        special[Math.floor(Math.random() * special.length)]
    ];
  
    const allChars = lower + upper + digits + special;
    for (let i = 4; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
  
    password = password.sort(() => Math.random() - 0.5);
  
    return password.join('');
  }
  
function generatePhoneNumber() {
    const generateDigits = (length) => {
        let digits = '';
        for (let i = 0; i < length; i++) {
            digits += Math.floor(Math.random() * 10).toString();
        }
        return digits;
    };
  
    const part1 = generateDigits(2);
    const part2 = generateDigits(3);
    const part3 = generateDigits(4);
  
    return `09${part1}-${part2}-${part3}`;
  }

const getAllUsers   = async (req, res) => {
  try{
    const users = await User.findAll({
      where: {
        user_type: {
          [Op.ne]: "Super Admin"  
        }
      }
    });

    // Get the image URLs from Cloudinary 
    for(let user of users){
      const imageUrls = cloudinary.url(user.display_picture, {
        httpOnly: true,
        secure: true, // Use HTTPS
        sameSite: 'None' // Set sameSite attribute to 'None'
      });
      user.display_picture = imageUrls;
    }

    res.send({success: true, users: users.map((x) => ({...x.dataValues, password: undefined}))});
  } catch {
    res.send({success: false, meesage: "Error in retrieving users"});
  }
}

const getAllGuests = async (req, res) => {
    try {
      const guests = await User.findAll({ where: { user_type: 'Guest' } });
      res.status(200).json({ success: true, guests: guests });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }

}
  
const googleVerifier = async (req, res) => {
    let isNewUser = false;
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, 
      });
      const payload = ticket.getPayload();
      const userid = payload['sub']; // Google's user ID

      let user = await User.findOne({ where: { email: payload.email } });

      const imageURL = payload.email.split('@')[0]+"_"+uuidv4().split('-')[0];

      if (!user) {
         
        const displayImage = await cloudinary.uploader.upload(payload.picture.replace("s96-c", "s192-c", true), {public_id: imageURL,folder: CLOUDINARY_FOLDER_NAMES.DISPLAY_PICTURES, 
        //   transformation: [
        //   { width: IMAGE_DIMENSIONS.DISPLAY_PICTURE, height: IMAGE_DIMENSIONS.DISPLAY_PICTURE, crop: "fit" }
        // ]
      });

        user = new User({
          google_id: userid,
          email: payload.email,
          username: "guest" + uuidv4(),
          display_picture: displayImage.public_id,
          first_name: payload.given_name,
          middle_name: EMPTY,
          last_name: payload.family_name ? payload.family_name : EMPTY,
          user_type: 'Guest',
          contact_number: generatePhoneNumber(),
          password: generatePassword(),
        });
        await user.save();
        isNewUser = true;
      } else if (!user.google_id) {
        user.google_id = userid;
        await user.save();
      }

      if (isNewUser === true){
        res.status(200).json({ success: true, googleId: userid , signup: true, token: token});
      } else {

        const tokenPayload = { user_id: user.user_id };
        const authToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
    
        res.cookie('authToken', authToken, {
          httpOnly: true,
          secure: process.env.REACT_APP_NODE_ENV === "staging" ? true : false,
          sameSite: process.env.REACT_APP_NODE_ENV === "staging" ? 'None': 'Strict',
        });

        res.status(200).json({ success: true, googleId: userid, token: token, authToken: authToken});
      }
    } catch (error) {
      console.error("Error verifying Google token: ", error);
      res.status(500).json({ success: false, message: 'Failed to verify Google token.' });
    }
}

const superAdminDeleteAllUsers = async (req, res) => {
  try{
    const { password } = req.body;
    const currentUser = req.user
    
    if (!currentUser) {
        return res.status(404).send({ success: false, message: 'User not found.' });
    }

    // If password is correct, proceed
    const isPasswordValid = await bcrypt.compare(password, currentUser.dataValues.password);
    if (!isPasswordValid) {
        return res.status(401).send({ success: false, message: 'Invalid password.' });
    }

    // USER Deletion
    const users = await User.findAll({ where: { user_type: { [Op.ne]: 'Super Admin' } } });
    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        // Check if the user has any pending requests
        const pendingRequests = await Request.findAll({
          where: {
            user_id: user.user_id,
            request_status: {
              [Op.or]: ['Pending', 'Approved with Pending Documents']
            }
          }
        });

        if (pendingRequests.length > 0) {
          continue; // Skip deleting user if they have pending requests
        }

        const requests = await Request.findAll({ where: { user_id: user.user_id } });
        for (let j = 0; j < requests.length; j++) {
          await Request.update({ user_id: null }, { where: { request_id: requests[j].request_id } }); // Change user_id to null
        }

        // Update logs to remove user association
        const logs = await Log.findAll({ where: { user_id: user.user_id } });
        for (let k = 0; k < logs.length; k++) {
          await Log.update({ user_id: null }, { where: { log_id: logs[k].log_id } }); // Change user_id to null
        }

        // Delete user
        await User.destroy({
          where: { 
            user_id: user.user_id,
            user_type: { [Op.ne]: 'Super Admin' }
          },
          force: true // To hard delete
        });
      }
      handleDbChange();
      res.json({ success: true, message: "All users except Super Admin were deleted!" });
    } else {
      res.status(404).json({ success: false, message: "No users found." });
    }

    await createLogEntry(user_id, null, LOG_TYPES.USER_DELETES_ACCOUNT, EMPTY);
      
    if (createLogEntry) {
        handleDbChange();
        res.status(200).send({ success: true});
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting users." });
  }
}
  


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ google_id: profile.id });
        if (!user) {
            user = await User.create({
                google_id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName
            });
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
  }));
  
  
  // Serialize user into the sessions
  passport.serializeUser((user, done) => {
  done(null, user.id); // user.id is used to identify the user
  });
  
  // Deserialize user from the sessions
  passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
  });
  
module.exports = {
    getUserInfo: getUserInfo, 
    getUserInfoUsingUserId: getUserInfoUsingUserId,
    updateUserInfo: updateUserInfo, 
    deleteUserInfo: deleteUserInfo,
    login: login, 
    checkIfLoggedIn: checkIfLoggedIn,
    signup: signup,
    logout: logout,
    classify: classifyUsers,
    getAllGuests: getAllGuests,
    googleClassify: classifyGoogleUsers,
    getAllUsers: getAllUsers,
    superAdminDeleteUser: superAdminDeleteUser,
    superAdminUpdateUserInfo: superAdminUpdateUserInfo,
    googleVerifier: googleVerifier,
    superAdminDeleteAllUsers: superAdminDeleteAllUsers,
    googleAuth: passport.authenticate("google", { scope: ["profile", "email"] }),
    googleAuthCallback: passport.authenticate("google", {
        failureRedirect: "/login", 
        successRedirect: "/dashboard"
    })
};