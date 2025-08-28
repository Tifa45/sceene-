import axios from "axios";
import { useUserStore } from "../stores/user-store";

export const formatUserFirstName = (name) => {
  const separate = name.split(" ")[0];
  const formated = separate.slice(0, 1).toUpperCase() + separate.slice(1);
  return formated;
};

export const formatUserFullName = (name) => {
  const separate = name.split(" ");
  const formated = separate
    .map((n) => n.slice(0, 1).toUpperCase() + n.slice(1))
    .join(" ");
  return formated;
};

export const formatUserInitials = (name) => {
  const separate = name.split(" ");
  const formated = separate.map((n) => n.slice(0, 1).toUpperCase()).join(" ");
  return formated;
};

export const formatDate = (stringDate) => {
  const date = new Date(stringDate);
  const formated = date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  return formated;
};

export const formatDateAndTime = (stringDate) => {
  const date = new Date(stringDate);
  const formatedDate = date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formatedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const fullDateAndTime = `${formatedDate}, ${formatedTime}`;
  return fullDateAndTime;
};

export const handleLogout = async () => {
  try {
    await axios.post("http://localhost:5000/api/auth/logout");
    localStorage.clear();
    useUserStore.setState({ loggedOut: true });
  } catch (error) {
    console.log(error);
  }
};
