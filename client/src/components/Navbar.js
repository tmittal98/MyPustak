/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'

const NavBar = () => {

  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  const renderList = () => {
    if (state) {
      return [
        <li key={1}><Link to="/createPost">CreatePost</Link></li>,
        <li key={2}><Link to="/profile">Profile</Link></li>,
        <li key={3}><Link to="/myfollowingposts">My following posts</Link></li>,
        <li key={4}>
          <button className="btn #d32f2f red darken-2 logout"
            onClick={() => {
              //clearing the local storage
              localStorage.clear();
              //changing the global state
              dispatch({ type: "CLEAR" });
              history.push('./signin');
            }}
          >
            Logout
            </button>
        </li>
      ]
    }
    else {
      return [
        <li key={5}><Link to="/signin">SignIn</Link></li>,
        <li key={6}><Link to="/signup">SignUp</Link></li>
      ]
    }
  }
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>

  )
}

export default NavBar