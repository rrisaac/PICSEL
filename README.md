# PICSEL - Online Room Reservation System

Welcome to the repository for PICSEL, an innovative web application developed by 15 E-4L computer science students at the Institute of Computer Science (ICS), University of the Philippines Los Baños. PICSEL, which stands for Platform for Institute of Computer Science Scheduling, Events, and Logistics, is designed to streamline the process of reserving rooms within ICS. 

## Table of Contents

- [Introduction](#introduction)
- [Screenshots](#screenshots)
- [User Types and User Views](#user-types-and-user-views)
- [Booking Process](#booking-process)
  - [Students, Faculty, and Organizations](#students-faculty-and-organizations)
  - [Guests and Admin](#guests-and-admin)
- [Universal Features](#universal-features)
- [Admin/SuperAdmin Configuration Feature](#adminsuperadmin-configuration-feature)
- [Conclusion](#conclusion)
- [The Team](#the-team)

## Introduction

PICSEL is a centralized, user-friendly room reservation system designed to revolutionize how space is managed within the Institute of Computer Science. By simplifying the process of reserving rooms, PICSEL eliminates approval bottlenecks and unnecessary trips to the admin office, allowing students, faculty, student organizations, and guests to efficiently find and book spaces for exams, events, or meetings, anytime and anywhere.

## Screenshots

<p align="center">
  <img src="frontend\public\assets\img\portfolio\screenshots\Demo 0.jpg" alt="Demo">
  <img src="frontend\public\assets\img\portfolio\screenshots\Demo 1.gif" alt="Demo">
  <img src="frontend\public\assets\img\portfolio\screenshots\Demo 2.jpg" alt="Demo">
  <img src="frontend\public\assets\img\portfolio\screenshots\Demo 3.jpg" alt="Demo">
</p>

## User Types and User Views

PICSEL supports various stakeholders: Students, Student Organizations, Faculty, Guests, and Admins. After successful manual or Google authentication, users are greeted by a dashboard providing general information such as admin announcements, essential documents, and availability schedules.

Student organizations, faculty, and students can book rooms for events, activities, or study sessions through the “Book Reservation” feature. Users can track their booking requests in the “Booking Status” module and coordinate through the calendar, rooms, and activity log modules.

Guests can use the “Inquire Reservation” feature to submit room reservation inquiries. Admins manage all requests, approve or disapprove bookings, and generate detailed reports through the “Booking Requests” module. Superadmins have access to all modules and features, with the capability to configure the entire app.

## Booking Process

### Students, Faculty, and Organizations

The booking request process for students, faculty, and organizations involves the following steps:

1. **Book Reservation:** The user fills out the request properties in the “Book Reservation” tab.
2. **Booking Status:** Once a request succeeds, it appears in the booking request of the user and the booking status of the admin as “Pending.” Users can still cancel and edit the booking properties, while the admin can approve or disapprove.
3. **Approval:** Approving the request updates the request status to “Approved with Pending Documents.” Users must upload the required documents for admins to validate.
4. **Validation:** Admins validate the documents (e.g., receipts, forms, permits) and finalize the booking request, completing the booking process.

Users can also cancel requests, and admins can disapprove or cancel overdue requests. Admins and superadmins can generate summary reports covering detailed information about room usage, finalized requests, and revenue generation.

### Guests and Admin

For guest users, the booking process is managed by the admin:

1. **Inquire Reservation:** Guests submit inquiries through the “Inquire Reservation” feature.
2. **Admin Review:** The inquiry appears in the admin’s activity log for review.
3. **Admin Booking:** If approved, the admin books the room on behalf of the guest.

This process ensures smooth operations for guests and allows admins to maintain control and oversight.

## Universal Features

### Calendar

The calendar feature allows users to effortlessly view finalized booking reservations per month and the weekly class schedules for each room.

### Activity Log

The activity log helps users track their reservation activities and enables admins to keep track of all important information such as user requests and inquiries.

### Rooms

The rooms feature provides detailed information about each room, including availability and cost per hour, making it easier for users to choose the perfect space for their needs.

## Admin/SuperAdmin Configuration Feature

The configuration feature is designed specifically for superadmins:

### Rooms

Superadmins can Create, Read, Update, and Delete rooms. They can manage all room schedules directly from each room's calendar.

### Class Schedules

The class schedules feature allows superadmins to manage all schedules within the system. It includes sorting tools and a search function for quick access to specific schedules.

### Users

The users feature is the go-to place for managing all users. Superadmins can sort and filter users by type, edit user information, and delete users as needed.

### Settings

The settings tab empowers superadmins to customize the system’s functionality for different user types. Superadmins can toggle the operation of all modules and features in the system, ensuring that each user has access to only the tools they require.

## Conclusion

The purpose of PICSEL is to streamline the room reservation system for hassle-free bookings for all stakeholders. PICSEL focuses on improving the process and enhancing the experience for the constituents who matter the most. We look forward to embarking on this journey with you. This is PICSEL.

## The Team

### Project Manager
- Rheana Mindo

### Frontend Developers
- Rey Isaac Jr. (Team Lead)
- Diana Compahinay
- Kristian David
- Prince Nepomuceno
- Gacel Perfinian
- Jan Señires

### Backend Developers
- Neil Alday (Team Lead)
- Jet Cerezo
- Raphael Magno
- Aira Natividad
- Ryan Peña
- Jeffrey Zapanta

### Database Developers
- Eric Panga III (Team Lead)
- Aljon Novelo
- Pamela Santos
- Rodolfo Flores III
- Rainier Pendon
- Rheana Mindo

