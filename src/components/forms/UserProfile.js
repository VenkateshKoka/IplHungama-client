import React from "react";

const UserProfile = ({handleSubmit, handleChange, username, name, email, about, loading}) => (
    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Username</label>
            <input type="text"
                   name="username"
                   value={username}
                   className="form-control"
                   placeholder="Username"
                   disabled={loading}
                   onChange={handleChange}/>
        </div>
        <div className="form-group">
            <label>Name</label>
            <input type="text"
                   name="name"
                   value={name}
                   className="form-control"
                   placeholder="Name"
                   disabled={loading}
                   onChange={handleChange}/>
        </div>
        <div className="form-group">
            <label>Email</label>
            <input type="email"
                   name="email"
                   value={email}
                   className="form-control"
                   placeholder="Email"
                   disabled
                   onChange={handleChange}/>
        </div>
        <div className="form-group">
            <label>About</label>
            <textarea
                name="about"
                value={about}
                className="form-control"
                placeholder="About"
                disabled={loading}
                onChange={handleChange}/>
        </div>
        <button className="btn btn-primary" type="submit" disabled={!email || loading}>
            Submit
        </button>
    </form>
);


export default UserProfile;