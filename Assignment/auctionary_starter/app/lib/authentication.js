const users = require('../model/user.server.model');

// Authorized Search
const isAuthenticated = function(req, res, next) {
    let token = req.get('X-Authorization');

     if (!token) {
        return res.sendStatus(401);
    }

    users.getIdFromToken(token, (err, id) => {
        if (err || id === null) return res.sendStatus(401);

        req.user_id = id;
        req.session_token = token;
        next();
    });
};

// Search Items Without Being Logged In
function authenticateOptional(req, res, next) {
    const token = req.get('X-Authorization');
    if (!token) {
        req.user_id = null;
        return next();
    }

    users.getIdFromToken(token, (err, id) => {
        if (err || id === null) {
            req.user_id = null; 
        } else {
            req.user_id = id;
        }
        next();
    });
}

// Function Exports
module.exports = {
    isAuthenticated,
    authenticateOptional
};
