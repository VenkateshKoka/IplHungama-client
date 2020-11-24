import React, {useState, useEffect, Fragment, useMemo} from "react";
import {useQuery, useLazyQuery, useMutation} from '@apollo/react-hooks';
import axios from "axios";
import {Link, useParams} from 'react-router-dom';
import {toast} from "react-toastify";
import {SERIES_CREATE} from "../../graphql/mutations";
import {SERIES_DETAILS} from "../../graphql/queries";

const initialState = {};

const Team = () => {
    const params  = useParams();
    const [teamData, setTeamData] = useState(initialState);
    const [teamSquadData, setTeamSquadData] = useState([]);
    const [teamMatchesData, setTeamMatchesData] = useState(initialState);

    const fetchTeamDetails = async (parent, args) => {
        const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/series/${params.seriesid}/teams/${params.teamid}`)
            .then((response)=> {
                console.log("team details",response.data);
                setTeamData(response.data);
            })
            .catch((error) => {
                console.log('The team details error is ', error)
            })
    }

    const fetchTeamSquadDetails = async (parent, args) => {
        const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/series/${params.seriesid}/teams/${params.teamid}/squads`)
            .then((response)=> {
                console.log("team squad",response.data);
                setTeamSquadData(response.data);
            })
            .catch((error) => {
                console.log('The team details error is ', error)
            })
    }

    const fetchTeamMatchesDetails = async (parent, args) => {
        const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/series/${params.seriesid}/teams/${params.teamid}/matches`)
            .then((response)=> {
                console.log("team matches",response.data);
                setTeamMatchesData(response.data);
            })
            .catch((error) => {
                console.log('The team details error is ', error)
            })
    }

    useEffect(() => {
        fetchTeamDetails();
        fetchTeamSquadDetails();
        fetchTeamMatchesDetails();
    }, [])

    return (
        <div style={{display:'flex'}}>
            {/*{JSON.stringify(teamSquadData)}*/}
            {/*{JSON.stringify(teamMatchesData)}*/}
            {/*{teamData.series && teamData.series.name}*/}
            <div className="col-md-5" style={{display:'flex', flexWrap:'wrap'}}>
                {teamMatchesData.matches && teamMatchesData.matches.map((match)=>
                    <div className="container teamName p-3 m-2 border" key={match.match_id} style={{maxHeight:'150px'}}>
                        <div style={{display:'flex', alignItems:'center', textDecoration:'none', flexDirection:'column'}}>
                            {match.team1_name.toUpperCase()} vs {match.team2_name.toUpperCase()} at {match.venue.name}
                            <div className="mt-1">
                                {match.header.status}
                                <div className="mt-1">
                                    {match.header.status}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="col-md-7" style={{display:'flex', flexWrap:'wrap'}}>
                {teamSquadData.length > 0 && teamSquadData.map((player) =>
                    <div className="container teamName p-3 m-2 border" key={player.id} style={{maxWidth:'40%'}} >
                        <div style={{display:'flex', alignItems:'center', textDecoration:'none', flexDirection:'column'}}>
                            {player.f_name} ({player.role})
                            <div className="mt-1">
                                {player.style}
                            <div className="mt-1">
                                Age: {player.age}
                            </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Team;