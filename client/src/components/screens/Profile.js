/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';

const Profile = () => {

    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");

    //FIRST TIME THIS IS RENDERING 
    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setPics(result.myPost)
            })
    }, []);


    //WHENEVER THE PROFILE IMAGE IS CHANGED THIS USEEFFECT GETS RENDERED
    useEffect(() => {
        if (image) {
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
                    // localStorage.setItem("user", JSON.stringify({ ...state, pic: data.url }));
                    // dispatch({ type: "UPDATEPIC", payload: data.url });
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json()).then(result => {
                        //console.log(result);
                        localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                        dispatch({ type: "UPDATEPIC", payload: result.pic });
                        // window.location.reload();
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [image]);

    const updatePic = (file) => {
        setImage(file);
    }
    return (
        <>
            <div className="profile">

                <div className="profile-top-container">

                    <div className="left-top-container">
                        <div>
                            <img className="profile-image"
                                src={state ? state.pic : "loading"}
                            />
                        </div>
                        <div className="file-field input-field">
                            <div className="btn #42a5f5 blue darken-1">
                                <span>Upload profile pic</span>
                                <input
                                    type="file"
                                    onChange={(e) => updatePic(e.target.files[0])}
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="right-bio-container">
                        <h4>{state ? state.name : "loading"}</h4>
                        <p>{state ? state.email : "loading"}</p>
                        <div className="profile-data">
                            <h6 className="bio-info"><strong>{mypics.length}</strong> posts</h6>
                            <h6 className="bio-info"><strong>{state ? state.followers.length : "0"}</strong> followers</h6>
                            <h6 className="bio-info"><strong>{state ? state.following.length : "0"} </strong>following</h6>
                        </div>
                    </div>

                </div>
                <div className="gallery">
                    {
                        mypics.map(item => {
                            return (
                                <img className="item" src={item.photo} alt={item.title} key={item._id} />
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Profile