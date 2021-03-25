/* eslint-disable react/style-prop-object */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const SignIn = () => {

    //creating hooks
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [url, setUrl] = useState(undefined);
    const [image, setImage] = useState("");

    const history = useHistory();

    const uploadPic = () => {
        //upload a file we need to create FormData()
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "tushar-mittal1998");
        //1st network request for posting image to cloudinary
        fetch("https://api.cloudinary.com/v1_1/tushar-mittal1998/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.url);
                setUrl(data.url);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const uploadFields = () => {
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
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" });
                }
                else {
                    M.toast({ html: data.message, classes: "#43a047 green darken-1" });
                    history.push('/signin')
                }
            })
            .catch(err => {
                console.log(err);
            });
    }


    const PostData = () => {
        if (image) {
            uploadPic();
        }
        else {
            uploadFields();
        }
    }

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    })

    return (
        <div className="card input-field">
            <h2 className="form-heading">Instagram</h2>
            <input
                type="text"
                placeholder="Name"
                val={name}
                onChange={(e) => setName(e.target.value)}
            />
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
            <div className="password-validation">
                <p>Password must contain atleast</p>
                <hr />
                <p>1 capital letter(A-Z)</p>
                <p>1 small letter(a-z)</p>
                <p>1 special character</p>
                <p>8 letters</p>
            </div>
            <div className="file-field input-field">
                <div className="btn #42a5f5 blue darken-1">
                    <span>Upload profile pic</span>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #42a5f5 blue darken-1"
                onClick={() => PostData()}
            >
                Create Account
            </button>
            <h5><Link to="/signin">Already have an account ?</Link></h5>
        </div>
    )

}
export default SignIn