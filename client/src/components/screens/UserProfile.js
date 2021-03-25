/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { UserContext } from '../../App';

const Profile = () => {
    const [userProfile, setProfile] = useState(null);

    const { userid } = useParams();
    const { state, dispatch } = useContext(UserContext);

    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true);

    useEffect(() => {
        fetch('/user/' + userid, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result);
                setProfile(result);
            })
    }, []);

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {

                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
            })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {

                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))

                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item != data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)

            })
    }

    return (
        <>
            {
                userProfile ?
                    <div className="profile">
                        <div className="profile-top-container">
                            <div>
                                <img className="profile-image"
                                    src={userProfile.user.pic}
                                />
                            </div>
                            <div>
                                <h4>{userProfile.user.name}</h4>
                                <h6>{userProfile.user.email}</h6>
                                <div className="profile-data">
                                    <h6>{userProfile.posts.length} posts</h6>
                                    <h6>{userProfile.user.followers.length} followers</h6>
                                    <h6>{userProfile.user.following.length} following</h6>
                                </div>
                                {
                                    showFollow ?
                                        <button className="btn waves-effect waves-light #42a5f5 blue darken-1"
                                            onClick={() => followUser()}
                                        >
                                            FOLLOW
                                        </button>
                                        :
                                        <button className="btn waves-effect waves-light #42a5f5 blue darken-1"
                                            onClick={() => unfollowUser()}
                                        >
                                            UNFOLLOW
                                        </button>
                                }
                            </div>
                        </div>
                        <div className="gallery">
                            {
                                userProfile.posts.map(item => {
                                    return (
                                        <img className="item" src={item.photo} alt={item.title} key={item._id} />
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <div class="progress">
                        <div class="indeterminate"></div>
                    </div>

            }
        </>
    )
}

export default Profile