import React, { useState } from "react";
import "./Card.css";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import data from "./firebase";

function Card({
  user,
  timestamp,
  likes,
  fileURL,
  docID,
  name,
  username,
  tweet,
  author,
  picture,
  picText,
}) {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState(false);
  const [retweet, setRetweet] = useState(false);
  const [inbox, setInbox] = useState(false);
  const [countLikes, setCountLikes] = useState(0);

  //------likes-saved-t0-database

  const likeHandler = () => {
    //---------like-or-deslike----------

    setLiked(!liked);

    //-----------if-its-liked

    if (!liked && !user) {
      setCountLikes(likes);
      data
        .collection("tweets")
        .doc(docID)
        .update({
          likes: likes,
        })
        .then(() => {
          data
            .collection("tweets")
            .doc(docID)
            .onSnapshot((e) => {
              setCountLikes(e.data().likes);
            });
        })
        .catch((e) => {
          alert(e);
          console.log(e);
        });
    } //-----------disliked
    else if (liked && !user) {
      const likes = countLikes - 1;
      data
        .collection("tweets")
        .doc(docID)
        .update({
          likes: likes,
        })
        .then(() => {
          data
            .collection("tweets")
            .doc(docID)
            .onSnapshot((e) => {
              setCountLikes(e.data().likes);
            });
        })
        .catch((e) => {
          alert(e);
          console.log(e);
        });
    }
    console.log(countLikes);
  };

  const comHandler = () => {
    setComment(!comment);
  };

  const retHandler = () => {
    setRetweet(!retweet);
  };

  const inboxHandler = () => {
    setInbox(!inbox);
  };

  return (
    <div className="card">
      <img
        src={`https://avatars.dicebear.com/api/initials/${username}.svg`}
        alt="icon"
        className="icon"
      />
      <div className="card-info">
        <div className="personal-info">
          <div className="user-name">
            {name} {username} {new Date(timestamp?.toDate()).toUTCString()}{" "}
          </div>
          <h3 className={tweet ? "open-tweet" : "null"}>{tweet}</h3>
          <h3 className={author ? "show-author" : "null"}>{author}</h3>
        </div>
        <span className={fileURL ? "picture-tweet" : "null"}>
          <img width="400" height="400" src={fileURL} alt="" />
          <span className="pic-text">{picText}</span>
        </span>
        <div className="likes">
          <span placeholder="text" onClick={likeHandler}>
            <FavoriteBorderIcon
              id={liked ? "MuiSvgIcon-root" : "MuiSvgIcon-root-no"}
            />
            <p>{countLikes}</p>
          </span>
          <span onClick={retHandler}>
            <RepeatIcon
              id={retweet ? "MuiSvgIcon-root" : "MuiSvgIcon-root-no"}
            />
          </span>
          <span onClick={comHandler}>
            <InsertCommentIcon
              id={comment ? "MuiSvgIcon-root" : "MuiSvgIcon-root-no"}
            />
          </span>
          <span onClick={inboxHandler}>
            <MailOutlineIcon
              id={inbox ? "MuiSvgIcon-root" : "MuiSvgIcon-root-no"}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
