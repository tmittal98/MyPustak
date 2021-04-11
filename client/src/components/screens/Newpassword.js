/* eslint-disable no-unused-vars */
import React, { useState, useContext, useRef } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css'

const NewPassword = () => {

    const [password, setPassword] = useState("");

    const history = useHistory();
    const { token } = useParams();

    let inputRef = useRef(null)
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
        // show
    }
    const fun = () => {
        inputRef.current.classList.remove("hide");
    }
    return (
        <div className="card input-field signin-card">
            <img className="logo-signin" src="https://res.cloudinary.com/tushar-mittal1998/image/upload/v1617034645/Screenshot_270_cwwlbi.png" alt="socially" />
            <input
                type="password"
                className="placeicon"
                placeholder="Password"
                // &#xf023;
                val={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    fun();
                }}
                ref={showPasswordRef}
            />
            <i className="fas fa-eye eye-icon"
                onClick={() => showPassword()}
            ></i>
            <button className="btn reset-password waves-effect waves-light #42a5f5 blue darken-1"
                onClick={() => NewPass()}
            >
                Reset password
            </button>
            <div className="password-validation hide" ref={inputRef}>
                <p>Password must contain atleast 8 letters including</p>
                <hr />
                <p>1 capital letter(A-Z)</p>
                <p>1 small letter(a-z)</p>
                <p>1 special character</p>
            </div>
        </div>
    )
}

export default NewPassword