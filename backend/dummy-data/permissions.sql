/* 
    Description: This file is for inserting data into the permission table.

    @author Eric Conrad Panga
    @date 05/01/2024
*/

INSERT INTO permission (
    permission_id, 
    user_type, 
    permission_name, 
    is_enabled
) VALUES
    -- Account settings permissions
    ('24918b13-08c0-437a-816f-74de513c16fe', 'Student Organization', 'Allow Account Settings', TRUE),
    ('36b1b7b2-31ff-4816-b7b2-cecf1b59fcde', 'Student', 'Allow Account Settings', TRUE),
    ('f8720b0a-99cc-4531-a4ec-6222e1347e91', 'Guest', 'Allow Account Settings', TRUE),
    ('4eae0215-8e8e-41c5-b432-df0efbf16391', 'Faculty', 'Allow Account Settings', TRUE),
    ('b70d3157-6ab1-4e38-916b-1349b0763836', 'Admin', 'Allow Account Settings', TRUE),
    
    -- Activity log permissions
    ('51b14182-d5e3-4e77-9446-8345f21ce7b0', 'Student Organization', 'Allow Activity Log', TRUE),
    ('63cce437-2626-45cb-900a-a656918dc290', 'Student', 'Allow Activity Log', TRUE),
    ('57dfb923-efe9-4d4a-b5bf-6e23d4a5f4b9', 'Guest', 'Allow Activity Log', TRUE),
    ('c86b00c1-6984-46c3-81b5-94e5e56c979d', 'Faculty', 'Allow Activity Log', TRUE),
    ('8da417f9-1fc5-4850-9d17-5c92808d524b', 'Admin', 'Allow Activity Log', TRUE),

    -- Rooms permissions
    ('df4a30a7-ea53-49fd-ae8b-a9edd8968904', 'Student Organization', 'Allow Rooms', TRUE),
    ('38ebb9ab-a1c9-4037-8b39-1f1d90be93d4', 'Student', 'Allow Rooms', TRUE),
    ('73ffed01-cc30-4508-8629-99b62e05588b', 'Guest', 'Allow Rooms', TRUE),
    ('69fdfb61-e50a-485b-8dbd-ca4e1a7e4172', 'Faculty', 'Allow Rooms', TRUE),
    ('130a035d-a188-45ae-bfc7-ca72803778de', 'Admin', 'Allow Rooms', TRUE),

    -- Calendar permissions
    ('1ecc0ec8-fbed-401a-bb23-44c8f6ee6d21', 'Student Organization', 'Allow Calendar', TRUE),
    ('aa6060a3-adaf-434f-ac07-4ff83cd142ef', 'Student', 'Allow Calendar', TRUE),
    ('75a4ec69-f6c8-4a2e-bb26-0fc5d5e81014', 'Guest', 'Allow Calendar', TRUE),
    ('b6b525c1-c822-45d9-834c-c00d0286adc6', 'Faculty', 'Allow Calendar', TRUE),
    ('15d75ac5-efa4-47f9-88f8-512cf462e738', 'Admin', 'Allow Calendar', TRUE),

    -- Book reservation permissions
    ('b151b127-b434-42c3-99a5-76f112b2923c', 'Student Organization', 'Allow Book Reservation', TRUE),
    ('17217ed9-26aa-487a-b103-2a7ac933d140', 'Student', 'Allow Book Reservation', TRUE),
    ('3e0e241a-89dc-4562-86aa-5362edbc0172', 'Guest', 'Allow Inquire Reservation', TRUE),
    ('e02821cd-45c3-453e-9eca-977e9f8328b6', 'Faculty', 'Allow Book Reservation', TRUE),
    ('da42be2b-a681-4915-8644-dfe73882faab', 'Admin', 'Allow Inquire Reservation', TRUE),

    -- Booking status permissions
    ('3f3ccd52-2367-4a5a-982d-01ae9e4ac147', 'Student Organization', 'Allow Booking Status', TRUE),
    ('258a9b3d-82f8-4b23-8929-347122b00669', 'Student', 'Allow Booking Status', TRUE),
    ('148b2a6d-4821-484b-929c-f7a23312a08b', 'Guest', 'Allow Booking Status', TRUE),
    ('b7ca363a-9211-47f4-9178-c44beceaf41c', 'Faculty', 'Allow Booking Status', TRUE),

    -- Admin specific permissions
    ('a0ab7e81-331b-4865-91bd-eb4aab99dd13', 'Admin', 'Allow Booking Request', TRUE),
    ('e15b5c36-c5f5-41de-8754-e4df830b96eb', 'Admin', 'Allow Book Guest', TRUE),
    ('3566b6ef-2b0a-45ae-a70f-9fc73b62796f', 'Admin', 'Allow Dashboard', TRUE),

    -- Dashboard permissions
    ('5015417d-57fc-40f9-b1a2-e48ddec1f5bf', 'Student Organization', 'Allow Dashboard', TRUE),
    ('f9cad62b-d625-4b56-a287-097d248bfb2e', 'Student', 'Allow Dashboard', TRUE),
    ('b8300d78-60c4-4c8d-8fee-201746bed540', 'Guest', 'Allow Dashboard', TRUE),
    ('d1e824a4-3785-4349-a88c-51a1c9401ebf', 'Faculty', 'Allow Dashboard', TRUE),

    -- Login permission
    ('bdb24128-d183-4c1b-8a49-2456131625e5', NULL, 'Allow Login', TRUE),

    -- Signup permission
    ('f8bf6d5c-cca2-4572-abcc-73b29a1590b8', NULL, 'Allow Signup', TRUE);