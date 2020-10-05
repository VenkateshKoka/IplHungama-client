import React from "react";
import Image from "./Image";
import {Link} from "react-router-dom";

const UserCard = ({user}) => {
    const {username, images, about} = user;
    return (
        <Link to={`/user/${username}`}>
            <div className="card text-center" style={{minHeight: '375px'}}>
                <div className="card-body">
                    <Image image={images[images.length-1]} />
                    <h4 className="text-primary">@{username}</h4>
                    <hr/>
                    <small>{about}</small>
                </div>
            </div>
        </Link>
    )
};

export default UserCard;