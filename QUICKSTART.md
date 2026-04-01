# Quick Start Guide for Windows 11

This guide will get you up and running in 5 minutes!

## Step 1: Install Node.js (if not already installed)

1. Download from: https://nodejs.org/ (LTS version recommended)
2. Run the installer and follow the steps
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Step 2: Navigate to Project Directory

```bash
cd "C:\Users\[YourUsername]\OneDrive\Desktop\CRUD"
```

## Step 3: Install Dependencies

```bash
npm install
```

This takes 1-2 minutes. You'll see it downloading packages.

## Step 4: Choose Your Database

Edit the `.env` file (open in Notepad or VS Code):

### For SQLite (Easiest! Recommended for beginners)
```
DB_TYPE=sqlite
SQLITE_DB_PATH=./database/crud_app.db
```
✅ No additional setup needed!

### For MySQL
1. Install MySQL: https://dev.mysql.com/downloads/mysql/
2. After installation, open Command Prompt and create database:
   ```bash
   mysql -u root -p
   CREATE DATABASE crud_app;
   EXIT;
   ```
3. Edit `.env`:
   ```
   DB_TYPE=mysql
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password_here
   MYSQL_DATABASE=crud_app
   ```

### For MongoDB
1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster and copy connection string
3. Edit `.env`:
   ```
   DB_TYPE=mongodb
   MONGODB_URI=your_connection_string_here
   ```

## Step 5: Start the Application

```bash
npm run dev
```

You should see:
```
✓ Server running on http://localhost:3000
```

## Step 6: Test the API

Open your browser and visit:
```
http://localhost:3000
```

You should see a welcome message with API endpoints.

### Using Postman (Recommended for API testing)

1. Download Postman: https://www.postman.com/downloads/
2. Create a new request:

#### Create a User
- **Type**: POST
- **URL**: `http://localhost:3000/api/users`
- **Body** (JSON):
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- **Click Send**

#### Get All Users
- **Type**: GET
- **URL**: `http://localhost:3000/api/users`
- **Click Send**

#### Get Single User
- **Type**: GET
- **URL**: `http://localhost:3000/api/users/1`
- **Click Send**

#### Update User
- **Type**: PUT
- **URL**: `http://localhost:3000/api/users/1`
- **Body** (JSON):
  ```json
  {
    "name": "Updated Name",
    "email": "newemail@example.com"
  }
  ```
- **Click Send**

#### Delete User
- **Type**: DELETE
- **URL**: `http://localhost:3000/api/users/1`
- **Click Send**

## Troubleshooting

### "npm: command not found"
- Node.js not installed. Download and install from nodejs.org

### "Port 3000 already in use"
- Another program using port 3000
- Change PORT in `.env` file to 3001, 3002, etc.

### "Cannot find module"
- Run `npm install` again
- Make sure you're in correct directory

### "Error connecting to database"
- Check `.env` file for correct configuration
- Make sure database service is running (MySQL/MongoDB)
- For SQLite, database folder will be created automatically

### "UNIQUE constraint failed: users.email"
- Email already exists in database
- Try with different email address

## File Structure After Setup

```
CRUD\
├── node_modules\              ← Dependencies installed here
├── database\                   ← SQLite database (auto-created)
│   └── crud_app.db
├── config\
│   ├── mongo.js
│   ├── mysql.js
│   └── sqlite.js
├── models\
│   ├── mongoUser.js
│   ├── mysqlUser.js
│   └── sqliteUser.js
├── controllers\
│   └── userController.js
├── routes\
│   └── userRoutes.js
├── server.js
├── package.json
├── .env                        ← Your configuration
├── .env.example
├── .gitignore
└── README.md
```

## API Quick Reference

| Operation | Method | Endpoint | Body |
|-----------|--------|----------|------|
| Get All | GET | `/api/users` | - |
| Create | POST | `/api/users` | `{name, email}` |
| Get One | GET | `/api/users/:id` | - |
| Update | PUT | `/api/users/:id` | `{name, email}` |
| Delete | DELETE | `/api/users/:id` | - |

## Sample cURL Commands (PowerShell)

```powershell
# Get all users
curl http://localhost:3000/api/users

# Create user
$body = @{name="John"; email="john@example.com"} | ConvertTo-Json
curl -Method POST http://localhost:3000/api/users `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# Get user by ID
curl http://localhost:3000/api/users/1

# Update user
$body = @{name="Updated"; email="new@example.com"} | ConvertTo-Json
curl -Method PUT http://localhost:3000/api/users/1 `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# Delete user
curl -Method DELETE http://localhost:3000/api/users/1
```

## Stopping the Server

Press `Ctrl + C` in the terminal where server is running.

You'll see:
```
^C
Shutting down gracefully...
✓ All connections closed
```

## Next Steps

1. ✅ Application is running
2. ✅ API is accessible
3. Customize based on your needs:
   - Add more fields to User model
   - Create additional routes
   - Add authentication
   - Deploy to a server

## Helpful Links

- Node.js Documentation: https://nodejs.org/docs/
- Express.js Guide: https://expressjs.com/
- Postman Documentation: https://learning.postman.com/
- SQLite: https://www.sqlite.org/
- MySQL: https://dev.mysql.com/doc/
- MongoDB: https://docs.mongodb.com/

---

**You're all set! Happy coding! 🎉**
