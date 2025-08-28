import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import NotFound from "./pages/not-found.jsx";
import HomePage from "./pages/home-page.jsx";
import SignInRoute from "./pages/sign-in.jsx";
import AuthChecking from "./lib/authCheking.jsx";
import Category from "./pages/category.jsx";
import ShowDetails from "./pages/show-details.jsx";
import Favorites from "./pages/favorite.jsx";
import Profile from "./pages/profile.jsx";
import Search from "./pages/search.jsx";
import Panel from "./pages/panel.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "category/:category", element: <Category /> },
      { path: "/shows/:id", element: <ShowDetails /> },
      { path: "/favorites", element: <Favorites /> },
      { path: "/search", element: <Search/> },
    ],
  },
  { path: "/signin", element: <SignInRoute /> },
  { path: "profile/:id?", element: <Profile /> },
  { path: "/panel", element: <Panel/> },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <AuthChecking />
    <RouterProvider router={router} />
  </>
  // </StrictMode>
);
