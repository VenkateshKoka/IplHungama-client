import React, {useState, useEffect, Fragment, useMemo} from "react";
import {useQuery, useLazyQuery, useMutation} from '@apollo/react-hooks';
import axios from "axios";
import {Link, useParams} from 'react-router-dom';
import {toast} from "react-toastify";
import {SERIES_CREATE} from "../../graphql/mutations";
import {SERIES_DETAILS} from "../../graphql/queries";

const initialState = {};

const Teams = () => {
    const params  = useParams();
    const [teamsData, setTeamsData] = useState(initialState);

    const fetchSeriesTeam = async (parent, args) => {
        const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/series/${params.seriesid}/teams`)
            .then((response)=> {
                console.log("series teams details",response.data);
                setTeamsData(response.data);
            })
            .catch((error) => {
                console.log('The series teams details error is ', error)
            })
    }

    useEffect(() => {
        fetchSeriesTeam();
    }, [])

    return (
        <div className="container">
            {/*{JSON.stringify(teamsData)}*/}
            {teamsData.teams && teamsData.teams.map((team) =>
                <div className="container teamName p-2 m-4 border" key={team.id}>
                    <Link to={`/cbzios/series/${params.seriesid}/teams/${team.id}`} style={{display:'flex', alignItems:'center', textDecoration:'none', flexDirection:'column'}}>
                        {team.name} ({team.s_name})
                        <div className="mt-1">
                            {team.captain}
                        </div>
                    </Link>

                    {/*<img src={team.img} style={{maxHeight:'200px'}}/>*/}
                </div>
            )}
        </div>
    )
}

export default Teams;