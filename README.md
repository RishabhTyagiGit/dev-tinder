# DevTinder

Tinder for Devs: A platform for developers to connect, match, and network based on their skills and interests.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [Scripts](#scripts)

---

## Features

- User authentication (signup, login, logout)
- Profile management (view, edit)
- Send and review connection requests
- User feed with pagination
- Secure password storage and JWT-based authentication

## Project Structure

```
/ (root)
├── package.json
├── .env
└── src/
    ├── app.js                # Main Express app
    ├── config/
    │   └── database.js       # MongoDB connection logic
    ├── middlewares/
    │   └── auth.js           # JWT authentication middleware
    ├── models/
    │   ├── user.js           # User schema
    │   └── connectionRequest.js # Connection request schema
    ├── routes/
    │   ├── auth.js           # Auth routes
    │   ├── profile.js        # Profile routes
    │   ├── request.js        # Connection request routes
    │   └── user.js           # User-related routes
    └── utils/
        └── validation.js     # Validation utilities
```

## Environment Variables

Set these in your `.env` file:

- `PORT` - Port number for the server (e.g., 3000)
- `DATABASE_CONNECTION_STRING` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT authentication

## Setup & Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up your `.env` file as described above.
4. Start the server:
   - For development: `npm run dev`
   - For production: `npm start`

## API Endpoints

### Auth

- `POST /signup` - Register a new user
- `POST /login` - Login and receive JWT token (set as cookie)
- `POST /logout` - Logout user (clears cookie)

### Profile

- `GET /profile/view` - View logged-in user's profile
- `PATCH /profile/edit` - Edit profile fields (firstName, lastName, emailId, photoUrl, gender, age, about, skills)

### Connection Requests

- `POST /request/send/:status/:toUserId` - Send a connection request (`status`: 'ignored' or 'interested')
- `POST /request/review/:status/:requestId` - Review a received request (`status`: 'accepted' or 'rejected')

### User

- `GET /user/requests/received` - Get received connection requests
- `GET /user/connections` - Get all accepted connections
- `GET /feed?page=1&limit=10` - Get user feed (paginated, excluding already connected users)

## Models

### User

- `firstName` (String, required, min 4 chars)
- `lastName` (String)
- `emailId` (String, required, unique, validated)
- `password` (String, required, hashed, strong password)
- `age` (Number, min 18)
- `gender` (String, enum: 'male', 'female', 'other')
- `isPremium` (Boolean, default: false)
- `photoUrl` (String, validated URL, default provided)
- `about` (String, default provided)
- `skills` (Array of Strings)
- `timestamps` (createdAt, updatedAt)

### ConnectionRequest

- `fromUserId` (ObjectId, ref: User, required)
- `toUserId` (ObjectId, ref: User, required)
- `status` (String, enum: 'ignored', 'interested', 'accepted', 'rejected', required)
- `timestamps` (createdAt, updatedAt)

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server with nodemon (auto-restart on changes)

---

## License

ISC

## Author

Rishabh Tyagi
