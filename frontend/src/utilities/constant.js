/**
 * Constants Definitions Module
 * 
 * @description Moved all constants used in this app into this file.
 * @author Rheana Mindo
 * @date 04/13/2024
 * 
 * @description Added constants for room types, utility workers, and faculty.
 * @author Eric Conrad Panga
 * @date 04/18/2024
 */

const USER_TYPES = {
    FACULTY: 'Faculty',
    STUDENT: 'Student',
    STUDENT_ORGANIZATION: 'Student Organization',
    ADMIN: 'Admin',
    GUEST: 'Guest',
    SUPER_ADMIN: 'Super Admin'
};

const ROOM_TYPES = {
    LECTURE_HALL: 'Lecture Hall',
    PC_LAB: 'PC Laboratory'
};

const ROOM_NAMES = {
    ICS_MEGA_HALL: 'Eliezer A. Albacea LH',
    ICS_LECTURE_HALL_3: 'Santiago M. Alviar LH',
    ICS_LECTURE_HALL_4: 'Manuel M. Manuel LH',
    PC_LAB_C100: 'PC Lab C100',
    PC_LAB_1: 'PC Lab 1',
    PC_LAB_2: 'PC Lab 2',
    PC_LAB_3: 'PC Lab 3',
    PC_LAB_4: 'PC Lab 4',
    PC_LAB_5: 'PC Lab 5',
    PC_LAB_6: 'PC Lab 6',
    PC_LAB_7: 'PC Lab 7',
    PC_LAB_8: 'PC Lab 8',
    PC_LAB_9: 'PC Lab 9'
};

const UTILITY_WORKERS = {
    REGGIE_PELAYO: 'Reggie Pelayo',
    ROMEL_LAWAS: 'Romel Lawas',
}

const UTILITY_FEE = 200;

const DAYS_OF_WEEK = {
    SUNDAY: 'Sunday',
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
};

const FACULTY = {
    ALBACEA: 'Albacea',
    ANGCANA: 'Angcana',
    ANACLETO: 'Anacleto',
    ANGELES: 'Angeles',
    ARAGONES: 'Aragones',
    BAWAGAN: 'Bawagan',
    CAMACLANG: 'Camaclang',
    CAPUCHINO: 'Capuchino',
    CLARIÑO: 'Clariño',
    CUNANAN: 'Cunanan',
    DIONISIO: 'Dionisio',
    DORIA: 'Doria',
    GERONIMO: 'Geronimo',
    GOJO_CRUZ: 'Gojo Cruz',
    HAO: 'Hao',
    HERMOCILLA: 'Hermocilla',
    ISUNGGA: 'Isungga',
    JACILDO: 'Jacildo',
    KHAN: 'Khan',
    LACTUAN: 'Lactuan',
    LAPITAN: 'Lapitan',
    MADRID: 'Madrid',
    MERCADO_D: 'Mercado D',
    MERCADO_R: 'Mercado R',
    NADUA: 'Nadua',
    PABICO: 'Pabico',
    PATERNO: 'Paterno',
    RECARIO: 'Recario',
    ROXAS: 'Roxas',
    SAMANIEGO: 'Samaniego',
    TUMIBAY: 'Tumibay'
};

const REQUEST_STATUSES = {
    PENDING: 'Pending',
    APPROVED: 'Approved with Pending Documents',
    DISAPPROVED: 'Disapproved',
    FINALIZED: 'Finalized',
    CANCELLED: 'Cancelled'
};

