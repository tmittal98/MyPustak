/* eslint-disable no-unused-vars */
import React, { useContext, useRef, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css';
import DarkModeToggle from '../dark-mode/DarkModeToggle';
import '../dark-mode/styles.scss'

const NavBar = () => {

  const searchModal = useRef(null)
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, [])

  const renderList = () => {
    if (state) {
      return [
        <li className="navbar-ele" key={0}><i className="material-icons modal-trigger large" data-target="modal1">search</i></li>,
        <li className="navbar-ele" key={1}><Link to="/createPost">CreatePost</Link></li>,
        <li className="navbar-ele" key={2}><Link to="/profile">Profile</Link></li>,
        <li className="navbar-ele" key={3}><Link to="/myfollowingposts">My following posts</Link></li>,
        <li className="navbar-ele" key={4}>
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
        <li className="navbar-ele" key={5}><Link to="/signin">SignIn</Link></li>,
        <li className="navbar-ele" key={6}><Link to="/signup">SignUp</Link></li>
      ]
    }
  }

  const fetchUsers = (query) => {
    setSearch(query)
    fetch('/search-users', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json())
      .then(results => {
        setUserDetails(results.user)
      })
  }

  return (
    <div className="navbar-fixed ">
      <nav>
        <div className="nav-wrapper #b3e5fc light-blue lighten-4">

          <Link to={state ? "/" : "/signin"} className="brand-logo left"><img className="logo-navbar" src="https://res.cloudinary.com/tushar-mittal1998/image/upload/v1628750424/logo_qcs1jn.svg" alt="" /></Link>

          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
          <DarkModeToggle />
        </div>

        {/* Modal */}
        <div id="modal1" className="modal" ref={searchModal}>
          <div className="modal-content">
            <input
              type="text"
              placeholder="search users"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul className="collection">
              {userDetails.map(item => {
                return <Link to={item._id !== state._id ? "/profile/" + item._id : '/profile'} onClick={() => {
                  M.Modal.getInstance(searchModal.current).close()
                  setSearch('')
                }}><li className="collection-item" id="collection-list">{item.email}</li></Link>
              })}

            </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>close</button>
          </div>
        </div>

      </nav>
    </div>

  )
}

export default NavBar