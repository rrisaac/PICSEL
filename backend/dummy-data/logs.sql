/* 
    Description: This file is for inserting dummy data into the log table.

    @author Rainier Pendon
    @date 04/07/2024
*/

INSERT INTO log (
    user_id, 
    request_id, 
    log_type, 
    remarks
) VALUES
    -- Prince Czedrick Nepomuceno, UPLB COSS Career Orientation, Cancelled
    (
        '71081258-8ac7-468c-bf12-1485f6818b1b', 
        '572973f1-c595-4550-ad3a-7b6e5a8fee40', 
        'User Creates Request', 
        'N/A'
    ),
    (
        'ece7add0-12a7-4170-98c1-61f441cbb95a', 
        '572973f1-c595-4550-ad3a-7b6e5a8fee40', 
        'Admin Approves Request', 
        'N/A'
    ),
    (
        '71081258-8ac7-468c-bf12-1485f6818b1b', 
        '572973f1-c595-4550-ad3a-7b6e5a8fee40', 
        'User Uploads Files', 
        'N/A'
    ),
    (
        '71081258-8ac7-468c-bf12-1485f6818b1b', 
        '572973f1-c595-4550-ad3a-7b6e5a8fee40', 
        'User Cancels Request', 
        'Event to be rescheduled'
    ),

    -- Eric Conrad Panga, UP SILAKBO Soundcheck, Cancelled
    (
        'ba8b68d3-b894-44fe-8749-894bf246c304', 
        '5d312f10-a075-4bda-bd42-eacb6c814167', 
        'User Creates Request', 
        'N/A'
    ),
    (
        'ece7add0-12a7-4170-98c1-61f441cbb95a', 
        '5d312f10-a075-4bda-bd42-eacb6c814167', 
        'Admin Approves Request', 
        'N/A'
    ),
    (
        'ba8b68d3-b894-44fe-8749-894bf246c304', 
        '5d312f10-a075-4bda-bd42-eacb6c814167', 
        'User Cancels Request', 
        'Event venue moved elsewhere'
    ),
    
    -- Reginald Neil Recario, CMSC 127 Project Presentation, Disapproved
    (
        'ff606b98-ebb2-4a9d-9a0d-5f18f8e7b3f3', 
        '72491632-5b91-4140-bb6f-f222a18f7d86', 
        'User Creates Request', 
        'N/A'
    ),
    (
        'ece7add0-12a7-4170-98c1-61f441cbb95a', 
        '72491632-5b91-4140-bb6f-f222a18f7d86', 
        'Admin Disapproves Request', 
        'Room under maintenance'
    ),
    
    -- Rainier Pendon, CMSC 137 Review Session, Pending
    (
        '9c9ff7a6-e93f-48fd-9a41-9d394b1fae2f', 
        'c441e76b-8a41-4217-81ee-d7c629c7c758', 
        'User Creates Request', 
        'N/A'
    ),

    -- Pamela Joy Santos, CMSC 180 Review Session, Pending
    (
        'a61ccb1f-f009-49f7-8b4f-67a2e7441fb8', 
        'a3976b95-fef8-45cc-857b-bfbec3d14335', 
        'User Creates Request', 
        'N/A'
    ),
    
    -- Rheana Mindo, CMSC 128 Review Session, Pending
    (
        '5b376a13-8dd0-44b4-8d76-c7163f1fd26b', 
        '4c177a45-e130-49ac-89c2-5f76fbaeb67f', 
        'User Creates Request', 
        'N/A'
    ),

    -- Prince Czedrick Nepomuceno, UPLB COSS Game Jam, Approved with Pending Documents
    (
        '71081258-8ac7-468c-bf12-1485f6818b1b', 
        'b47ef35b-c524-4e2c-91ac-5eb2afb6d9c0', 
        'User Creates Request', 
        'N/A'
    ),
    (
        'ece7add0-12a7-4170-98c1-61f441cbb95a', 
        'b47ef35b-c524-4e2c-91ac-5eb2afb6d9c0', 
        'Admin Approves Request', 
        'N/A'
    ),

    -- Prince Karlo Aragones, CMSC 170 Project Presentation, Approved with Pending Documents
    (
        '2ac1cd05-a056-4702-84a8-bf2b058c410f', 
        '3bf96041-8d5d-4290-95da-21d578431114', 
        'User Creates Request', 
        'N/A'
    ),
    (
        'ece7add0-12a7-4170-98c1-61f441cbb95a', 
        '3bf96041-8d5d-4290-95da-21d578431114', 
        'Admin Approves Request', 
        'N/A'
    ),

    -- Denis Villeneuve, Filmmaking Workshop, Finalized
    (
        '16f9a277-99ed-4b95-ad5c-8558ef02f239', 
        'ce6a0542-78d2-4023-afcb-a532e7172acd', 
        'User Creates Request', 
        'N/A'
    ),
    (
        'ece7add0-12a7-4170-98c1-61f441cbb95a', 
        'ce6a0542-78d2-4023-afcb-a532e7172acd', 
        'Admin Approves Request', 
        'N/A'
    ),
    (
        '16f9a277-99ed-4b95-ad5c-8558ef02f239', 
        'ce6a0542-78d2-4023-afcb-a532e7172acd', 
        'User Uploads Files', 
        'N/A'
    ),
    (
        'ece7add0-12a7-4170-98c1-61f441cbb95a', 
        'ce6a0542-78d2-4023-afcb-a532e7172acd', 
        'Admin Finalizes Request', 
        'N/A'
    ),

    -- Reginald Neil Recario, CMSC 128 Midterm Exam, Finalized
    (
        'ff606b98-ebb2-4a9d-9a0d-5f18f8e7b3f3', 
        'ecdcf5b5-a2e4-4d7d-8438-b5681e28934f', 
        'User Creates Request', 
        'N/A'
    ),
    (
        'ece7add0-12a7-4170-98c1-61f441cbb95a', 
        'ecdcf5b5-a2e4-4d7d-8438-b5681e28934f', 
        'Admin Approves Request', 
        'N/A'
    ),
    (
        'ff606b98-ebb2-4a9d-9a0d-5f18f8e7b3f3', 
        'ecdcf5b5-a2e4-4d7d-8438-b5681e28934f', 
        'User Uploads Files', 
        'N/A'
    ),
    (
        'ece7add0-12a7-4170-98c1-61f441cbb95a', 
        'ecdcf5b5-a2e4-4d7d-8438-b5681e28934f', 
        'Admin Finalizes Request', 
        'N/A'
    );