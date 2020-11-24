import React, {useState, useEffect, Fragment} from "react";
import axios from "axios";
import {useParams} from 'react-router-dom';
const request = require('request');

const Match = () => {
    const [matchData, setMatchData] = useState({});
    const [matchCommentary, setMatchCommentary] = useState({});
    const [rapidMatchData, setRapidMatchData] = useState({});
    const [rapidMatchCommentaryData, setRapidMatchCommentaryData] = useState({});
    const params  = useParams();

    const fetchRapidMatchDetails = async (parent, args) => {
        const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/rapidapi/match/${params.matchid}`)
            .then((response)=> {
                console.log("match details",response.data);
                setRapidMatchData(response.data);

            })
            .catch((error) => {
                console.log('The match details error is ', error)
            })
    }

    const fetchRapidMatchCommentaryDetails = async (parent, args) => {
        const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/rapidapi/match/${params.matchid}/commentary`)
            .then((response)=> {
                console.log("match commentary",response.data);
                setRapidMatchCommentaryData(response.data);

            })
            .catch((error) => {
                console.log('The match details error is ', error)
            })
    }

    const fetchMatchDetails = async (parent, args) => {
        // const response = await axios({
        //     "method":"GET",
        //     "url":"https://mapps.cricbuzz.com/cbzios/match/schedule",
        // });
        const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/match/${params.matchid}`)
            .then((response)=> {
                console.log("match details",response.data);
                setMatchData(response.data);

            })
            .catch((error) => {
                console.log('The match details error is ', error)
            })
    }

    const fetchMatchCommentary = async (parent, args) => {
        // setInterval( () => {
        //      axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/match/${params.matchid}/commentary`)
        //         .then((response)=> {
        //             console.log("match commentary", response.data.comm_lines);
        //             setMatchCommentary(response.data);
        //
        //         })
        //         .catch((error) => {
        //             console.log('The match commentary error is ', error)
        //         })
        // }, 6000);

        await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/match/${params.matchid}/commentary`)
            .then((response)=> {
                console.log("match commentary", response.data);
                setMatchCommentary(response.data);

            })
            .catch((error) => {
                console.log('The match commentary error is ', error)
            })
    }

    useEffect(() => {
        fetchMatchDetails();
        fetchMatchCommentary();
        fetchRapidMatchDetails();
        fetchRapidMatchCommentaryDetails();
    }, []);

    return (
        <div className="container">
            {rapidMatchData.match &&
                <div>
                    {rapidMatchData.match.name} and<b>{rapidMatchData.match.status}</b>
                    <br/>
                    <div>
                        <img src={rapidMatchData.match.homeTeam.logoUrl} style={{maxHeight: '100px'}}/>
                        <span> VS </span>
                        <img src={rapidMatchData.match.awayTeam.logoUrl} style={{maxHeight: '100px'}}/>
                    </div>
                current status:{rapidMatchData.match.currentMatchState}</div>
            }
            {rapidMatchCommentaryData.meta &&
            <div>
                <span> Current Run Rate: {rapidMatchCommentaryData.meta.currentRunRate}  Required Run Rate: {rapidMatchCommentaryData.meta.requiredRunRate}
                </span>
            </div>
            }
            { rapidMatchCommentaryData.matchDetail &&
                <div>
                    <div>
                        Bowler: {rapidMatchCommentaryData.matchDetail.bowler.name}
                        economy: {rapidMatchCommentaryData.matchDetail.bowler.economy}
                        stats: {rapidMatchCommentaryData.matchDetail.bowler.wickets}-{rapidMatchCommentaryData.matchDetail.bowler.runsAgainst}
                        <br/>
                        {rapidMatchCommentaryData.matchDetail.currentBatters.map((batsman) => (
                            <div key={batsman.name}>{batsman.name}: {batsman.runs}({batsman.ballsFaced})  Strike rate: {batsman.strikeRate}</div>
                        ))}
                    </div>
                </div>
            }


            {matchData.header && <pre><b>{matchData.header.toss}</b><br/>current status:{matchData.header.status}</pre>}

            {matchCommentary.bat_team && matchCommentary.bat_team.innings.map((innings, index) => {
                return(
                    <Fragment key={innings.id}>
                        <pre>score: {innings.score}/{innings.wkts}  Overs:{innings.overs}</pre>
                        {/*{new Date(parseFloat(line.timestamp)).toLocaleString()}: {line.comm}*/}
                    </Fragment>
                )
            })}
            {matchCommentary.comm_lines && matchCommentary.comm_lines.map((line, index) => {
                return(
                    <div key={index}>
                        {}
                        {/*{new Date(parseFloat(line.timestamp)).toLocaleString()}:*/}
                        <div>
                            {line.o_no} <span dangerouslySetInnerHTML={ { __html: line.comm } }></span>
                            <p/>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Match;