const LOG_TYPES = {
    USER_CREATES_ACCOUNT: 'User Created an Account',
    USER_UPDATES_ACCOUNT: 'User Updated their Account',
    USER_DELETES_ACCOUNT: 'User Deactivated their Account',
    
    USER_OPENS_INQUIRY: 'User Opened an Inquiry',
    USER_CREATES_REQUEST: 'User Created a Request',
    USER_UPLOADS_FILES: 'User Uploaded Files',
    USER_UPDATES_FILES: 'User Updated Files',
    USER_UPDATES_REQUEST: 'User Updated their Request',
    USER_CANCELS_REQUEST: 'User Cancelled their Request',
    
    ADMIN_CLOSES_INQUIRY: 'Admin Closed an Inquiry',
    ADMIN_APPROVES_REQUEST: 'Admin Approved a Request',
    ADMIN_DISAPPROVES_REQUEST: 'Admin Disapproved a Request',
    ADMIN_FINALIZES_REQUEST: 'Admin Finalized a Request',
    ADMIN_DELETES_REQUEST: 'Admin Deleted a Request',
    ADMIN_CANCELS_OVERDUE_REQUESTS: 'Admin Cancelled Overdue Requests',

    SUPER_ADMIN_DISABLES_FEATURE: 'Super Admin Disabled a Feature',
    SUPER_ADMIN_ENABLES_FEATURE: 'Super Admin Enabled a Feature',
    SUPER_ADMIN_DELETES_ALL_LOGS: 'Super Admin Deleted All Logs',
    // Note: Super Admin Has No Functionality to Add a User
    SUPER_ADMIN_EDITS_USER: 'Super Admin Edited a User',
    SUPER_ADMIN_DELETES_USER:'Super Admin Deleted a User',
    SUPER_ADMIN_ADDS_ROOM: 'Super Admin Added a Room',
    SUPER_ADMIN_EDITS_ROOM: 'Super Admin Edited a Room',
    SUPER_ADMIN_DELETES_ROOM: 'Super Admin Deleted a Room',
    SUPER_ADMIN_ADDS_SCHEDULE: 'Super Admin Added a Schedule',
    SUPER_ADMIN_EDITS_SCHEDULE: 'Super Admin Edited a Schedule',
    SUPER_ADMIN_DELETES_SCHEDULE: 'Super Admin Deleted a Schedule'
};

const GROUP_INQUIRIES = [
    LOG_TYPES.USER_OPENS_INQUIRY,
    LOG_TYPES.ADMIN_CLOSES_INQUIRY,
]

const GROUP_REQUESTS = [
    LOG_TYPES.USER_CREATES_REQUEST,
    LOG_TYPES.USER_UPLOADS_FILES,
    LOG_TYPES.USER_UPDATES_FILES,
    LOG_TYPES.USER_UPDATES_REQUEST,
    LOG_TYPES.USER_CANCELS_REQUEST,
    LOG_TYPES.ADMIN_APPROVES_REQUEST,
    LOG_TYPES.ADMIN_DISAPPROVES_REQUEST,
    LOG_TYPES.ADMIN_FINALIZES_REQUEST,
    LOG_TYPES.ADMIN_DELETES_REQUEST,
    LOG_TYPES.ADMIN_CANCELS_OVERDUE_REQUESTS,
]

const LOG_GROUPS = {
    INQUIRIES: GROUP_INQUIRIES,
    REQUESTS: GROUP_REQUESTS,
    // Other log types
    OTHER: Object.values(LOG_TYPES).filter((x) => !(
        GROUP_INQUIRIES.includes(x) ||
        GROUP_REQUESTS.includes(x)
    ))
}

const PERMISSIONS = {
    ALLOW_LOGIN: 'Allow Login',
    ALLOW_SIGNUP: 'Allow Signup' 
};

const CLOUDINARY_FOLDER_NAMES = {
    ATTACHMENTS: 'attachments',
    DISPLAY_PICTURES: 'display pictures',
    ROOM_PICTURES: 'room images'
}

const IMAGE_DIMENSIONS = {
    DISPLAY_PICTURE: 720,
    ROOM_IMAGE_HEIGHT: 1020,
    ROOM_IMAGE_WIDTH: 1360
}

const SUMMARY_REPORT = {
    SEM_NUM: '2nd Semester',
    SEM_START: '2024-02-05',
    SEM_END: '2024-05-31',
    ACAD_YEAR: '2023-2024'
}

const EMPTY = "N/A";
  
module.exports = {
    USER_TYPES,
    ROOM_TYPES,
    ROOM_NAMES,
    DAYS_OF_WEEK,
    FACULTY,
    UTILITY_WORKERS,
    UTILITY_FEE,
    REQUEST_STATUSES,
    LOG_TYPES,
    LOG_GROUPS,
    PERMISSIONS,
    CLOUDINARY_FOLDER_NAMES,
    IMAGE_DIMENSIONS,
    SUMMARY_REPORT,
    EMPTY
};