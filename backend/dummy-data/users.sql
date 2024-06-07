/* 
    Description: This file is for inserting dummy data into the user_account table.

    @author Rainier Pendon
    @date 04/06/2024
*/

INSERT INTO user_account (
    user_id,
    google_id,
    user_type,
    first_name, 
    middle_name, 
    last_name, 
    email, 
    username, 
    contact_number, 
    display_picture, 
    password,
    student_number,
    organization_name,
    college,
    department
) VALUES 
    -- unhashed value of password for all dummy users is 'P4ssw0rd!'

    -- Student
    (
        '9c9ff7a6-e93f-48fd-9a41-9d394b1fae2f', 
        '86592015683064257489', 
        'Student', 
        'Rainier John', 
        'Pagaduan', 
        'Pendon', 
        'rppendon@up.edu.ph', 
        'rainpends', 
        '0948-121-6202', 
        'display pictures/rppendon_dd6fud', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        '2021-08807', 
        NULL, 
        NULL, 
        NULL
    ),
    (
        'a61ccb1f-f009-49f7-8b4f-67a2e7441fb8', 
        '98765432109876543210', 
        'Student', 
        'Pamela Joy', 
        'San Blas', 
        'Santos', 
        'pssantos1@up.edu.ph', 
        'pam_santos', 
        '0976-244-5872', 
        'display pictures/pssantos1_duxrrx', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        '2021-09663', 
        NULL, 
        NULL, 
        NULL
    ),
    (
        '5b376a13-8dd0-44b4-8d76-c7163f1fd26b', 
        '12345678901234567890', 
        'Student', 
        'Rheana', 
        'Mamaton', 
        'Mindo', 
        'rmmindo1@up.edu.ph', 
        'ray_mindo', 
        '0960-311-7718', 
        'display pictures/rmmindo_pozxsf', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        '2021-00207', 
        NULL, 
        NULL, 
        NULL
    ),
    
    -- Faculty
    (
        'ff606b98-ebb2-4a9d-9a0d-5f18f8e7b3f3', 
        '24780968510293745816', 
        'Faculty', 
        'Reginald Neil', 
        'N/A', 
        'Recario', 
        'rcrecario@up.edu.ph', 
        'reginald_recario', 
        '0936-912-1518', 
        'display pictures/rcrecario_ftcfxc', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        NULL, 
        NULL, 
        'COLLEGE OF ARTS AND SCIENCES', 
        'INSTITUTE OF COMPUTER SCIENCE (ICS)'
    ),
    (
        '11aa66ce-0962-4071-8386-e3a448c00e4f', 
        '23456789012345678901', 
        'Faculty', 
        'Ariel', 
        'N/A', 
        'Doria', 
        'abdoria@up.edu.ph', 
        'ariel_doria', 
        '0935-539-9025', 
        'display pictures/abdoria_enug8o', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        NULL, 
        NULL, 
        'COLLEGE OF ARTS AND SCIENCES', 
        'INSTITUTE OF COMPUTER SCIENCE (ICS)'
    ),
    (
        '2ac1cd05-a056-4702-84a8-bf2b058c410f', 
        '34567890123456789012', 
        'Faculty', 
        'Prince Karlo', 
        'N/A', 
        'Aragones', 
        'pcaragones@up.edu.ph', 
        'prince_aragones', 
        '0912-832-9860', 
        'display pictures/pcaragones_qoxt7r', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        NULL, 
        NULL, 
        'COLLEGE OF ARTS AND SCIENCES', 
        'INSTITUTE OF COMPUTER SCIENCE (ICS)'
    ),
    
    -- Student Organization
    (
        'ba8b68d3-b894-44fe-8749-894bf246c304', 
        '45678901234567890123', 
        'Student Organization', 
        'Eric Conrad', 
        'Valdez', 
        'Panga', 
        'evpanga1@up.edu.ph', 
        'cocoy_slkb', 
        '0908-103-1205', 
        'display pictures/evpanga1_yhqciz', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        NULL, 
        'UP SILAKBO (SLKB)', 
        NULL, 
        NULL
    ),
    (
        '71081258-8ac7-468c-bf12-1485f6818b1b', 
        '51236987402589634780', 
        'Student Organization', 
        'Prince Czedrick', 
        'Monreal', 
        'Nepomuceno', 
        'pmnepomuceno@up.edu.ph', 
        'czed_uplbcoss', 
        '0913-579-1113', 
        'display pictures/pmnepomuceno_dsgvly', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        NULL, 
        'UPLB COMPUTER SCIENCE SOCIETY (UPLB COSS)', 
        NULL, 
        NULL
    ),
    
    -- Admin
    (
        'ece7add0-12a7-4170-98c1-61f441cbb95a', 
        '93674205138924670125', 
        'Admin', 
        'Cecilio', 
        'N/A', 
        'Junsay', 
        'cljunsay@up.edu.ph', 
        'cecilio_junsay', 
        '0924-681-0121', 
        'display pictures/cljunsay_iobxr2', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        NULL, 
        NULL, 
        NULL, 
        NULL
    ),
    
    -- Guest
    (
        '16f9a277-99ed-4b95-ad5c-8558ef02f239', 
        '73014968523784659012', 
        'Guest', 
        'Denis', 
        'N/A', 
        'Villeneuve', 
        'dvilleneuve@gmail.com', 
        'lisan_al_gaib', 
        '0912-345-6789', 
        'display pictures/dvilleneuve_rmbf57', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        NULL, 
        NULL, 
        NULL, 
        NULL
    ),
    
    -- Super Admin
    (
        'fe0371e3-21eb-4595-8e13-26f16f604907', 
        '32185764231594816524', 
        'Super Admin', 
        'Super', 
        'N/A', 
        'Admin', 
        'superadmin@gmail.com', 
        'super_admin', 
        '0999-999-9999', 
        'display pictures/user_dani9g', 
        '$2b$10$9mO6CjP08YPmD6Vwcli6VePcoWTwgdKZ4eHfCnF/u.NS2NO85z4H.', 
        NULL, 
        NULL, 
        NULL, 
        NULL
    );