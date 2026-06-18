# 📝 Notes Manager

A full-stack Notes Manager application that allows users to create, view, edit, and delete notes efficiently. The application provides a clean and user-friendly interface for managing personal notes with persistent database storage.

## 🚀 Features

### Core Features

* ➕ Create new notes
* 📋 View all saved notes
* ✏️ Edit existing notes
* 🗑️ Delete notes
* 🔍 View note details
* 💾 Persistent database storage

### User Interface

* Modern and responsive design
* Easy-to-use note creation form
* Organized notes listing section
* Dedicated note viewing area
* Mobile-friendly layout

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript (ES6+)

### Backend

* Node.js
* Express.js

### Database

* MongoDB

## 📂 Project Structure

```text
notes_manager/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Manuel-246/notes_manager.git
cd notes_manager
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 5. Start Backend Server

```bash
cd backend
npm start
```

### 6. Start Frontend Application

```bash
cd frontend
npm start
```

The application will be available at:

```text
Frontend: http://localhost:3000
Backend: http://localhost:5000
```

## 📖 Usage

1. Open the application.
2. Create a new note using the note form.
3. View all notes in the notes list.
4. Select a note to view details.
5. Edit notes whenever needed.
6. Delete notes that are no longer required.

## 🎯 Learning Objectives

This project demonstrates:

* CRUD Operations
* REST API Development
* React State Management
* Database Integration
* Full-Stack Development
* Frontend and Backend Communication

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## 📜 License

This project is developed for educational and learning purposes.

## 👨‍💻 Author

Developed by Manuel-246
