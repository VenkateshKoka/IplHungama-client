import React, {useReducer, useEffect, createContext} from 'react';
import {auth} from '../firebase';

// reducer
// this function just updates the state with whatever is sent from action paylaod
const firebaseReducer = (state, action) => {
    switch (action.type) {
        case "LOGGED_IN_USER":
            return {...state, user: action.payload};
        default:
            return state;
    }
}

// state
const initialState = {
    user: null
};

// create context
const AuthContext = createContext();

// context provider
// what's actually happening here is: making the children components receive the state and the dispatch when
// the children components are wrapped by AuthProvider
const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(firebaseReducer, initialState);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if(user) {
                const idTokenResult = await user.getIdTokenResult();

                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {email:user.email, token: idTokenResult.token}
                })
            } else {
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: null
                })
            }
        })
        // cleanup
        return () => unsubscribe();
    }, []);

    const value = {state, dispatch};
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
};

// export
export {AuthContext, AuthProvider}