import React, { useEffect, useState } from "react";
import { useLoginUser } from "../services/queries";
import LoginDialog from "./Login";
import { useLocation } from "react-router-dom";

export const CheckLoginUser = () => {
  useLoginUser();
};

export const RequireAuth = ({ children }) => {
  const { data: user } = useLoginUser();
  const location = useLocation();
  const isLoggedIn = user ? true : false;
  const [loginOpen, setLoginOpen] = useState(!isLoggedIn);
  const onClose = () => setLoginOpen(false);
  useEffect(() => setLoginOpen(!isLoggedIn), [location, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <>
        <LoginDialog onClose={onClose} open={loginOpen} />
        Not logged in
      </>
    );
  } else {
    return children;
  }
};
