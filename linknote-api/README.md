# LinkNote API

The backend server for LinkNote, built with Node.js and Express.

## 🔧 Configuration

Create a `.env` file in the root of `linknote-api` with the following variables:

```env
PORT=3000
DATABASE_URL=your_supabase_postgres_connection_string
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

## 📡 API Endpoints

### Authentication
- `GET /auth/google`: Initiate Google OAuth login
- `GET /auth/google/callback`: Handle OAuth callback
- `POST /auth/logout`: Log out user (clear cookies)
- `GET /auth/me`: Get current user info

### Bookmarks
- `GET /bookmarks`: List bookmarks (pagination supported)
- `GET /bookmarks/search?q={query}`: Search bookmarks
- `POST /bookmarks`: Create a new bookmark
- `GET /bookmarks/:id`: Get a specific bookmark
- `PUT /bookmarks/:id`: Update a bookmark
- `DELETE /bookmarks/:id`: Delete a bookmark

### Users
- `PUT /users/me`: Update profile (display name, avatar)
- `DELETE /users/me`: Delete account

## 🏃‍♂️ Scripts

- `npm run dev`: Start dev server with nodemon
- `npm run build`: Compile TypeScript
- `npm start`: Start production server
