import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AlbumCreate from "../Album/AlbumCreate";
import AlbumView from "../Album/AlbumView";
import About from "../other/About";
import { queryClient } from "../services/queries";
import { CheckLoginUser, RequireAuth } from "./AuthControl";
import Layout from "./Layout";

const Routing = () => (
  <Routes>
    <Route
      path="/"
      exact={true}
      element={
        <RequireAuth>
          <AlbumCreate />
        </RequireAuth>
      }
    />
    <Route
      path="/album/:albumId"
      exact={true}
      element={
        <RequireAuth>
          <AlbumView />
        </RequireAuth>
      }
    />
    <Route path="/about" exact={true} element={<About />} />
  </Routes>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <CheckLoginUser />
      <BrowserRouter>
        <Layout Content={<Routing />} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
