# CRUD API Application

A complete Node.js CRUD application built with Express.js that supports multiple databases: MongoDB, MySQL, and SQLite. This application provides a RESTful API for managing users with full CRUD operations.

## Features

- ✅ **Multi-Database Support**: MongoDB, MySQL, and SQLite
- ✅ **RESTful API**: Complete CRUD operations for users
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Async/Await**: Modern JavaScript async patterns
- ✅ **Environment Configuration**: Easy database switching via .env
- ✅ **Structured Code**: Organized folders (routes, controllers, models, config)
- ✅ **Nodemon Support**: Auto-restart on file changes during development
- ✅ **Windows Compatible**: Fully tested on Windows 11

## Project Structure

```
CRUD/
├── config/
│   ├── mongo.js        # MongoDB configuration
│   ├── mysql.js        # MySQL configuration
│   └── sqlite.js       # SQLite configuration
├── models/
│   ├── mongoUser.js    # MongoDB User model (Mongoose)
│   ├── mysqlUser.js    # MySQL User model
│   └── sqliteUser.js   # SQLite User model
├── controllers/
│   └── userController.js  # CRUD operations
├── routes/
│   └── userRoutes.js   # API endpoints
├── database/           # SQLite database files (auto-created)
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env               # Environment variables (create from .env.example)
├── .env.example       # Example environment variables
└── README.md          # This file
```

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- For **MongoDB**: MongoDB running locally or MongoDB Atlas connection
- For **MySQL**: MySQL server running locally or remote connection
- For **SQLite**: No additional setup needed (database auto-created)

## Installation

### 1. Clone or Extract the Project

```bash
cd CRUD
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **mysql2** - MySQL driver
- **sqlite3** - SQLite driver
- **dotenv** - Environment variable management
- **body-parser** - JSON/URL-encoded parser
- **nodemon** (dev) - Auto-restart during development

### 3. Create Environment Configuration

Copy the example environment file and customize it:

```bash
# Copy the example file
cp .env.example .env
```

Or manually create a `.env` file in the root directory with your database configuration.

## Database Setup

Choose one database and configure it in the `.env` file:

### Option A: SQLite (Recommended for Quick Start)

**Easiest option - No additional setup required!**

1. Ensure `.env` contains:
```
DB_TYPE=sqlite
SQLITE_DB_PATH=./database/crud_app.db
```

2. The database file will be created automatically when the server starts.

### Option B: MongoDB

**Setup:**

1. **Local MongoDB** (if installed):
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

2. **MongoDB Atlas** (Cloud):
   - Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and get connection string

3. Configure `.env`:
```
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/crud_app
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crud_app?retryWrites=true&w=majority
```

### Option C: MySQL

**Setup:**

1. **Install MySQL Server**:
   - Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
   - Default port is 3306

2. **Create Database**:
   ```bash
   mysql -u root -p
   CREATE DATABASE crud_app;
   EXIT;
   ```

3. Configure `.env`:
```
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=crud_app
MYSQL_PORT=3306
```

The `users` table will be created automatically when the server starts.

## Running the Application

### Development Mode (with Nodemon - Auto-restart)

```bash
npm run dev
```

Output:
```
[nodemon] restarting due to changes...
[nodemon] starting `node server.js`
✓ MySQL connected successfully
✓ Users table created or already exists

✓ Using SQLITE database

✓ Server running on http://localhost:3000

📚 API Endpoints:
   GET    http://localhost:3000/api/users
   POST   http://localhost:3000/api/users
   GET    http://localhost:3000/api/users/:id
   PUT    http://localhost:3000/api/users/:id
   DELETE http://localhost:3000/api/users/:id

💾 Database: SQLITE
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Base URL
```
http://localhost:3000/api/users
```

### 1. Get All Users
```
GET /api/users
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-03-05T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2026-03-05T10:35:00.000Z"
    }
  ]
}
```

---

### 2. Create User
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-03-05T10:30:00.000Z"
  }
}
```

---

### 3. Get Single User
```
GET /api/users/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-03-05T10:30:00.000Z"
  }
}
```

**Error Response (if user not found):**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 4. Update User
```
PUT /api/users/1
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
}
```

---

### 5. Delete User
```
DELETE /api/users/1
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 6. Health Check
```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "database": "sqlite",
  "timestamp": "2026-03-05T10:30:00.000Z"
}
```

## Testing with cURL or Postman

### Using cURL

