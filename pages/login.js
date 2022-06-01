import styled from "styled-components";
import React from "react";
import Head from "next/head";
import { Button } from "@mui/material";
import { auth, provider } from "../firebase";

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };
  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo src="https://logo-download.com/wp-content/data/images/png/WhatsApp-logo.png" />
        <SignInBTN variant="outlined" color="success" onClick={signIn}>
          SignIn With Google
        </SignInBTN>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-content: center;
  height: 100vh;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid whitesmoke;
  width: fit-content;
  padding: 50px;
  border-radius: 10px;
`;

const Logo = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  margin-bottom: 50px;
`;

const SignInBTN = styled(Button)`
  color: green;
  border: 1px solid green;
`;
