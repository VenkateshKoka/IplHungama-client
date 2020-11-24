import React, {useState, useEffect, Fragment, useMemo, useCallback} from "react";
import {useQuery, useLazyQuery, useMutation} from '@apollo/react-hooks';
import axios from "axios";
import {Link, Route, useParams} from 'react-router-dom';
import {toast} from "react-toastify";
import {SERIES_CREATE} from "../../graphql/mutations";
import {SERIES_DETAILS} from "../../graphql/queries";

const initialState = {
    id:'',
    series: {
        id:'',
        start_date:'',
        end_date:'',
        series_category:'',
        name: ''
    },
    tabs: [{
        id:'',
        header:'',
        url:'',
        default:'',
    }]
};

const Series = ({children,...rest}) => {
    const params  = useParams();
    const [seriesData, setSeriesData] = useState(initialState);
    const [pointTableData, setPointTableData] = useState({});
    const [seriesMatchesData, setSeriesMatchesData] = useState({});
    const [seriesMatchesUrl, setSeriesMatchesUrl] = useState({});
    const [pointTableUrl, setPointTableUrl] = useState('');

    // mutation
    const [seriesCreate] = useMutation(SERIES_CREATE, {
        // update cache
    });
    const [fetchSeriesData, {data: seriesDetails}] = useLazyQuery(SERIES_DETAILS);

    // const fetchSeriesData = async (parent, args) => {
    //     const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/series/${params.seriesid}`)
    //         .then((response)=> {
    //             setSeriesData({...response.data, 'id': response.data.series.id})
    //             console.log("series data", {...response.data, 'id': response.data.series.id})
    //             setPointTableUrl( response.data.tabs && response.data.tabs.filter(tab => tab.id==='pointtable')[0].url);
    //         })
    //         .catch((error) => {
    //             console.log('The match details error is ', error)
    //         })
    // }

    const fetchPointTableData = async (parent, args) => {
        console.log('points table page', pointTableUrl);
        if(pointTableUrl) {
            const headers = {'pointtableurl': `${pointTableUrl}`}
            const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/pointtable`, {headers: headers})
                .then((response)=> {
                    console.log("table details",response.data);
                    setPointTableData(response.data);
                })
                .catch((error) => {
                    console.log('The table details error is ', error)
                })
        }
    }
    const fetchSeriesMatchesData = async (parent, args) => {
        if(seriesMatchesUrl) {
            const headers = {'seriesmatchesurl': `${seriesMatchesUrl}`}
            const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/series/${params.seriesid}/matches`, {headers: headers})
                .then((response)=> {
                    console.log("series matches details",response.data);
                    setSeriesMatchesData(response.data);
                })
                .catch((error) => {
                    console.log('The series matches details error is ', error)
                })
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        await seriesCreate({variables : {input: seriesData}}).then(() =>
            toast.success('Series created!!')
        ).catch(error => {
            console.log(error.message);
            toast.error(error.message);
        })
    }

    useMemo(() => {
        console.log("in the useMemo", seriesDetails)
        if(seriesDetails) {
            console.log("inside useMemo", seriesDetails.tabs)
            setSeriesData({
                ...seriesDetails.seriesDetails,
                'id': seriesDetails.seriesDetails.series.id,
            });
            setPointTableUrl( seriesDetails.seriesDetails.tabs &&
                seriesDetails.seriesDetails.tabs.filter(tab => tab.id==='pointtable')[0].url);
            setSeriesMatchesUrl( seriesDetails.seriesDetails.tabs &&
                seriesDetails.seriesDetails.tabs.filter(tab => tab.id==='matches')[0].url);
        }
    }, [seriesDetails]);

    useEffect(() => {
        fetchSeriesData({variables: {seriesId: params.seriesid}});
    }, []);

    useEffect(() => {
        fetchPointTableData();
    }, [pointTableUrl]);

    useEffect(() => {
        fetchSeriesMatchesData();
    }, [seriesMatchesUrl]);

    const content = <div className="col-md-9">
        <button className="mt-5" onClick={handleSubmit}> Save series data</button>
        <div>
            {seriesMatchesData.matches && seriesMatchesData.matches.map(match => {
                return (
                    <Link key={match.match_id} to={`/cbzios/match/${match.match_id}`} style={{textDecoration: 'none'}}>
                        <div className="container mt-4">
                            <div className="row" style={{display: "flex", justifyContent:"center"}}>
                                <h4>{match.team1_name.toUpperCase()} vs {match.team2_name.toUpperCase()}</h4>
                            </div>
                            <div className="row" style={{display: "flex", justifyContent:"center"}}>
                                {match.venue.name}: {match.header.status}
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
        <div>
            <div style={{display: 'flex'}}>
                {pointTableData.title && pointTableData.title.map((val) => {
                    return(
                        <div className="container mt-5" key={val}>
                            {val}
                        </div>
                    )
                })}
            </div>
            <div>
                {pointTableData.group && pointTableData.group.Teams && pointTableData.group.Teams.map((team) => {
                    return(
                        <div className="container"  style={{display:'flex', justifyContent:'space-around'}} key={team.id}>
                            {/*{JSON.stringify(team)}*/}
                            {Object.entries(team).filter(([key, value]) => key !== 'id').map(([key, value]) => <span key={key}>
                                {value}
                            </span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
        <h4 className="mt-5">{seriesData.series && seriesData.series.name}</h4>
        {seriesData.tabs && seriesData.tabs.map((tab) => {
            return(
                <div className="container mt-5" key={tab.id}>
                    {tab.header} : {tab.url}
                </div>
            )
        })}
    </div>;

    return content;

}

export default Series;