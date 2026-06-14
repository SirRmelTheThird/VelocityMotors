# Velocity Motors

Velocity Motors is a full-stack vehicle marketplace application. The project contains a separate Vue/Vite client folder and a Node.js/Express server folder using SQLite.

## Technologies Used

### Client

- Vue 3
- Vue Router
- Vite
- Bootstrap
- Bootstrap Icons
- Email Validator

### Server

- Node.js
- Express
- SQLite
- Joi
- Mocha
- Chai
- Chai HTTP
- Nodemon
- CORS
- Morgan
- Leo Profanity

## Requirements

Before running the application, make sure you have the following installed:

- Git
- Node.js
- NPM
- VS Code

The client requires:

```bash
Node ^20.19.0 or >=22.12.0
```

Check your installed versions:

```bash
node --version
npm --version
```

## Clone the Repository

```bash
git clone https://github.com/SirRmelTheThird/VelocityMotors.git
cd VelocityMotors
```

## Install and Run the Client

The client and server must be run separately using two terminals.

Open a terminal from the root project folder.

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

This runs the Vite development server.

The client will usually run on:

```text
http://localhost:5173
```

Open the URL shown in the terminal.

## Install and Run the Server

Open a second terminal from the root project folder.

Move into the server folder:

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

This runs:

```bash
nodemon server.js
```

Nodemon automatically restarts the server when backend files are changed.

## Client Scripts

Inside the `client` folder, the following scripts are available:

```bash
npm run dev
```

Runs the Vite development server.

```bash
npm run build
```

Builds the client for production.

```bash
npm run preview
```

Previews the production build locally.

## Server Scripts

Inside the `server` folder, the following scripts are available:

```bash
npm run dev
```

Runs the server using Nodemon.

```bash
npm test
```

Runs all server tests.

```bash
npm run wipe
```

Refreshes or wipes the test database.

## Testing the Server

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

## Refreshing the Test Database

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

## Suggested Testing Process

Before testing the server, refresh the database:

```bash
cd server
npm run wipe
```

Then run the test suite:

```bash
npm test
```

Before pushing client changes, build the client:

```bash
cd client
npm run build
```

This checks that the client can compile successfully.

## Common Problems

### Client Will Not Start

Make sure you are inside the correct folder:

```bash
cd client
```

Then reinstall dependencies and run the client:

```bash
npm install
npm run dev
```

### Server Will Not Start

Make sure you are inside the server folder:

```bash
cd server
```

Then reinstall dependencies and run the server:

```bash
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

You can also check the terminal output because Vite may automatically choose another available port.

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

Delete `node_modules` and reinstall.

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
