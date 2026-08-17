<div align="center">

# 📚 Library Management System

### A Modern Library Management Web Application

<p align="center">
Manage books, borrowers, and library operations efficiently.
</p>

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

# 📖 Overview

Library Management System is a full-stack web application that helps libraries efficiently manage books, users, and borrowing records.

The application allows librarians to maintain book inventories while users can browse available books, issue books, and return them with ease.

This project demonstrates CRUD operations, REST APIs, authentication, and database management using the MERN stack

---

# ✨ Features

## 📚 Book Management

- Add Books
- Edit Book Details
- Delete Books
- Search Books
- Book Categories
- Book Availability status

---

## 👤 User Management

- Register Users
- Login
- User Profile
- Manage Members

---

## 📖 Borrowing System

- Issue Books
- Return Books
- Due Date Tracking
- Borrowing History

---

## 📊 Dashboard

- Total Books
- Available Books
- Borrowed Books
- Total Members
- Recent Transactions

---

# 🛠 Tech Stack

## Frontend

- React.js
- HTML5
- CSS3
- JavaScript
- Axios

## Backend

- Node.js
- Express.js

## Database

- MongoDB

## Tools

- VS Code
- Git
- GitHub
- Postman

---

# 📂 Project Structure

```text
library-management-system
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── assets
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/PavanKumar9474/library-management-system.git
```

---

## Backend

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Run Server

```bash
npm start
```

---

## Frontend

```bash
cd frontend
```

Install Packages

```bash
npm install
```

Run Application

```bash
npm start
```

---

# 🌐 Environment Variables

Create a `.env` file in the backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

# 📸 Screenshots :

## 🏠 Home Page

```
(Add Screenshot Here)
```

---

## 📚 Book Management

```
(Add Screenshot Here)
```

---

## 👤 User Dashboard

```
(Add Screenshot Here)
```

---

## 📖 Issue Book

```
(Add Screenshot Here)
```

---

# 🎯 Workflow

```text
User Login

      ↓

Dashboard

      ↓

Browse Books

      ↓

Issue Book

      ↓

Borrow Record Created

      ↓

Return Book

      ↓

Inventory Updated
```

---

# 🔐 Authentication

- JWT Authentication
- Password Hashing
- Protected Routes
- User Authorization

---

# 📊 Dashboard

Displays

- Total Books
- Borrowed Books
- Available Books
- Registered Members
- Active Users

---

# 📌 API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login
```

---

## Books

```
GET /api/books

POST /api/books

PUT /api/books/:id

DELETE /api/books/:id
```

---

## Users

```
GET /api/users

POST /api/users
```

---

## Borrowing

```
POST /api/borrow

PUT /api/return

GET /api/history
```

---

# 📱 Responsive Design

Supports

- Desktop
- Laptop
- Tablet
- Mobile

---

# 💡 Future Improvements

- Barcode Scanner
- QR Code Support
- Email Notifications
- Fine Calculation
- Book Reservation
- PDF Reports
- Admin Analytics
- Role-Based Access
- Dark Mode
- Cloud Deployment

---

# 📝 Roadmap

- [ ] Authentication
- [ ] Book Search
- [ ] Issue Books
- [ ] Return Books
- [ ] Fine Calculation
- [ ] Email Alerts
- [ ] Reports
- [ ] Dashboard Analytics
- [ ] QR Code Integration

---

# 🤝 Contributing

Contributions are welcome.

1. Fork this repository

2. Create a branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added New Feature"
```

4. Push

```bash
git push origin feature-name
```

5. Create a Pull Request

---

# 👨‍💻 Author

## Pavan Kumar

**Python Full Stack Developer**

### Skills

- Python
- FastAPI
- React
- JavaScript
- Node.js
- Express.js
- PostgreSQL
- MongoDB
- Docker

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful,

⭐ Star this repository

🍴 Fork this repository

📢 Share it with others

---

<div align="center">

## ❤️ Thank You

Made with ❤️ by **Pavan Kumar**

**Don't forget to ⭐ Star this repository if you found it useful!**

</div>
