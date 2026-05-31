const users = require("../controller/user.server.controllers")
const auth = require("../lib/authentication")

// User API Routes
module.exports = function(app){
    app.route("/users")
        .post(users.createAccount);
        
    app.route("/login")
        .post(users.login);

    app.route("/logout")
        .post(auth.isAuthenticated, users.logout);
    
    app.route("/users/:user_id")
        .get(users.getUser);
}

