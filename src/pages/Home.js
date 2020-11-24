import React, { useState, useContext, useEffect} from 'react';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import { useQuery, useLazyQuery, useSubscription } from '@apollo/react-hooks';
import { AuthContext } from "../context/authContext";
import { useHistory } from 'react-router-dom';
import {GET_ALL_POSTS, TOTAL_POSTS} from "../graphql/queries";
import PostCard from "../components/PostCard";
import PostPagination from "../components/PostPagination";
import {toast} from "react-toastify";
import {POST_ADDED, POST_UPDATED, POST_DELETED} from "../graphql/subscriptions";
import axios from 'axios';
import {Link} from "react-router-dom";

const Home = () => {

    const [page, setPage] = useState(1);

    const {data, loading, error} = useQuery(GET_ALL_POSTS, {
        variables: {page}
    });
    const {data: postCount} = useQuery(TOTAL_POSTS);

    const {data: newPost} = useSubscription(POST_ADDED, {
        onSubscriptionData: async ({client:{cache}, subscriptionData: {data}}) => {
            // console.log(data)
            // readQuery from cache
            const {allPosts} = cache.readQuery({
                query: GET_ALL_POSTS,
                variables: { page }
            })
            // write back to cache
            cache.writeQuery({
                query: GET_ALL_POSTS,
                variables: {page},
                data: {
                    allPosts: [data.postAdded, ...allPosts]
                }
            })
            // re-fetch all posts to update ui
            await fetchPosts({
                variables: {page},
                refetchQueries: [{query: GET_ALL_POSTS, variables: {page}}]
            })

            // show toast notification
            toast.success(`New Post by ${data.postAdded.postedBy.username}`);

        }
    });

    const {data: postUpdated} = useSubscription(POST_UPDATED, {
        onSubscriptionData: async ({subscriptionData: {data}}) => {
            toast.success(`Post updated by ${data.postUpdated.postedBy.username}`)
        }
    });

    const {data: deletedPost} = useSubscription(POST_DELETED, {
        onSubscriptionData: async ({client:{cache}, subscriptionData: {data}}) => {
            // console.log(data)
            // readQuery from cache
            const {allPosts} = cache.readQuery({
                query: GET_ALL_POSTS,
                variables: { page }
            })
            let filteredPosts = allPosts.filter((post)=> (post._id !== data.postDeleted._id));
            // write back to cache
            cache.writeQuery({
                query: GET_ALL_POSTS,
                variables: {page},
                data: {
                    allPosts: filteredPosts
                }
            })
            // re-fetch all posts to update ui
            await fetchPosts({
                variables: {page},
                refetchQueries: [{query: GET_ALL_POSTS, variables: {page}}]
            })

            // show toast notification
            toast.error(`Post deleted by ${data.postDeleted.postedBy.username}`);

        }
    });


    const [fetchPosts, {data: posts}] = useLazyQuery(GET_ALL_POSTS);
    const updateUserName = () => {
        dispatch({
            type: 'LOGGED_IN_USER',
            payload: 'Venkatesh Koka'
        });
    };

    // access context
    const {state, dispatch} = useContext(AuthContext);

    // react router
    let history = useHistory();

    const [iplData, setIplData] = useState({});
    const [liveMatchesData, setLiveMatchesData] = useState({});
    const [rapidMatchesData, setRapidMatchesData] = useState({});

    const fetchIplMatches1 = async () => {
        // const response = await axios({
        //     "method":"GET",
        //     "url":"https://mapps.cricbuzz.com/cbzios/match/schedule",
        // });
        const response = await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/match/schedule`)
        if(response) {
            console.log(response.data);
            setIplData(response.data)
        }
        // .then((response)=>{
        //     setIpldata(response.data);
        //     console.log(response)
        // })
        // .catch((error)=>{
        //     console.log(error)
        // })
    }

    const fetchLiveMatches = async () => {
        await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/cbzios/match/livematches`)
            .then((response) => {
            setLiveMatchesData(response.data);
            console.log(response)
            })
            .catch((error) => {
            console.log(error)
            })
    }

    const fetchRapidIplMatches = async () => {
        await axios.get(`${process.env.REACT_APP_REST_ENDPOINT}/rapidapi/matchSeries`)
            .then((response) => {
                setRapidMatchesData(response.data);
                console.log("rapid ipl matches",response.data)
            })
            .catch((error) => {
                console.log(error)
            })
            // .then((response)=>{
            //     setIpldata(response.data);
            //     console.log(response)
            // })
            // .catch((error)=>{
            //     console.log(error)
            // })
    }

    useEffect(() => {
        fetchLiveMatches()
    }, []);


    if(loading) return <p className="p-5">Loading....</p>;


    return (
        <div className="container">
            {/*<div className="row p-5">*/}
            {/*    {data && data.allPosts.map(post => (*/}
            {/*        <div key={post._id} className="col-md-4 pt-5">*/}
            {/*            <PostCard post={post}/>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/*<PostPagination page={page} postCount={postCount} setPage={setPage} />*/}

            <button onClick={()=> fetchRapidIplMatches()} className="btn-btn-raise btn-primary mt-5"> Fetch Ipl Matches</button>
            <button onClick={()=> fetchLiveMatches()} className="btn-btn-raise btn-primary mt-5"> Fetch Live Matches</button>
            <hr/>
            {iplData.matches && iplData.matches.map(match => {
                return (
                    <Link key={match.match_id} to={`/match/${match.match_id}`}>
                        <b>{match.series_name}</b>: {match.team1_name} vs {match.team2_name} at {match.venue.name}<br/>
                        {match.header.state==='complete' && match.header.status || 'Upcoming'}
                    </Link>
                )
            })}
            {liveMatchesData.matches && liveMatchesData.matches.map(match => {
                return (
                    <div key={match.match_id}>
                        <Link
                            to={`/cbzios/series/${match.series_id}`}
                            style={{ textDecoration: 'none'}}>
                            {match.series_name}
                        </Link>
                        <Link to={`/cbzios/match/${match.match_id}`} style={{ textDecoration: 'none', color: 'black'}}>
                            <br/>
                            {match.team1.name} vs {match.team2.name} at {match.venue.name}<br/>
                            {match.header.status} , matchId: {match.match_id}
                        </Link>
                    </div>
                )
            })}
            <div className="container">
                {rapidMatchesData.matchList && rapidMatchesData.matchList.matches
                    .sort((a, b) => a.id > b.id ? 1 : -1)
                    .map(match => {
                    return (
                        <div className="container-row">
                            <Link key={match.id} to={`/rapidapi/match/${match.id}`}>
                                {match.status}: matchId: {match.id}, status: {match.status} at {match.venue.name}
                            </Link>
                        </div>
                    )
                })}
            </div>
            <button className="btn btn-primary" onClick={updateUserName}> change user name</button>
        </div>
    );
}

export default Home;
