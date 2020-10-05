import React from "react";

const Image = ({image, handleImageRemove= f => f}) => (
    <img
        className="img-thumbnail m-3"
        src={image.url}
        key={image.public_id}
        alt={image.public_id}
        style={{height:'100px'}}
        onClick={() => handleImageRemove(image.public_id)}
    />
);

export default Image;
