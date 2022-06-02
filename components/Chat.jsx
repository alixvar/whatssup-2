import React from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import getRecipientEmail from "../utils/getRecipientEmail";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

function Chat({ id, users }) {
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);
  const [recipientSnapShot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );
  const recipient = recipientSnapShot?.docs?.[0]?.data();

  const router = useRouter();
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <ChatContainer onClick={enterChat}>
      {recipient ? <UserAvatar src={recipient.photoURL} /> : <UserAvatar />}

      <p>{recipientEmail}</p>
    </ChatContainer>
  );
}

export default Chat;

const ChatContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid whitesmoke;
  cursor: pointer;
  padding-left: 20px;
  word-break: break-word;
  transition: all 350ms;
  :hover {
    background-color: #e9e9e9;
  }
`;

const UserAvatar = styled(Avatar)``;
