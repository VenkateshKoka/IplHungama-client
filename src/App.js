import React, {useState, useContext} from 'react';
import {Switch, Route} from 'react-router-dom';
// gql
import { gql } from 'apollo-boost';
import {split} from "apollo-link";
import {setContext} from "apollo-link-context";
import {WebSocketLink} from "apollo-link-ws";
import {getMainDefinition} from "apollo-utilities";
// from apollo boost
import ApolloClient from 'apollo-client';
import {InMemoryCache} from "apollo-cache-inmemory";
import {HttpLink} from 'apollo-link-http';


import { ApolloProvider } from '@apollo/react-hooks';
import { ToastContainer } from 'react-toastify';

// import components
import Home from './pages/Home';
import Users from './pages/Users';
import Nav from './components/Nav';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CompleteRegistration from './pages/auth/CompleteRegistration';
import {AuthContext} from "./context/authContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import PasswordUpdate from "./pages/auth/PasswordUpdate";
import Post from "./pages/post/Post";
import PostUpdate from "./pages/post/PostUpdate";
import SinglePost from "./pages/post/SinglePost";
import Profile from "./pages/auth/Profile";
import PasswordForgot from "./pages/auth/PasswwordForgot";
import SingleUser from "./pages/SingleUser";
import SearchResults from "./components/SearchResults";


const App = () => {
    const {state} = useContext(AuthContext);
    const {user} = state;

    // 1. create websocket link
    const wsLink = new WebSocketLink({
        uri: process.env.REACT_APP_GRAPHQL_WEB_SOCKET_ENDPOINT,
        options: {
            reconnect: true
        }
    });

    // 2. create http link
    const httpLink = new HttpLink({
        uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
    });

    // 3. setContext for authentication token
    const authLink = setContext(()=> {
        return {
            headers: {
                authtoken: user ? user.token : ''
            }
        }
    });

    // 4. concat http and authtoken link
    const httpAuthLink = authLink.concat(httpLink);

    // 5. use split to split http link or websocket link
    const link = split(
        ({query})=> {
        // split link based on operation type
        const definition = getMainDefinition(query)
        return(definition.kind === 'OperationDefinition' && definition.operation === 'subscription');
        },
        wsLink,
        httpAuthLink
    );

    // 6. create new apolloClient
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link
    })

    // const apolloClient = new ApolloClient({
    //     uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    //     request: operation => {
    //         operation.setContext({
    //             headers: {
    //                 authtoken: user ? user.token: ''
    //             }
    //         })
    //     }
    // });



  return (
      <ApolloProvider client={client}>
          <Nav/>
          <ToastContainer/>
          <Switch>
              <Switch>
                  <Route exact path="/" component={Home}/>
                  <Route exact path="/users" component={Users}/>
                  <PublicRoute exact path="/register" component={Register}/>
                  <PublicRoute exact path="/login" component={Login}/>
                  <PublicRoute exact path="/complete-registration" component={CompleteRegistration}/>
                  <Route exact path="/password/forgot" component={PasswordForgot}/>
                  <PrivateRoute exact path="/password/update" component={PasswordUpdate}/>
                  <PrivateRoute exact path="/profile" component={Profile}/>
                  <PrivateRoute exact path="/post/create" component={Post}/>
                  <PrivateRoute exact path="/post/update/:postid" component={PostUpdate}/>
                  <Route exact path="/post/:postid" component={SinglePost}/>
                  <Route exact path="/search/:query" component={SearchResults}/>
                  <Route exact path="/user/:username" component={SingleUser}/>
              </Switch>
          </Switch>
      </ApolloProvider>
  );
}

export default App;