```bash
# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\"}"

# Get single user (ID = 1)
curl http://localhost:3000/api/users/1

# Update user (ID = 1)
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Updated\",\"email\":\"john.new@example.com\"}"

# Delete user (ID = 1)
curl -X DELETE http://localhost:3000/api/users/1
```

### Using Postman

1. Open **Postman**
2. Import or create these requests:

| Method | URL | Body |
|--------|-----|------|
| GET | `http://localhost:3000/api/users` | - |
| POST | `http://localhost:3000/api/users` | `{"name":"John","email":"john@example.com"}` |
| GET | `http://localhost:3000/api/users/1` | - |
| PUT | `http://localhost:3000/api/users/1` | `{"name":"Updated","email":"new@example.com"}` |
| DELETE | `http://localhost:3000/api/users/1` | - |

## Error Handling

The API returns appropriate HTTP status codes:

| Status | Description |
|--------|-------------|
| **200** | Success (GET, PUT) |
| **201** | Created (POST) |
| **400** | Bad Request (invalid data) |
| **404** | Not Found (user doesn't exist) |
| **409** | Conflict (duplicate email) |
| **500** | Server Error |

**Example Error Response:**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

## Switching Databases

To switch between databases, simply change the `DB_TYPE` in `.env` and restart the server:

```bash
# For SQLite
DB_TYPE=sqlite

# For MongoDB
DB_TYPE=mongodb

# For MySQL
DB_TYPE=mysql
```

No code changes needed! The application automatically loads the correct database connection and model handlers.

## User Model Fields

```javascript
{
  id:        Number,      // Auto-generated primary key
  name:      String,      // User's full name (required)
  email:     String,      // User's email (required, unique)
  createdAt: DateTime     // Record creation timestamp
}
```

## Validation Rules

- **Name**: Required, max 255 characters
- **Email**: Required, must be valid email format, must be unique
- **ID**: Must be a positive integer

## Common Issues & Solutions

### Error: "connect ECONNREFUSED"
- MongoDB/MySQL not running
- **Solution**: Start MongoDB (`mongod`) or MySQL service

### Error: "ER_BAD_DB_ERROR: Unknown database"
- MySQL database doesn't exist
- **Solution**: Create database: `CREATE DATABASE crud_app;`

### Error: "UNIQUE constraint failed"
- Trying to create/update with duplicate email
- **Solution**: Use a different email address

### Port 3000 already in use
- Another application using port 3000
- **Solution**: Kill process or change PORT in .env

## Environment Variables Reference

```env
# Database selection
DB_TYPE=sqlite|mongodb|mysql

# MongoDB (if using MongoDB)
MONGODB_URI=mongodb://localhost:27017/crud_app

# MySQL (if using MySQL)
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=crud_app
MYSQL_PORT=3306

# SQLite (if using SQLite)
SQLITE_DB_PATH=./database/crud_app.db

# Server
PORT=3000
NODE_ENV=development|production
```

## File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Main application entry point, database connection, route setup |
| `config/mongo.js` | MongoDB connection and initialization |
| `config/mysql.js` | MySQL pool configuration and table creation |
| `config/sqlite.js` | SQLite connection and utility functions |
| `models/mongoUser.js` | Mongoose schema for MongoDB |
| `models/mysqlUser.js` | MySQL User class with CRUD methods |
| `models/sqliteUser.js` | SQLite User class with CRUD methods |
| `controllers/userController.js` | CRUD operations logic |
| `routes/userRoutes.js` | Express.js route definitions |

## Graceful Shutdown

The application handles graceful shutdown when pressing `Ctrl+C`:

```bash
# Press Ctrl+C to stop the server
^C
Shutting down gracefully...
✓ All connections closed
```

All database connections are properly closed before exit.

## Performance Tips

1. **SQLite**: Best for development and testing locally
2. **MySQL**: Good for small to medium applications
3. **MongoDB**: Ideal for document-based data structures

## Security Notes

- Always use environment variables for sensitive data
- Keep `.env` out of version control (add to `.gitignore`)
- Use strong passwords for database access
- Validate and sanitize all user inputs
- Use HTTPS in production
- Implement rate limiting for production APIs

## License

ISC License - Feel free to use this project freely.

## Support

For issues or questions:
1. Check the **Error Handling** section above
2. Verify database configuration in `.env`
3. Ensure database service is running
4. Check Node.js console output for detailed error messages

---

**Happy Coding! 🚀**
