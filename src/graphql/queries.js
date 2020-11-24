import {USER_INFO, POST_DATA, SERIES_DATA} from "./fragments";
import {gql} from "apollo-boost";

export const PROFILE = gql`
    query {
        profile {
            ...userInfo
        }
    }
    ${USER_INFO}
`;

export const GET_ALL_USERS = gql`
    query {
        allUsers {
            ...userInfo
        }
    }
    ${USER_INFO}
`;

export const GET_ALL_POSTS = gql`
    query allPosts($page: Int!) {
        allPosts(page: $page) {
            ...postData
        }
    }
    ${POST_DATA}
`;

export const TOTAL_POSTS = gql`
    query {
        totalPosts 
    }
`;

export const SEARCH_POSTS = gql`
    query searchPosts($query: String!){
        searchPosts(query: $query) {
            ...postData
        }
    }
    ${POST_DATA}
`;

export const SINGLE_POST = gql`
    query singlePost ($postId: String!) {
        singlePost(postId: $postId) {
            ...postData
        }
    }
    ${POST_DATA}
`;

export const POSTS_BY_USER = gql`
    query {
        postsByUser {
            ...postData
        }
    }
    ${POST_DATA}
`;

export const SERIES_DETAILS = gql`
    query seriesDetails ($seriesId: String!){
        seriesDetails(seriesId: $seriesId) {
            ...seriesData
        }
    }
    ${SERIES_DATA}
`;

