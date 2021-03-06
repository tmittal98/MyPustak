/* eslint-disable eqeqeq */

//initially we dont't have any data related to user
export const initialState = null;

// reducer function that takes the state and an action as arguments designed for accessing and managing the global state of the application
export const reducer = (state, action) => {

    if (action.type === "USER") {
        return action.payload;
    }
    if (action.type === "CLEAR") {
        return null;
    }
    if (action.type === "UPDATE") {
        return {
            ...state,//expanding the previous state
            followers: action.payload.followers,
            following: action.payload.following
        }
    }
    if (action.type === "UPDATEPIC") {
        return {
            ...state,
            pic: action.payload
        }
    }
    return state;
}