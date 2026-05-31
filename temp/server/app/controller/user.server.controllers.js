const users = require('../model/user.server.model');
const Joi = require('joi');

// User Registration
const createAccount = (req, res) => {
    const userSchema = Joi.object({

        // Validation
        first_name: Joi.string().trim().min(1).required(),
        last_name: Joi.string().trim().min(1).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string()
            .min(8)
            .max(32)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/)
            .required()
        }).unknown(false);

    const { error } = userSchema.validate(req.body);

    if (error) return res.status(400).json({error_message: error.details[0].message});
    
    let user = Object.assign({}, req.body);
    
    // Add New User
    users.addNewUser(user, (err, result) => {
        if (err) {
            if (err.code == 'DUPE_EMAIL') {
                return res.status(400).json({ error_message: err.error_message  });
            }
            return res.status(500).json({ error_message: 'Server error' });
        }
        return res.status(201).json({user_id: result.user_id});
    });
}

// Log User In
const login = (req, res) => {

    // Validation
    const userSchema = Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().required(),
    }).unknown(false);

    const { error } = userSchema.validate(req.body);

    if (error) return res.status(400).json({error_message: error.details[0].message});

    const { email, password } = req.body;
    
    // Authenticate User
    users.authenticateUser(email, password, (err, id) => {
        if (err) {
            if (err.code === 'EMAIL_NOT_FOUND' || err.code === 'INVALID_PASSWORD') {
                return res.status(400).json({ error_message: err.error_message });
            }
            return res.status(500).json({ error_message: 'Server error' });
        }

        // Get X-Authorization Token
        users.getToken(id, (err, token) => {
            if (err) return res.status(500).json({ error_message: 'Server error' });

            if (token && token.session_token) {
                return res.status(200).json({ user_id: id, session_token: token.session_token });
            } else {
                users.setToken(id, (err, newToken) => {
                    if (err) return res.status(500).json({ error: 'Server error' });
                    return res.status(200).json({ user_id: id, session_token: newToken });
                });
            }
        });
    });
};

// Log User Out
const logout = (req, res) => {
    const token = req.session_token;

    // Remove X-Authorization Token
    users.removeToken(token, (err) => {
        if (err) return res.status(500)
        return res.sendStatus(200);
    }); 
}

// User Profile
const getUser = (req, res) => {
    const user_id =  req.params.user_id;

    users.retrieve(user_id, (err, result) => {
        if (err) {
            if (err.code == 'USER_NOT_FOUND') {
                return res.sendStatus(404);
            }
        }
        return res.status(200).json(result);
    });
}

// Function Exports
module.exports = {
    createAccount,
    login,
    logout,
    getUser
};
