import React from "react";
import styled from "styled-components";
import { Avatar, IconButton, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVert from "@mui/icons-material/MoreVert";
import Search from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt("Please enter an Email Addres To start a Chat!");

    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email &&
      input !== null &&
      input !== undefined
    ) {
      //push the email to the chat collection
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) => {
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  };

  chatAlreadyExists();

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </IconsContainer>
      </Header>
      <SearchBar>
        <Search style={{ opacity: 0.5 }} />
        <SearchInput placeholder="Search in Chats" />
      </SearchBar>
      <SidebarButton onClick={createChat}>Start a New Chat</SidebarButton>
      {/* ---------> list of chats <-------- */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat
          key={chat.id}
          id={chat.id}
          users={chat.data().users}
          user={user}
        />
      ))}
    </Container>
  );
}
export default Sidebar;

const Container = styled.div`
  flex: 0.4;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  transition: all 350ms;
  &:hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 5px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  color: green;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
