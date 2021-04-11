import React, { useEffect, createContext, useContext, useReducer } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import NavBar from './components/Navbar';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribesUserProfile from './components/screens/SubscribesUserProfile';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/Newpassword';
import { reducer, initialState } from './reducers/userReducer';
import './dark-mode/styles.scss';

export const UserContext = createContext()

const Routing = () => {

  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  //this is the first component which loads so we should redirect user to login and if user
  //did not logout during last session then we have to update state
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(typeof(user),user);
    if (user) {
      //we are updating the state if user did not logout and closed the browser
      dispatch({ type: "USER", payload: user });
    }
    else {
      if (!history.location.pathname.startsWith('/reset'))
        history.push('/signin');
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/createPost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingposts">
        <SubscribesUserProfile />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
    </Switch >
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
