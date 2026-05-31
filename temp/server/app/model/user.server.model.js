const db = require('../../database');
const crypto = require('crypto');

// Create New User
const addNewUser = (user, done) => {
    const salt = crypto.randomBytes(64);
    const hash= getHash(user.password, salt);

    const sql = 'INSERT INTO users (first_name, last_name, email, password, salt, session_token) VALUES (?,?,?,?,?,?)';

    const params = [
        user.first_name,
        user.last_name,
        user.email,
        hash,             
        salt.toString('hex'),
        null              
    ];

    db.run(sql, params, function (err) {

        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return done({ code: 'DUPE_EMAIL', error_message: 'Email is already registered' });
            }
            return done(err);
        }

        const results = {
            user_id: this.lastID,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: hash,
            salt: salt.toString('hex'),
            session_token: null
        }

        return done(null, results);
    })
}

// Hash Password
const getHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 256, 'sha256').toString('hex');
}

// User Profile Information
const retrieve = (id, done) => {
    const sql = 'SELECT user_id, first_name, last_name FROM users WHERE user_id = ?';

    db.get(sql, [id], (err, user) => {
        if (err) return done(err);
        if (!user) return done({ code: 'USER_NOT_FOUND', error_message: 'User does not exist' });

        const userProfile = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            selling: [],
            bidding_on: [],
            auctions_ended: []
        };

        // Gather User Selling Items
        sellingSql = `
            SELECT items.item_id, items.name, items.description, items.end_date,
            users.user_id AS creator_id,
            users.first_name AS first_name,
            users.last_name AS last_name
            FROM items
            INNER JOIN users ON items.creator_id = users.user_id
            WHERE creator_id = ? `;

        db.all(sellingSql, [id], (err, items) => {
            if (err) return done(err);
            userProfile.selling = items || [];

            // Gather User Bidding Items
            const biddingSql = `
                SELECT DISTINCT items.item_id, items.name, items.description, items.end_date, items.creator_id, users.first_name AS first_name, users.last_name AS last_name
                FROM bids
                INNER JOIN items ON bids.item_id = items.item_id
                INNER JOIN users ON items.creator_id = users.user_id
                WHERE bids.user_id = ? 
            `;
            db.all(biddingSql, [id], (err, bids) => {
                if (err) return done(err);
                userProfile.bidding_on = bids || [];

                // Gather User Archive Items
                const endedSql = `
                    SELECT DISTINCT items.item_id, items.name, items.description, items.end_date, items.creator_id, users.first_name AS first_name, users.last_name AS last_name
                    FROM bids
                    INNER JOIN items ON bids.item_id = items.item_id
                    INNER JOIN users ON items.creator_id = users.user_id
                    WHERE bids.user_id = ?
                    AND items.end_date >= datetime('now')
                `;
                db.all(endedSql, [id], (err, ended) => {
                    if (err) return done(err);
                    userProfile.auctions_ended = ended || [];

                    return done(null, userProfile);
                });
            });
        });
    });
};

// Authenication
const authenticateUser = (email, password, done) => {
    const sql = 'SELECT user_id, password, salt FROM users WHERE email = ?';

    db.get(sql, [email], (err, row) => {
        if (err) return done(err);    
        if (!row) return done({ code: 'EMAIL_NOT_FOUND', error_message: 'Email does not exist' });

        // Compare Password and Hash Value
        const salt = Buffer.from(row.salt, 'hex');
        const hashedPassword = getHash(password, salt);

        if (row.password === hashedPassword) {
            return done(null, row.user_id);
        } else {
            return done({ code: 'INVALID_PASSWORD', error_message: 'Incorrect password' });
        }

    });
}

// Set Session Token
const setToken = (id, done) => {
    let token = crypto.randomBytes(16).toString('hex');

    const sql = 'UPDATE users SET session_token = ? WHERE user_id = ?';

    db.run(sql, [token, id], (err) => {
        return done(err, token);
    });
}

// Get Session Token
const getToken = (id, done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id = ?';

    db.get(sql, [id], (err, token) => {
        return done(err, token);
    });
}

// Get User ID From Token
const getIdFromToken = (token, done) => {
    const sql = 'SELECT user_id FROM users WHERE session_token = ?';   
    db.get(sql, [token], (err, row) => {   
        if (err) return done(err);
        if (!row) return done({ code: 'TOKEN_NOT_FOUND', error_message: 'Token not found' });
        return done(null, row.user_id);
    });
}

// Remove Session Token
const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token = NULL WHERE session_token = ?';

    db.run(sql, [token], (err) => {
        return done(err);
    });
}

// Function Exports
module.exports = {
    addNewUser,
    retrieve,
    authenticateUser,
    setToken,
    getIdFromToken,
    getToken,
    removeToken
};