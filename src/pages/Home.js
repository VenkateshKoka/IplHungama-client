import React, { useState, useContext} from 'react';
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

    if(loading) return <p className="p-5">Loading....</p>;

    return (
        <div className="container">
            <div className="row p-5">
                {data && data.allPosts.map(post => (
                    <div key={post._id} className="col-md-4 pt-5">
                        <PostCard post={post}/>
                    </div>
                ))}
            </div>

            <PostPagination page={page} postCount={postCount} setPage={setPage} />

            <button onClick={()=> fetchPosts()} className="btn-btn-raise btn-primary"> Fetch Posts</button>
            <hr/>
            {/*{JSON.stringify(newPost)}*/}
            {/*<hr/>*/}
            {/*{JSON.stringify(state.user)}*/}
            {/*<hr/>*/}
            {/*{JSON.stringify(history)}*/}
            <hr/>
            <button className="btn btn-primary" onClick={updateUserName}> change user name</button>
        </div>
    );
}

export default Home;
