const db = require('../../database');

// Search For Items
const search = (searchQuery, limit, offset, done) => {
    const sql = `
        SELECT
            items.item_id,
            items.name,
            items.description,
            items.end_date,
            items.creator_id,
            users.first_name,
            users.last_name
        FROM items
        JOIN users ON items.creator_id = users.user_id
        WHERE LOWER(items.name) LIKE ?
        ORDER BY items.item_id ASC
        LIMIT ? OFFSET ?
    `;

    const query = `%${searchQuery.toLowerCase()}%`;

    db.all(sql, [query, limit, offset], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};


// Sell Items
const addNewItem = (item, done) => {

    const sql = 'INSERT INTO items (name, description, starting_bid, start_date, end_date, creator_id) VALUES (?,?,?,?,?,?)';

    const params = [
        item.name,
        item.description,
        item.starting_bid,
        item.start_date,
        item.end_date,
        item.creator_id                        
    ];

    db.run(sql, params, function (err) {

        if (err) return done(err);

        const results = {
            item_id: this.lastID,
            name: item.name,
            description: item.description,
            starting_bid: item.starting_bid,
            start_date: item.start_date,
            end_date: item.end_date,
            creator_id: item.creator_id
        }

        return done(null, results);
    })
}

// Function TO Bid On Individual Items
const bidItem = (bid, done) => {

    const timestamp = new Date().toISOString();

    const sqlItem = 'SELECT * FROM items WHERE item_id = ?';

    db.get(sqlItem, [bid.item_id], (err, row) => {

        if (err) return done(err);

        if (!row) {
            return done({ code: "ITEM_DOESNT_EXIST", error_message: 'Car does not exist' });
        }

        if (row.creator_id === bid.user_id) {
            return done({ code: "CANNOT_BID_OWN_ITEM", error_message: "Cannot bid on your own item" });
        }

        const sqlInsert = 'INSERT INTO bids (item_id, user_id, amount, timestamp) VALUES (?,?,?,?)';
        const params = [bid.item_id, bid.user_id, bid.amount, timestamp];

        db.run(sqlInsert, params, function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return done({ code: "BID_ALREADY_EXIST", error_message: 'Bid already exists' });
                }
                return done(err);
            }

            const result = {
                item_id: bid.item_id,
                user_id: bid.user_id,
                amount: bid.amount,
                timestamp: timestamp
            };

            return done(null, result);
        });
    });
};

// Retreieve Bid History Of User
const bidHistory = (item_id, user_id, done) => {
    const sql = `
        SELECT 
            items.creator_id,
            bids.item_id,
            bids.amount,
            bids.timestamp,
            users.user_id,
            users.first_name,
            users.last_name
        FROM items
        LEFT JOIN bids ON bids.item_id = items.item_id
        LEFT JOIN users ON users.user_id = bids.user_id
        WHERE items.item_id = ?
        ORDER BY bids.amount DESC
    `;

    db.all(sql, [item_id], (err, rows) => {
        if (err) return done(err);

        if (!rows || rows.length === 0) {
            return done({ code: "INVALID_AUCTION"});
        }

        const creator_id = rows[0].creator_id;

        if (creator_id === user_id) {
            return done({ code: "CANNOT_BID_OWN_ITEM" });
        }

        return done(null, rows);
    });
};

// Retrieve Item Information
const retrieveItem = (item_id, done) => {
    currentBidHolder = [];
    const sql = `
        SELECT 
            items.item_id,
            items.name,
            items.description,
            items.starting_bid,
            items.start_date,
            items.end_date,
            items.creator_id,
            creator.first_name AS creator_first_name,
            creator.last_name AS creator_last_name,
            bids.amount,
            bidder.user_id AS bidder_id,
            bidder.first_name AS bidder_first_name,
            bidder.last_name AS bidder_last_name
        FROM items
        INNER JOIN users AS creator ON creator.user_id = items.creator_id
        LEFT JOIN bids ON bids.item_id = items.item_id
        LEFT JOIN users AS bidder ON bidder.user_id = bids.user_id
        WHERE items.item_id = ?
        ORDER BY bids.amount DESC
        LIMIT 1
    `;

    db.get(sql, [item_id], (err, row) => {
        if (err) return done(err);

        if (!row) {
            return done({ code: "AUCTION_NOT_FOUND" });
        }

        const hasBid = row.amount !== null;

        const currentBidHolder = hasBid ? {
            user_id: row.bidder_id,
            first_name: row.bidder_first_name,
            last_name: row.bidder_last_name
        } : null;


        const result = {
            item_id: row.item_id,
            name: row.name,
            description: row.description,
            starting_bid: row.starting_bid,
            start_date: row.start_date,
            end_date: row.end_date,
            creator_id: row.creator_id,
            first_name: row.creator_first_name, 
            last_name: row.creator_last_name,     
            current_bid: hasBid ? row.amount : row.starting_bid,
            current_bid_holder: currentBidHolder
        };

        return done(null, result);
    });
};


const getAllItems = (done) => {
    const sql = `
        SELECT
            items.item_id,
            items.name,
            items.description,
            items.end_date,
            items.creator_id,
            users.first_name,
            users.last_name
        FROM items
        JOIN users ON items.creator_id = users.user_id
        ORDER BY items.item_id ASC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};

// 
const getBidsByUser = (userId, done) => {
    const sql = `
        SELECT item_id, user_id, amount, timestamp
        FROM bids
        WHERE user_id = ?
        ORDER BY timestamp DESC
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};

// Function Exports
module.exports = {
    search,
    addNewItem,
    bidItem,
    bidHistory,
    retrieveItem,
    getAllItems,
    getBidsByUser
}