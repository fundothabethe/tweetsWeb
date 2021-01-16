import React, { useEffect, useState } from "react";
import "./Tweet.css";
import { Button, TextField } from "@material-ui/core";
import data, { auth, firebaseApp, storage } from "./firebase";
import firebase from "firebase";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import Card from "./Card";

function Tweet() {
  //-----------initialize of states

  const [allUsers, setAllUsers] = useState([]);
  const [newUser, setNewUser] = useState(true);
  const [trueNewUser, setTrueNewUser] = useState("have an acount? LOG-IN");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [accountName, setAccountName] = useState("Guest");
  const [saveUsers, setSaveUsers] = useState([]);
  const [signInerrMessage, setSignInerrMessage] = useState("");
  const [tweet, setTweet] = useState("");
  const [showEmail, setshowEmail] = useState("");
  const [uid, setUid] = useState("");
  const [fileURL, setFileURL] = useState(null);
  const [user, setUser] = useState(true);
  const [login, setLogin] = useState(true);
  const [isUser, setIsUser] = useState("sign-in");
  const [signIn, setSignIn] = useState("SIGN-IN");
  const [save, setSave] = useState([]);
  const [likes, setLikes] = useState(0);
  const [docID, setDocID] = useState("");

  //---------load-tweets-after-html-is-done🎋

  useEffect(() => {
    //arrange-by-timestamp🚜

    data.collection("users").onSnapshot((e) => {
      e.docs.map((e) => {
        setAllUsers(e.data().uid);
        data
          .collection("tweets")
          .orderBy("timestamp", "asc")
          .onSnapshot((e) => {
            setSave(e.docs);
          });
      });
    });
  }, []);
  //-----------sign-in-button🛒

  const signInHandler = (e) => {
    e.preventDefault();
    if (user) {
      setFormOpen(!formOpen);
    }

    //----------sign-out
    if (!user) {
      auth.signOut();
      setUid("");
      setIsUser("sign-in");
      setUser(!user);
      setAccountName("Guest");
      setEmail("");
      setshowEmail("");
      setOpen(true);
    }
  };
  //----------SIGN_IN-form-submit-handler🎆🧧

  const formSubmit = (e) => {
    e.preventDefault();
    // ---------login-sign-in-user---------🖤
    if (login) {
      // ---------create-new-user---------🧶

      setFormOpen(!formOpen);
      setIsUser("LOG-OUT");
      setUser(!user);
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((e) => {
          //cloes form
          setUid(e.user.uid);
          data.collection("users").doc(e.user.uid).set({
            username: userName,
            uid: e.user.uid,
          });
          setshowEmail(email);
          setAccountName(userName);

          // ---------after-user-created---------
        })
        .catch((e) => {
          // ---------catch-errors---------🈯
          setSignInerrMessage(e.message);
          setTimeout(() => {
            setSignInerrMessage("");
          }, 4000);
        });
    } else {
      // ---------log-in---------
      auth
        .signInWithEmailAndPassword(email, password)
        .then((e) => {
          setUid(e.user.uid);

          //-------get-user-info-using-uid--
          data
            .collection("users")
            .doc(e.user.uid)
            .onSnapshot((e) => {
              setAccountName(e.data().username);
            });
          setshowEmail(email);
          setUser(!user);
          setFormOpen(!formOpen);
          setIsUser("LOG-OUT");
        })
        .catch((e) => {
          // ---------catch-errors---------💚
          setSignInerrMessage(e.message);
          setTimeout(() => {
            setSignInerrMessage("");
          }, 4000);
        });
    }
    e.target.reset();
  };

  //--------loginRequest-use-google-auth✅

  const loginRequest = (e) => {
    e.preventDefault();

    if (!login) {
      if (!newUser) {
        setTrueNewUser("Dont have an Account? SIGN_IN");
        setSignIn("LOG-IN");
      } else {
        setTrueNewUser("Have an acount? LOG_IN");
        setSignIn("SIGN-IN");
      }
    } else {
      if (newUser) {
        setTrueNewUser("Dont have an Account? SIGN_IN");
        setSignIn("LOG-IN");
      } else {
        setTrueNewUser("Have an acount? LOG_IN");
        setSignIn("SIGN-IN");
      }
    }
    setLogin(!login);
  };
  //-----------tweet-button-options🤬🤬🤬

  const tweetHandler = (e) => {
    e.preventDefault();
    if (email) {
      setOpen(!open);
    } else {
      alert("Sign-In first to share your thought");
      setFormOpen(true);
    }
  };

  //---------------pic-add-botton

  const picUpload = async (e) => {
    e.preventDefault();
    const pic = e.target.files[0];
    const fileRef = storage.child(pic.name);
    await fileRef.put(pic);
    setFileURL(await fileRef.getDownloadURL());
  };

  //-----------sumbit-tweet-handler😎

  const clickHandler = (e) => {
    e.preventDefault();

    //---------added-tweet-message-of-user-message

    data
      .collection("tweets")
      .add({
        tweet: tweet,
        username: accountName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((e) => {
        setDocID(e.id);
        data.collection("tweets").doc(e.id).update({
          docID: e.id,
          file: fileURL,
        });
      })
      .catch((e) => {
        alert(e);
        console.error(e);
      });

    //-------------after-firestore-accepts-messages

    setOpen(true);
    e.target.reset();
  };

  //------------return👌
  return (
    <div className="frame">
      <header>
        <nav>
          <h1>MK_1246-SPRAYS</h1>
          {/* -------------PROFILE-SIDE--------*/}
          <div className="profile">
            <AccountCircleRoundedIcon id="user-avatar" />
            <div className="profile-info">
              <p className="userName">{accountName}</p>
              <p className="porfile-email">{showEmail}</p>
            </div>
          </div>
        </nav>
        {/* ------SIGN_IN-BOTTON--------*/}
        <Button onClick={signInHandler} id="sign-in">
          {isUser}
        </Button>
      </header>
      {/* ------SIGN_IN-FORM-BOTTON--------*/}
      <form
        onSubmit={formSubmit}
        type="submit"
        className={formOpen ? `sing-in-form ` : `null `}
        noValidate
      >
        <h4>{signIn}</h4>
        <p>{signInerrMessage}</p>
        <TextField
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          label={login ? "Username" : ""}
          variant="filled"
          type="text"
          id={login ? "filled-basic" : "null"}
        />
        <TextField
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="text"
          id="filled-basic"
          label="Email"
          variant="filled"
        />
        <TextField
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          id="filled-basic"
          label="Password"
          variant="filled"
        />
        {/* -----SIGN-IN-FORM-SUBMIT-BOTTON--------*/}
        <Button
          disabled={
            !login ? (!password, !email) : (!password, !email, !userName)
          }
          id="signIn-button"
          type="submit"
          variant="contained"
          color="primary"
        >
          {signIn}
        </Button>
        {/* -----LOG-IN-OR-SIGN_IN-BOTTON--------*/}
        <p id="haveAcount" onClick={loginRequest}>
          {trueNewUser}
        </p>
      </form>
      <p className="tweet-promo">
        Sign-in and spray your thought with this new platform from Mkhuhlu😍,
        please give feedback on what do you want me to add or change on this
        platform🤓.
      </p>
      {/* ----------SEND-TWEETS-BOTTON--------*/}
      <Button id="button" onClick={tweetHandler}>
        Spray
      </Button>
      {/* -------------SEND-TWEETS-FORM---------*/}
      <div id={open ? "null" : "tweetOpened"}>
        <form className="tweet-form" onSubmit={clickHandler}>
          <TextField
            onChange={(e) => {
              setTweet(e.target.value);
            }}
            id="tweetTextArea"
            label="share your thoughts"
            type="text"
            multiline
            rows={4}
          />
          {/* ------PUBLISH-TWEETS-BOTTON--------*/}
          <div className="post-buttons">
            <Button disabled={!tweet} type="submit" id="submit-button">
              Spray Text
            </Button>
            <TextField type="file" onChange={picUpload} id="picUpload" />
          </div>
        </form>
      </div>
      <ul className="cards">
        {save.map((e) => (
          <li key={Math.random() * 100}>
            {
              <Card
                docID={e.data().docID}
                user={user}
                uid={uid}
                picURL={e.file}
                likes={e.data().likes}
                name={e.data().name}
                timestamp={e.data().timestamp}
                username={e.data().username}
                tweet={e.data().tweet}
                picText={e.data().picText}
              />
            }
          </li>
        ))}
      </ul>
      <div className="anime">
        <div className="set">
          <div>
            <img src="leaves1.png" alt="" />
          </div>
          <div>
            <img src="leaves2.png" alt="" />
          </div>
          <div>
            <img src="leaves3.png" alt="" />
          </div>
          <div>
            <img src="leaves4.png" alt="" />
          </div>
          <div>
            <img src="leaves1.png" alt="" />
          </div>
          <div>
            <img src="leaves2.png" alt="" />
          </div>
          <div>
            <img src="leaves3.png" alt="" />
          </div>
          <div>
            <img src="leaves4.png" alt="" />
          </div>
        </div>
        <div className="set set2">
          <div>
            <img src="leaves1.png" alt="" />
          </div>
          <div>
            <img src="leaves2.png" alt="" />
          </div>
          <div>
            <img src="leaves3.png" alt="" />
          </div>
          <div>
            <img src="leaves4.png" alt="" />
          </div>
          <div>
            <img src="leaves1.png" alt="" />
          </div>
          <div>
            <img src="leaves2.png" alt="" />
          </div>
          <div>
            <img src="leaves3.png" alt="" />
          </div>
          <div>
            <img src="leaves4.png" alt="" />
          </div>
        </div>
        <div className="set set3">
          <div>
            <img src="leaves1.png" alt="" />
          </div>
          <div>
            <img src="leaves2.png" alt="" />
          </div>
          <div>
            <img src="leaves3.png" alt="" />
          </div>
          <div>
            <img src="leaves4.png" alt="" />
          </div>
          <div>
            <img src="leaves1.png" alt="" />
          </div>
          <div>
            <img src="leaves2.png" alt="" />
          </div>
          <div>
            <img src="leaves3.png" alt="" />
          </div>
          <div>
            <img src="leaves4.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Tweet;
