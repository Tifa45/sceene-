import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUserStore } from "./stores/user-store";
import { initialUserData } from "./lib/constans";
import NavBar from "./my-components/nav-bar";
import axios from "axios";
import api from "./lib/axios-utils";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const userLoading = useUserStore((s) => s.userLoading);
  const token = JSON.parse(localStorage.getItem("token"));
  const setUser = useUserStore((s) => s.setUser);
  const setUserLoading = useUserStore((s) => s.setUserLoading);
  const setTempToken = useUserStore((s) => s.setTempToken);
  const loggedOut = useUserStore((s) => s.loggedOut);
  const nav = useNavigate();
  async function getUser() {
    try {
      const response = await api.get("/users/current-user");
      const { userData } = response.data;
      setUser(userData);
      setTempToken(token);
      useUserStore.setState({ loggedOut: false });
    } catch (error) {
      setUser(initialUserData);
    }
    setUserLoading(false);
  }

  useEffect(() => {
    setUserLoading(true);

    if (token) {
      getUser();
    } else {
      setUserLoading(false);
      setUser(initialUserData);
      if (loggedOut) {
        nav("/");
      }
    }
  }, [loggedOut]);
  return (
    <>
      <div className="relative z-40 pt-8">
        {userLoading ? <p>Loading.. </p> : <NavBar />}
      </div>

      <div className="pb-8">
        <Outlet />
      </div>
      <Toaster richColors position="bottom-right" expand={true} />
    </>
  );
}

export default App;
