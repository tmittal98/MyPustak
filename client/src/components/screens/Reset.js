/* eslint-disable no-unused-vars */
import React, { useState, useContext, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Reset = () => {

    const [email, setEmail] = useState("");
    const history = useHistory();


    const ResetPassword = () => {

        //email validation using regex
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid email id", classes: "#e53935 red darken-1" });
            return;
        }
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" });
                }
                else {
                    M.toast({ html: data.message, classes: "#43a047 green darken-1" });
                    history.push('/signin')
                }
            });
    }
    return (
        <div className="card signin-card">
            <img className="logo-signin" src="https://res.cloudinary.com/tushar-mittal1998/image/upload/v1628750424/logo_qcs1jn.svg" alt="socially" />
            <input
                type="text"
                className="placeicon"
                // &#xf0e0;
                placeholder="Email"
                val={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn reset-password waves-effect waves-light #42a5f5 blue darken-1"
                onClick={() => ResetPassword()}
            >
                Reset Password
            </button>
        </div>
    )
}

export default Reset