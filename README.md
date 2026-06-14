<div align="center">

# 🚗 Velocity Motors

![Vue](https://img.shields.io/badge/Vue-3-42B883)
![Vite](https://img.shields.io/badge/Vite-Client-646CFF)
![Node](https://img.shields.io/badge/Node.js-Server-339933)
![Express](https://img.shields.io/badge/Express-API-000000)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57)

</div>

## 📖 Overview

Velocity Motors is a full-stack vehicle marketplace application. The project is split into a Vue/ client and Node/Express server that uses SQLite.

Letting users work with a vehicle marketplace through a modern frontend and a backend API. The client handles the user interface, routing, and page experience, while the server handles API logic, validation, database access, logging, and tests.

The client and server run separately, so you will usually need two terminals open while developing the project.

## ✨ Features

- Vue frontend
- Vue Router page navigation
- Bootstrap styling
- Bootstrap Icons support
- Node and Express backend
- SQLite database
- Server-side validation with Joi
- Backend tests using Mocha, Chai, and Chai HTTP
- Development logging with Morgan
- Automatic server restarts with Nodemon
- CORS support for client and server communication

## 🗂️ Project Structure

| Folder | Description |
|---|---|
| `client` | Vue |
| `server` | REST API |

## 🛠️ Technologies Used

### Client

- Vue
- Bootstrap
- Email Validator

### Server

- Node
- Express
- SQLite
- Joi
- Mocha
- Chai
- Nodemon
- CORS
- Morgan
- Leo Profanity

## ✅ Requirements

Before running the application, make sure you have these installed:

- Git
- Node
- NPM

The client requires:

```text
Node ^20.19.0 or >=22.12.0
```

Check your installed versions:

```bash
node --version
npm --version
```

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/SirRmelTheThird/VelocityMotors.git
```

Open the project folder:

```bash
cd VelocityMotors
```

## 🚀 Running the Project

The client and server must be run separately using two terminals.

### Terminal 1: Run the Client

Move into the client folder:

```bash
cd client
```

Install the client dependencies:

```bash
npm install
```

Start the client development server:

```bash
npm run dev
```

The client will usually run on:

```text
http://localhost:5173
```

Open the URL shown in your terminal.

### Terminal 2: Run the Server

Open a second terminal from the root project folder, then move into the server folder:

```bash
cd server
```

Install the server dependencies:

```bash
npm install
```

Start the server in development mode:

```bash
npm run dev
```

This runs the server with Nodemon, so backend files restart automatically when changed.

## 📜 Client Scripts

Run these commands inside the `client` folder:

| Command | Description |
|---|---|
| `npm run dev` | Runs the Vite development server |
| `npm run build` | Builds the client for production |
| `npm run preview` | Previews the production build locally |

## 📜 Server Scripts

Run these commands inside the `server` folder:

| Command | Description |
|---|---|
| `npm run dev` | Runs the server using Nodemon |
| `npm test` | Runs all server tests |
| `npm run wipe` | Refreshes or wipes the test database |

## 🧪 Testing

The server uses Mocha, Chai, and Chai HTTP for testing.

Move into the server folder:

```bash
cd server
```

Run all server tests:

```bash
npm test
```

This runs:

```bash
mocha ./tests/test.*.js --reporter spec --log-level=warn --timeout 10000
```

## 🔄 Refreshing the Test Database

The server includes a database refresh script.

From the `server` folder, run:

```bash
npm run wipe
```

This runs:

```bash
mocha ./tests/database.refresh.js --reporter spec --log-level=warn --timeout 10000
```

Use this when the database needs to be reset before testing.

## 🧭 Suggested Workflow

Before testing the server, refresh the database:

```bash
cd server
npm run wipe
npm test
```

Before pushing client changes, build the client:

```bash
cd client
npm run build
```

This checks that the client can compile successfully.

## 🧯 Common Problems

### Client Will Not Start

Make sure you are inside the correct folder:

```bash
cd client
npm install
npm run dev
```

### Server Will Not Start

Make sure you are inside the server folder:

```bash
cd server
npm install
npm run dev
```

### Wrong Node Version

If Vite gives a Node version error, update Node.js.

The client requires:

```text
Node ^20.19.0 or >=22.12.0
```

### Port Already in Use

If the client or server port is already being used, stop the other application using that port.

Vite may also automatically choose another available port, so check the terminal output.

### Client Cannot Connect to Server

Check that:

- The server is running.
- The client is running.
- The client is using the correct server API URL.
- CORS is enabled on the server.
- The correct server port is being used.

### Tests Fail

Try refreshing the database first:

```bash
cd server
npm run wipe
npm test
```

### Dependencies Not Working

Delete `node_modules` and reinstall dependencies.

On macOS/Linux:

```bash
rm -rf node_modules package-lock.json
npm install
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```
