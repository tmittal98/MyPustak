/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'

const SignIn = () => {
    //UserContext is used to maintain a state and update the state dispatch is used
    const { state, dispatch } = useContext(UserContext);
    //creating hooks
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();

    const PostData = () => {

        //email validation using regex
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid email id", classes: "#e53935 red darken-1" });
            return;
        }
        //password validation using regex
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
            M.toast({ html: "Invalid password", classes: "#e53935 red darken-1" });
            return;
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password,
                email
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" });
                }
                else {
                    //saving details of user and token value in localstorage 
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    //using dispatch to update the central state
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "Signedin successfully", classes: "#43a047 green darken-1" });
                    history.push('/')
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    return (
        <div className="card input-field">
            <h2 className="form-heading">Instagram</h2>
            <input
                type="text"
                className="placeicon"
                placeholder="&#xf0e0; Email"
                val={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                className="placeicon"
                placeholder="&#xf023; Password"
                val={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn waves-effect waves-light #42a5f5 blue darken-1"
                onClick={() => PostData()}
            >
                Sign In
            </button>
            <h5>
                <Link to="/signup">Don't have an account ?</Link>
            </h5>
        </div>
    )
}

export default SignIn