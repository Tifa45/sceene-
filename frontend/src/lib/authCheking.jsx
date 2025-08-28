import { useEffect } from "react";
import { useUserStore } from "../stores/user-store";
import axios from "axios";
import { initialUserData } from "./constans";
import api from "./axios-utils";

function AuthChecking() {
  const setUser = useUserStore((s) => s.setUser);
  const setUserLoading = useUserStore((s) => s.setUserLoading);
  const setTempToken = useUserStore((s) => s.setTempToken);
  const tempToken = useUserStore((s) => s.tempToken);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    async function getUser(token) {
      setUserLoading(true);
      try {
        const response = await api.get("/users/current-user");
        const { userData } = response.data;

        setUser(userData);
        setTempToken(token);
      } catch (error) {
        console.log(error);
        setUser(initialUserData);
      }
      setUserLoading(false);
    }

    if (token) {
      getUser(token);
    } else {
      setUser(initialUserData);
      setUserLoading(false);
    }
  }, [tempToken]);
  return null;
}

export default AuthChecking;
