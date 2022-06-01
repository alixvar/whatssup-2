import { Avatar } from "@mui/material";
import styled from "styled-components";
// import  from "@mui/icons-material/morevert";
import AttachFile from "@mui/icons-material/AttachFile";
import { IconButton } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { InsertEmoticon, Mic, MoreVert } from "@mui/icons-material";
import { useRef, useState } from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ messages, chat }) {
  const scrollToButtom = useRef(null);
  const scrollToButtomF = () => {
    scrollToButtom.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastseen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    scrollToButtomF();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipinetEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? <Avatar src={recipient.photoURL} /> : <Avatar />}
        <HeaderInformation>
          <h3>{recipinetEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last Active: {""}
              {recipient?.lastseen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastseen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={scrollToButtom} />
      </MessageContainer>

      <InputContainer>
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <Input
          placeholder="message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <IconButton>
          <AttachFile />
        </IconButton>
        <IconButton>
          <Mic />
        </IconButton>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: sticky;
  padding: 10px;
  top: 0;
  border-bottom: 1px solid whitesmoke;
  height: 80px;
  background-color: white;
  z-index: 100;
`;

const HeaderInformation = styled.div`
  flex: 1;
  margin-left: 15px;
  h3 {
    margin: 0;
  }
  p {
    margin: 0;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  align-items: center;
  padding: 15px;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
  outline: none;
  border: 1px solid whitesmoke;
  border-radius: 10px;
`;
