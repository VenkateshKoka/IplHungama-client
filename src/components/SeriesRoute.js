import React, {useContext, useState, useEffect} from 'react';
import {Route, Link} from 'react-router-dom';


const SeriesRoute = ({children, ...rest}) => {
    const navLinks = () => (
        <nav>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link  className="nav-link" to={`/cbzios/series/${rest.computedMatch.params.seriesid}`}>
                        Series Details
                    </Link>
                    <Link  className="nav-link" to={`/cbzios/series/${rest.computedMatch.params.seriesid}/teams`}>
                        Teams
                    </Link>
                </li>
            </ul>
        </nav>
    );

    const renderContent = () => (
        <div className="container-fluid pt-5">
            <div className="row">
                <div className="col-md-3">
                    {navLinks()}
                </div>
                <div className="col-md-9">
                    <Route {...rest}/>
                </div>
            </div>
        </div>
    )

    return renderContent();

}

export default SeriesRoute;