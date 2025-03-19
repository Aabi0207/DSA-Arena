# 🏆 DSA Arena

A Question practice platform to help users improve their DSA (Data Structures & Algorithms) skills by solving curated questions, tracking progress, and managing notes.

## 🚀 Live Demo
🔗 [Try DSA Arena](https://dsa-arena.vercel.app/sheet)

---

## 🎯 Objective
To provide a structured and interactive platform for practicing DSA questions with real-time progress tracking, and to keep sutdents motivate by creating a compitative environment.

---

## 💻 Tech Stack

### 🔸 Frontend (React)
- HTML / CSS / JavaScript
- React.js
- Lucide Icons
- Auth Context API
- Responsive & Modular UI

### 🔹 Backend (Django)
- Django REST Framework
- Email Based Authentication
- Media File Handling
- Score, Rank & Progress APIs
- Notes & Question Status APIs

---

## ✨ Key Features
- ✅ Solve & Save Questions  
- 📊 Track progress with circular progress indicators  
- 📒 Add personal notes for each question  
- 📚 Sheets grouped by topics  
- 🏅 Leaderboard and user ranking system  
- 🔐 Auth-protected routes and persistent sessions  
- 📱 Mobile responsive Design

---

## 📂 Folder Structure Overview

### Backend
```
backend/
├── backend/
├── media/
├── questions/
├── users/
├── db.sqlite3
├── manage.py
└── requirements.txt
```

### Frontend
```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AlertPopup/
│   │   ├── Header/
│   │   ├── HoverMessage/
│   │   ├── Loading/
│   │   ├── Login/
│   │   ├── Navbar/
│   │   ├── Notes/
│   │   ├── Question/
│   │   ├── QuestionList/
│   │   ├── Register/
│   │   ├── Sheet/
│   │   ├── Sidebar/
│   │   └── Stepper/
│   ├── contexts/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── SheetPage.jsx
│  
```

---

## ⚙️ Getting Started

### 🔧 Backend Setup
```bash
python -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows
cd backend/
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### ⚙️ Frontend Setup
```bash
cd frontend/
npm install
npm run dev
```

<!-- ---

## 📸 Screenshots (optional)
_Add visuals of SheetPage, Notes popup, Progress Tracker, Sidebar, etc._ -->

---

## 📬 Contact
Made with ❤️ by **Abhishek**  
📧 [abhishekbiradar0207@gmail.com](mailto:abhishekbiradar0207@gmail.com)  
🔗 [LinkedIn](https://linkedin.com/in/abhishek-biradar-915404281)  
🔗 [Portfolio](https://abhishek-biradar.vercel.app/)

---

