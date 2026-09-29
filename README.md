# NAS Backend

Backend server for **NAS (Network Attached Storage)** — a personal cloud storage application that provides user authentication, email verification, and secure access to stored data.

The backend is built with **Node.js, Express, MongoDB, and JWT authentication**.

## Features

* User registration
* User login
* Password hashing with bcrypt
* JWT-based authentication
* Email verification
* Protected API routes
* MongoDB database integration
* CORS support
* Environment variable configuration
* REST API architecture

## Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcrypt / bcryptjs**
* **Nodemailer**
* **CORS**
* **dotenv**

## Project Structure

```text
nas-server/
├── controllers/
│   └── authController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── utils/
│   └── ...
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

> The exact structure may change as additional NAS features are implemented.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd nas-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

Never commit `.env` to GitHub.

### 4. Start the server

For development:

```bash
npm run dev
```

Or:

```bash
node server.js
```

The server will run locally at:

```text
http://localhost:5000
```

## Authentication Flow

### Registration

```text
Client
  ↓
POST /api/auth/register
  ↓
Validate user data
  ↓
Hash password
  ↓
Create user in MongoDB
  ↓
Generate email verification token
  ↓
Send verification email
```

### Email Verification

```text
User clicks verification link
        ↓
Backend receives token
        ↓
Validate token
        ↓
Mark account as verified
```

### Login

```text
Client
  ↓
POST /api/auth/login
  ↓
Validate credentials
  ↓
Check account verification
  ↓
Generate JWT
  ↓
Return authentication response
```

## API Endpoints

### Authentication

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| `POST` | `/api/auth/register`     | Create a new account   |
| `POST` | `/api/auth/login`        | Login to an account    |
| `GET`  | `/api/auth/verify-email` | Verify user's email    |
| `GET`  | `/api/auth/me`           | Get authenticated user |

Additional endpoints can be added as the NAS storage functionality is developed.

## Authentication

Protected routes require a valid JWT.

Example:

```http
Authorization: Bearer <token>
```

The authentication middleware verifies the token before allowing access to protected resources.

## Database

NAS uses **MongoDB** with **Mongoose** for database interaction.

User records contain authentication-related information such as:

* Name
* Email
* Hashed password
* Email verification status
* Verification information
* Account timestamps

Passwords are never stored as plain text.

## Security

The backend follows several basic security practices:

* Passwords are hashed before storage.
* Authentication uses signed JWTs.
* Sensitive configuration is stored in environment variables.
* Protected routes require authentication.
* Email verification is required for verified accounts.
* `.env` files are excluded from version control.

## Frontend Integration

The frontend communicates with this backend through REST APIs.

During local development:

```javascript
const API_URL = "http://localhost:5000";
```

For production, replace this with the deployed backend URL:

```javascript
const API_URL = "https://your-backend-url";
```

It is recommended to keep the API URL in a frontend environment variable rather than hardcoding it.

## Development

Start the backend:

```bash
npm run dev
```

Then start the NAS frontend separately.

The frontend can communicate with the backend using Axios or the Fetch API.

## Environment

Make sure the following are configured before deployment:

```text
MongoDB connection
JWT secret
Email service credentials
Port
CORS configuration
```

## Deployment

The backend can be deployed to services such as:

* Render
* Railway
* Google Cloud
* AWS
* Other Node.js-compatible hosting platforms

After deployment, update the frontend's API base URL to point to the production backend.

## Future Features

Planned NAS functionality includes:

* File upload
* File download
* File deletion
* Folder management
* File metadata
* Storage quotas
* User profile management
* File sharing
* Access permissions
* Search
* Storage usage tracking

## License

This project is currently developed as a personal project.
