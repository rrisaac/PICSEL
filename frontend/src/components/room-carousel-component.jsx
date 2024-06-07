/*
Description: This is a component that displays a carousel of images of a room.

@author: Aljon Novelo
@date: 03/31/2024
*/

import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const RoomCarouselComponent = ({ assets, alt }) => {
    return (
        <Carousel interval={null} className="room-carousel-container">
            {assets.map((image, index) => (
                <Carousel.Item key={index} className="room-carousel-content">
                    <img
                        className="room-carousel-image"
                        src={image}
                        alt={alt}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default RoomCarouselComponent;
