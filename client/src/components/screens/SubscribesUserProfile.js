/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const SubscribesUserProfile = () => {
    //this data is to fetch all posts and store in data
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            //we are sending data to body so it will be recieved in req.body.postId
            body: JSON.stringify({
                postId: id
            })
        })
            .then(res => res.json())
            .then(result => {
                // console.log("ye naya result hain", result);
                // A re-render can only be triggered if a component's state has changed
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(err => console.log(err));
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then(res => res.json())
            .then(result => {
                // console.log("ye naya result hain", result);
                // A re-render can only be triggered if a component's state has changed
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(err => console.log(err));
    }
    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log("ye naya result hain", result);
                // A re-render can only be triggered if a component's state has changed
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(err => console.log(err));
    }
    const deletePost = (postid) => {
        fetch('/deletePost/' + postid, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.filter(item => {
                    return item._id !== result._id;
                })
                setData(newData);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetch("/getsubpost", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result);
                setData(result.posts);
            })
    }, []);

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5>
                                <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.name}</Link>
                                {
                                    item.postedBy._id === state._id &&
                                    <i className="material-icons deletePostIcon"
                                        onClick={() => deletePost(item._id)}>
                                        delete
                                    </i>
                                }</h5>
                            <div className="card-image">
                                <img className="post-image" src={item.photo} />
                            </div>
                            <div className="card-content">
                                <div className="like-dislike">
                                    {
                                        item.likes.includes(state._id) ?
                                            <i className="material-icons" onClick={() => unlikePost(item._id)}>thumb_down</i>
                                            :
                                            <i className="material-icons" onClick={() => likePost(item._id)}>thumb_up</i>
                                    }
                                    <span>{item.likes.length} likes</span>
                                </div>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id} ><span className="comment-name">{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div >
    )
};

export default SubscribesUserProfile