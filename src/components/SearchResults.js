import React from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";
import {SEARCH_POSTS} from "../graphql/queries";
import PostCard from "./PostCard";

const SearchResults = () => {
    // route query
    const {query} = useParams();
    // gql query
    const {data, loading} = useQuery(SEARCH_POSTS, {
        variables: {
            query
        }
    })

    if (loading) {
        return (
            <div className="container text-center">
                <p className="text-danger p-5">Loading...</p>
            </div>
        )
    }

    if (!data.searchPosts.length) {
        return (
            <div className="container text-center">
                <p className="text-danger p-5">No results found...</p>
            </div>
        )
    }


    return (
        <div className="container">
            <div className="row pb-5">
                {data.searchPosts.map((post) => (
                    <div className="col-md-4 pt-5" key={post._id}>
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;