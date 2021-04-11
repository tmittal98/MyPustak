/* eslint-disable no-unused-vars */
import React, { useState, useContext, useRef } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css'

const NewPassword = () => {

    const [password, setPassword] = useState("");

    const history = useHistory();
    const { token } = useParams();

    let showPasswordRef = useRef(null)

    const NewPass = () => {

        //password validation using regex
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
            M.toast({ html: "Invalid password", classes: "#e53935 red darken-1" });
            return;
        }
        fetch('/new-password', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password,
                token
            })
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" });
                }
                else {
                    M.toast({ html: data.message, classes: "#43a047 green darken-1" });
                    history.push('/signin')
                }
            });
    }
    const showPassword = () => {
        // console.log(showPasswordRef.current);
        showPasswordRef.current.attributes.type.value = "text";
        // showPasswordRef.current.getElementsByClassName('password')[0].attributes.type.value = "text"
    }
    return (
        <div className="card input-field">
            <h2 className="form-heading">Instagram</h2>
            <input
                type="password"
                className="placeicon"
                placeholder="Password"
                // &#xf023;
                val={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={showPasswordRef}
            />
            <i className="fas fa-eye"
                onClick={() => showPassword()}
            ></i>
            <button className="btn waves-effect waves-light #42a5f5 blue darken-1"
                onClick={() => NewPass()}
            >
                Reset password
            </button>
        </div>
    )
}

export default NewPassword