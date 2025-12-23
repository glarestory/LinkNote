# LinkNote (나만의 즐겨찾기)

LinkNote is a modern, web-based bookmark management application designed to help users organize their favorite links efficiently. It features Google Authentication, a responsive UI with Dark Mode, and powerful search capabilities.

## 🚀 Features

- **User Authentication**: Secure login with Google (OAuth 2.0).
- **Bookmark Management**: Create, Read, Update, and Delete bookmarks effortlessly.
- **Search**: Quickly find bookmarks by title, URL, or notes.
- **Responsive Design**: Optimized for both desktop and mobile viewing.
- **Dark Mode**: Toggle between Light and Dark themes for visual comfort.
- **User Settings**: Manage your profile and export your data.

## 🛠 Tech Stack

### Frontend (`linknote-web`)
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM (v6)

### Backend (`linknote-api`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Passport.js (Google Strategy), JWT
- **ORM/Query Builder**: Supabase JS Client

## 📂 Project Structure

```
LinkNote/
├── linknote-api/   # Backend Node.js/Express Server
├── linknote-web/   # Frontend React Application
├── docs/           # Project Documentation (PRD, TRD, etc.)
└── supa/           # Database Schema/Migration Files
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Project

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd LinkNote
    ```

2.  **Setup Backend**
    ```bash
    cd linknote-api
    npm install
    # Create .env file based on .env.example and fill in secrets
    ```

3.  **Setup Frontend**
    ```bash
    cd ../linknote-web
    npm install
    # Create .env file based on .env.example
    ```

### Running the App

To run both services concurrently (requires separate terminals):

**Terminal 1 (Backend):**
```bash
cd linknote-api
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd linknote-web
npm run dev
```

Visit `http://localhost:5173` to start using LinkNote!
