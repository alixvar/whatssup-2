import { Avatar } from "@mui/material";
import styled from "styled-components";
import MoreVert from "@mui/icons-material/morevert";
import AttachFile from "@mui/icons-material/AttachFile";
import { IconButton } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { InsertEmoticon, Mic } from "@mui/icons-material";

function ChatScreen() {
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
    }
  };

  return (
    <Container>
      <Header>
        <Avatar />
        <HeaderInformation>
          <h3>rec Email</h3>
          <p>last seen ...</p>
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <MoreVert />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage />
      </MessageContainer>

      <InputContainer>
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <Input placeholder="message..." />
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

const EndOfMessage = styled.div``;

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
