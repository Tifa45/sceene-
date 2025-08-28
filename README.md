# 🎬 Sceene Show Library

A full-stack web application that lets you **explore, manage, and discuss your favorite shows**.  
It’s not a streaming platform — instead, it’s a **knowledge hub** where you can discover details about TV shows, movies, series, and animations.

---

## ✨ Features

### 🔎 Browsing
- Explore shows by **category**: TV, Movies, Series, Animation.
- **Search** shows by:
  - Name
  - Year of release
  - Genre (Drama, Romance, Action, etc.)
- Paginated list of shows displayed in clean **cards layout**.
- **Details page** for each show with:
  - Show description
  - Community comments

---

### 👤 User Roles

#### **Public Users**
- Browse and search shows.
- View show details and comments.
- Register / Log in.
- Manage personal info (username, password with old-password verification).

#### **Logged-In Users**
- Add shows to **favorites**.
- Add new **comments**.
- **Like** and **reply** to comments.

#### **Moderators**
- All logged-in user features, plus:
- Add new shows.
- Edit or delete shows **uploaded by them**.

#### **Admins**
- Full moderator powers, plus:
- Edit and delete **any show**.
- Access the **activity log** of each user:
  - Review user comments.
  - Delete abusive comments.
- Manage users:
  - Remove accounts.
  - Reset passwords.
  - Edit roles (**Public, Moderator, Admin**).

---

## 🛠️ Tech Stack
- **Frontend:** React + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Auth:** JWT-based authentication
- **State Management:** Zustand 
- **Notifications:** Toast system for real-time feedback

---

## 🚀 How It Works
1. Browse or search shows.
2. Click on a show to view its details and comments.
3. Log in to interact: favorite shows, comment, reply, like.
4. Moderators/Admins manage content.
5. Admins moderate user activities and roles.

---

## 📌 Notes
- No profile pictures — only **username** is displayed.
- The platform is designed for **discovering and discussing shows**, not streaming them.

---

## 🔮 Future Improvements
- Advanced filters (by rating, popularity).
- Recommendation system based on favorites.
- Dark/Light theme toggle.
- Email notifications for role changes or password resets.




