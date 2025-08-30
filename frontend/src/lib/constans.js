import { Film, Plus, Users, NotebookTabs } from "lucide-react";

export const initialUserData = {
  userId: null,
  name: "",
  email: "",
  role: "",
  favorites: [],
};

export const navLinks = [
  { title: "Movies", route: "category/movies" },
  { title: "TV Shows", route: "category/tv" },
  { title: "Animation", route: "category/animation" },
];

export const publicUser = [
  { title: "Favorites", route: "favorites" },
  { title: "Profile", route: "profile" },
];

export const moderatorUser = [
  { title: "Favorites", route: "favorites" },
  { title: "Moderator Panel", route: "panel" },
  { title: "Profile", route: "profile" },
];

export const adminUser = [
  { title: "Favorites", route: "favorites" },
  { title: "Admin Panel", route: "panel" },
  { title: "Profile", route: "profile" },
];

export const adminPanel = [
  { title: "Add Shows", control: "addShows", icon: Plus },
  { title: "Your Shows", control: "userShows", icon: Film },
  { title: "Manage Users", control: "manageUsers", icon: Users },
  { title: "Activities", control: "activities", icon: NotebookTabs },
];
export const moderatorPanel = [
  { title: "Add Shows", control: "addShows", icon: Plus },
  { title: "Your Shows", control: "userShows", icon: Film },
];

export const roles = ["public", "moderator", "admin"];

export const categories = ["movies", "tv", "animation"];

export const genres = [
  "action",
  "comedy",
  "drama",
  "crime",
  "adventure",
  "documentary",
  "family",
  "fantasy",
  "history",
  "horror",
  "music",
  "mystery",
  "romance",
  "science fiction",
  "thriller",
  "war",
  "western",
];

export const years = [
  "2000",
  "2001",
  "2002",
  "2003",
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
];

export const models = ["User", "Show", "Comment"];

export const operations = ["create", "delete", "update"];

//motion constans-------------------------------------------------------------------------------------------------

export const defaultProps = {
  initial: "start",
  animate: "entry",
  exit: "out",
};

export const staggerProps = {
  initial: "start",
  animate: "entry",
  exit: "out",
  transition: { delayChildren: 0.8, staggerChildren: 0.4 },
};

export const heroBgVars = {
  start: {
    scale: 1,
    opacity: 0,
  },
  entry: {
    scale: 1,
    opacity: 1,

    transition: {
      scale: { duration: 0.3, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] },
      opacity: { duration: 2, ease: [0.22, 1, 0.36, 1] },
    },
  },
  out: {
    opacity: 0,
    transition: {
      scale: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
  },
};

export const heroImageVars = {
  start: {
    y: -1000,
    opacity: 0,
  },
  entry: {
    y: 0,
    opacity: 1,
    transition: {
      y: {
        duration: 0.5,
        delay: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 15,
        mass: 1,
      },
      opacity: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
  },
  out: {
    x: -1500,
    transition: {
      x: { duration: 0.4, ease: [0.36, 0, 0.66, -0.56] },
    },
  },
};

export const heroImageTitleVars = {
  start: {
    x: 1000,
    opacity: 0,
  },
  entry: {
    x: 0,
    opacity: 1,
    transition: {
      x: {
        duration: 0.5,
        delay: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 18,
        mass: 1,
      },
      opacity: { duration: 0.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
  },
  out: {
    opacity: 0,
    transition: {
      opacity: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  },
};

export const genresWrapperVars = {
  out: {
    y: 100,
    opacity: 0,
    transition: { duration: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
};

export const heroGenreVars = {
  start: {
    opacity: 0,
  },
  entry: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const modalTileVars = {
  start: {
    scale: 0,
  },
  entry: {
    scale: 1,
    transition: { duration: 0.3, delay: 0.3, type: "spring", bounce: 0.5 },
  },
  out: {
    scale: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

export const modalOutlayVars = {
  start: {
    y: -1000,
  },
  entry: {
    y: 0,
    transition: { duration: 0.3, type: "spring", bounce: 0.5 },
  },
  out: {
    y: -1000,
    transition: { duration: 0.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};
