/**
 * PostgreSQL Queries Module
 * 
 * @description Contains commands to create the 'picsel' database and its initial tables.
 * @author Pamela Joy Santos
 * @date 03/16/2024
 * 
 * @description Updated implementation for the user_account table.
 * @author Rheana Mindo
 * @date 04/02/2024
 * 
 * @description Added room, schedule, request, and log tables.
 * @author Eric Conrad Panga
 * @date 04/04/2024
 * 
 * @description Added permission and announcement tables.
 * @author Eric Conrad Panga
 * @date 05/01/2024
 */

-- create database
CREATE DATABASE picsel;

-- install uuid extension
CREATE EXTENSION IF NOT EXISTS 'uuid-ossp';

-- create table for user
-- 'user' is a reserved word, hence 'user_account'
CREATE TABLE IF NOT EXISTS user_account (
    user_id 				UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	google_id				TEXT,
    user_type 				TEXT NOT NULL CHECK (user_type IN (
                                'Faculty',
                                'Student',
                                'Student Organization',
                                'Admin',
                                'Guest',
                                'Super Admin'
                            )),
    first_name 				TEXT NOT NULL,
    middle_name 			TEXT NOT NULL DEFAULT 'N/A',
    last_name 				TEXT NOT NULL,
    email 					TEXT NOT NULL UNIQUE,
    username 				TEXT NOT NULL UNIQUE,
    contact_number 			VARCHAR(13) NOT NULL CHECK (contact_number ~ '^09\d{2}-\d{3}-\d{4}$'),
    display_picture 		TEXT NOT NULL,
    password 				TEXT NOT NULL CHECK (password ~ '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()-_=+{};:,<.>]{8,}$'),
    student_number          VARCHAR(10) CHECK (student_number ~ '^2\d{3}-\d{5}$' OR student_number IS NULL),
    organization_name 		TEXT,
    college 				TEXT,
    department 				TEXT,
    created_at 				TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at 				TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at 				TIMESTAMP WITH TIME ZONE
);

-- create table for room
CREATE TABLE IF NOT EXISTS room (
    room_id 				UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_type               TEXT NOT NULL CHECK (room_type IN (
                                'Lecture Hall',
                                'PC Laboratory'
                            )),
    room_name 				TEXT NOT NULL UNIQUE,
    description             TEXT NOT NULL,
    amenities               TEXT[] NOT NULL CHECK (array_length(amenities, 1) > 0),
    images                  TEXT[] NOT NULL CHECK (array_length(images, 1) > 0),
    utility_worker          TEXT NOT NULL CHECK (utility_worker IN (
                                'Reggie Pelayo',
                                'Romel Lawas'
                            )),
    utility_fee             DECIMAL(5, 2) NOT NULL CHECK (utility_fee > 0),
    capacity 				SMALLINT NOT NULL CHECK (capacity > 0),
    rate 					DECIMAL(6, 2) NOT NULL CHECK (rate > 0),
    created_at 				TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at 				TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at 				TIMESTAMP WITH TIME ZONE
);

-- create table for class schedule
CREATE TABLE IF NOT EXISTS schedule (
    schedule_id 			UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id 				UUID NOT NULL,
    course_code             TEXT NOT NULL CHECK (course_code ~ '^(CMSC|IT) ([0-9]{1,3})$'),
    course_title 			TEXT NOT NULL,  
    section                 TEXT NOT NULL,
    faculty 				TEXT NOT NULL CHECK (faculty IN (
                                'Albacea',
                                'Angcana',
                                'Anacleto',
                                'Angeles',
                                'Aragones',
                                'Bawagan',
                                'Camaclang',
                                'Capuchino',
                                'Clariño',
                                'Cunanan',
                                'Dionisio',
                                'Doria',
                                'Geronimo',
                                'Gojo Cruz',
                                'Hao',
                                'Hermocilla',
                                'Isungga',
                                'Jacildo',
                                'Khan',
                                'Lactuan',
                                'Lapitan',
                                'Madrid',
                                'Mercado D',
                                'Mercado R',
                                'Nadua',
                                'Pabico',
                                'Paterno',
                                'Recario',
                                'Roxas',
                                'Samaniego',
                                'Tumibay'
                            )),
    days_of_week             TEXT[] NOT NULL CHECK (days_of_week <@ ARRAY[
                                'Sunday',
                                'Monday',
                                'Tuesday',
                                'Wednesday',
                                'Thursday',
                                'Friday',
                                'Saturday'
                            ]),
    class_start_time 		TIME NOT NULL CHECK (
								class_start_time >= '07:00:00' AND class_start_time < '19:00:00' AND
								EXTRACT(MINUTE FROM class_start_time) = 0 AND 
								EXTRACT(SECOND FROM class_start_time) = 0
							),
    class_end_time 			TIME NOT NULL CHECK (
								class_end_time > '07:00:00' AND class_end_time <= '19:00:00' AND
								EXTRACT(MINUTE FROM class_end_time) = 0 AND 
								EXTRACT(SECOND FROM class_end_time) = 0
							),
    created_at 				TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at 				TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at 				TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE CASCADE
);

