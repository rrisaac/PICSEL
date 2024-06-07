/**
 * @description Inserted initial dummy data into the room table.
 * @author Pamela Joy Santos
 * @date 04/08/2024
 * 
 * @description Added comprehensive attributes for rooms, including type, amenities, media, and utility details.
 * @author Eric Conrad Panga
 * @date 04/18/2024
 */

INSERT INTO room (
    room_id,
    room_type,
    room_name,
    description,
    amenities,
    images,
    utility_worker,
    utility_fee,
    capacity,
    rate
) VALUES 
    -- ICS Mega Hall
    (
        'be30be14-0bc2-4dd2-b879-898859742325', 
        'Lecture Hall', 
        'ICS Mega Hall', 
        'Reserve ICS Mega Hall for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Sound System', 'LCD Projector and Screen', 'Desktop Computer Running Linux'], 
        ARRAY['room images/ICS Mega Hall_0b69a1ec'],  
        'Reggie Pelayo', 
        200, 
        220, 
        1650
    ),

    -- ICS Lecture Hall 3
    (
        '2511587a-59b2-4b07-a844-d83f40597ff5', 
        'Lecture Hall', 
        'ICS Lecture Hall 3', 
        'Reserve Lecture Hall 3 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Sound System', 'LCD Projector and Screen', 'Desktop Computer Running Linux'], 
        ARRAY['room images/ICS Lecture Hall 3_13230d5f'],  
        'Romel Lawas', 
        200, 
        110, 
        825
    ),

    -- ICS Lecture Hall 4
    (
        '8dbd295d-f4ab-4311-868c-140a64f9a05e', 
        'Lecture Hall', 
        'ICS Lecture Hall 4', 
        'Reserve Lecture Hall 4 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Sound System', 'LCD Projector and Screen', 'Desktop Computer Running Linux'], 
        ARRAY['room images/ICS Lecture Hall 4_ff63bdcd'],  
        'Romel Lawas', 
        200, 
        110, 
        825
    ),

    -- PC Lab C100
    (
        '89d7ac01-eedd-41dd-b741-1b5f27cd92c3', 
        'PC Laboratory', 
        'PC Lab C100', 
        'Reserve PC Lab C100 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Desktop Computers', 'LCD Projector and Screen'], 
        ARRAY['room images/PC Lab C100_fcf4b4e5'],  
        'Romel Lawas', 
        200, 
        24, 
        120
    ),

    -- PC Lab 1
    (
        '4f1dc471-d0b9-4215-986b-4d59e72506f5', 
        'PC Laboratory', 
        'PC Lab 1', 
        'Reserve PC Lab 1 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Desktop Computers', 'LCD Projector and Screen'], 
        ARRAY['room images/PC Lab 1_a5b51b09'],  
        'Reggie Pelayo', 
        200, 
        16, 
        120
    ),

    -- PC Lab 2
    (
        '88dd05f0-8355-4750-a777-482daaf67cb6', 
        'PC Laboratory', 
        'PC Lab 2', 
        'Reserve PC Lab 2 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Desktop Computers', 'LCD Projector and Screen'], 
        ARRAY['room images/PC Lab 2_c6de6822'],  
        'Reggie Pelayo', 
        200, 
        24, 
        120
    ),

     -- PC Lab 3
    (
        'e356debb-580c-4aa7-9b72-9b146eb6e66b', 
        'PC Laboratory', 
        'PC Lab 3', 
        'Reserve PC Lab 3 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Desktop Computers', 'LCD Projector and Screen'], 
        ARRAY['room images/PC Lab 3_71519a53'],  
        'Reggie Pelayo', 
        200, 
        24, 
        120
    ),

    -- PC Lab 4
    (
        '8abe8078-0466-4bc9-bfc7-058ef0bd04cb', 
        'PC Laboratory', 
        'PC Lab 4', 
        'Reserve PC Lab 4 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Desktop Computers', 'LCD Projector and Screen'], 
        ARRAY['room images/PC Lab 4_ec01b5f1'],  
        'Reggie Pelayo', 
        200, 
        22, 
        120
    ),

    -- PC Lab 5
    (
        'c2d035df-bb7f-44a3-9009-080e7400b595', 
        'PC Laboratory', 
        'PC Lab 5', 
        'Reserve PC Lab 5 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Desktop Computers', 'LCD Projector and Screen'], 
        ARRAY['room images/PC Lab 5_06e90588'],  
        'Reggie Pelayo', 
        200, 
        22, 
        120
    ),

    -- PC Lab 6
    (
        'e48a9cd5-27b1-4880-9c71-0be4c074feb5', 
        'PC Laboratory', 
        'PC Lab 6', 
        'Reserve PC Lab 6 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Desktop Computers', 'LCD Projector and Screen'], 
        ARRAY['room images/PC Lab 6_cceeb439'],  
        'Romel Lawas', 
        200, 
        24, 
        120
    ),

    -- PC Lab 7
    (
        '867705d1-71a3-4ad3-9fc0-1d8c461542b9', 
        'PC Laboratory', 
        'PC Lab 7', 
        'Reserve PC Lab 7 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Desktop Computers', 'LCD Projector and Screen'], 
        ARRAY['room images/PC Lab 7_6d0a2a3a'],  
        'Romel Lawas', 
        200, 
        24, 
        120
    ),

    -- PC Lab 8
    (
        '3d6bf6da-17d1-4b65-9149-d9da47722e95', 
        'PC Laboratory', 
        'PC Lab 8', 
        'Reserve PC Lab 8 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Desktop Computers', 'LCD Projector and Screen'], 
        ARRAY['room images/PC Lab 8_4cf1db75'],  
        'Romel Lawas', 
        200, 
        22, 
        120
    ),

    -- PC Lab 9
    (
        '44c8f09d-4efd-484c-8ff4-3f9edfecd687', 
        'PC Laboratory', 
        'PC Lab 9', 
        'Reserve PC Lab 9 for your next event! With standard amenities and a functional layout, it is an ideal space for formal events. Equipped with basic seating and audiovisual resources, it provides a simple yet practical setting for successful gatherings.', 
        ARRAY['Air Conditioning', 'Desktop Computers', 'LCD Projector and Screen'], 
        ARRAY['room images/PC Lab 9_b717b360'],  
        'Romel Lawas', 
        200, 
        22, 
        120
    );