-- create table for reservation request
CREATE TABLE IF NOT EXISTS request (
    request_id 				UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id 				UUID,
    room_id 				UUID NOT NULL,
    title                   TEXT NOT NULL,
    purpose 				TEXT NOT NULL,
    reservation_date 		DATE NOT NULL,
    reservation_start_time 	TIME NOT NULL CHECK (
								reservation_start_time >= '07:00:00' AND reservation_start_time < '22:00:00' AND
								EXTRACT(MINUTE FROM reservation_start_time) = 0 AND 
								EXTRACT(SECOND FROM reservation_start_time) = 0
							),
    reservation_end_time 	TIME NOT NULL CHECK (
								reservation_end_time > '07:00:00' AND reservation_end_time <= '22:00:00' AND
								EXTRACT(MINUTE FROM reservation_end_time) = 0 AND 
								EXTRACT(SECOND FROM reservation_end_time) = 0
							),
    request_status 			TEXT NOT NULL DEFAULT 'Pending' CHECK (request_status IN (
								'Pending',
								'Approved with Pending Documents',
								'Disapproved',
								'Finalized',
								'Cancelled'
							)),
    attachments             TEXT[],
                            -- filename format: <Surname><First and Middle Name Initials>_<Document Type>.pdf
                            -- sample valid filenames: PendonRJP_letter.pdf, SantosPJSB_form.pdf, MindoRM_receipt.pdf, PangaECIIIV_other.pdf
    created_at 				TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at 				TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at 				TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE CASCADE
);

-- create table for log
CREATE TABLE IF NOT EXISTS log (
    log_id 					UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id 				UUID,
    request_id 				UUID ,
    log_type 				TEXT NOT NULL CHECK (log_type IN (
								'User Created an Account',
                                'User Updated their Account',
                                'User Deactivated their Account',
                                
                                'User Opened an Inquiry',
                                'User Created a Request',
                                'User Uploaded Files',
                                'User Updated Files',
                                'User Updated their Request',
                                'User Cancelled their Request',
                                
                                'Admin Closed an Inquiry',
                                'Admin Approved a Request',
                                'Admin Disapproved a Request',
                                'Admin Finalized a Request',
                                'Admin Deleted a Request',
                                'Admin Cancelled Overdue Requests',

                                'Super Admin Disabled a Feature',
                                'Super Admin Enabled a Feature',
                                'Super Admin Deleted All Logs',
                                -- Note: Super Admin Has No Functionality to Add a User
                                'Super Admin Edited a User',
                                'Super Admin Deleted a User',
                                'Super Admin Added a Room',
                                'Super Admin Edited a Room',
                                'Super Admin Deleted a Room',
                                'Super Admin Added a Schedule',
                                'Super Admin Edited a Schedule',
                                'Super Admin Deleted a Schedule',
                                'Super Admin Deleted all Logs'
    						)),
    remarks 				TEXT NOT NULL DEFAULT 'N/A',
    created_at 				TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at 				TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at 				TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES request(request_id) ON DELETE CASCADE
);

-- create table for permission
CREATE TABLE IF NOT EXISTS permission (
    permission_id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_type 				TEXT CHECK (user_type IN (
                                'Faculty',
                                'Student',
                                'Student Organization',
                                'Admin',
                                'Guest',
                                'Super Admin'
                            )),
    permission_name         TEXT NOT NULL,
    is_enabled              BOOLEAN DEFAULT TRUE NOT NULL
);

-- create table for announcement
CREATE TABLE IF NOT EXISTS announcement (    
    announcement_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content                 TEXT NOT NULL,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at              TIMESTAMP WITH TIME ZONE
);