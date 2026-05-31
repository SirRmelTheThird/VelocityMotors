const items = require('../model/core.server.model');
const Joi = require('joi');
const filter = require('leo-profanity');

const searchItem = (req, res) => {
    // Parameters
    const status = req.query.status;
    const query = (req.query.q || "").toLowerCase();
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const user_id = req.user_id; 

    // Valid Statues
    const validStatuses = ['OPEN', 'BID', 'ARCHIVE'];
    if (status && !validStatuses.includes(status)) return res.sendStatus(400);

    if ((status === 'OPEN' || status === 'BID' || status === 'ARCHIVE') && !user_id)
        return res.sendStatus(400);

    // Search Items Without Logging In
    if (!status) {
        return items.search(query, limit, offset, (err, rows) => {
            if (err) return res.sendStatus(500);

            let filtered = rows;

            if (query) {
                filtered = filtered.filter(item =>
                    (item.name || "").toLowerCase().includes(query)
                );
            }

            return res.status(200).json(
                filtered.map(item => ({
                    item_id: item.item_id,
                    name: item.name,
                    description: item.description,
                    end_date: item.end_date,
                    creator_id: item.creator_id,
                    first_name: item.first_name,
                    last_name: item.last_name
                }))
            );
        });
    }

    // Search through Items
    items.getAllItems((err, result) => {
        if (err) return res.sendStatus(500);

        let filtered = result || [];

        if (status === "OPEN") {
            filtered = filtered.filter(item =>
                new Date(item.end_date) > new Date() && item.creator_id === user_id
            );
        }

        if (status === "ARCHIVE") {
            filtered = filtered.filter(item =>
                new Date(item.end_date) < new Date()
            );
        }

        if (status === "BID") {
            return items.getBidsByUser(user_id, (err, userBids) => {
                if (err) return res.sendStatus(500);

                const bidItemIds = userBids.map(bid => bid.item_id);

                filtered = filtered.filter(item =>
                    bidItemIds.includes(item.item_id) &&
                    item.creator_id !== user_id
                );

                if (query) {
                    filtered = filtered.filter(item =>
                        (item.name || "").toLowerCase().includes(query)
                    );
                }

                return res.status(200).json(
                    filtered.slice(offset, offset + limit)
                );
            });
        }

        if (query) {
            filtered = filtered.filter(item =>
                (item.name || "").toLowerCase().includes(query)
            );
        }

        return res.status(200).json(
            filtered.slice(offset, offset + limit)
        );
    });
};

// Create New Item
const createItem = (req, res) => {
    const start_date = new Date();
    const currentDate = new Date();
    const creator_id = req.user_id;

    // Validation
    const itemSchema = Joi.object({
            name: Joi.string().trim().min(1).required(),
            description: Joi.string().trim().min(1).required(),
            starting_bid: Joi.number().min(1).required(),
            end_date: Joi.date().greater(currentDate).required()
        }).unknown(false);
    
        const { error } = itemSchema.validate(req.body);
    
        if (error) return res.status(400).json({error_message: error.details[0].message});

        // Profanity Filter
        const hasBadWords =
        filter.clean(req.body.name) !== req.body.name ||
        filter.clean(req.body.description) !== req.body.description;

        if (hasBadWords) return res.status(400).json({error_message: "Car name or description contains inappropriate language"});

        
        let item = Object.assign({}, {start_date}, { creator_id }, req.body);
    
        items.addNewItem(item, (err, result) => {
            if (err) return res.status(400).json({ error_message: 'Car already exists' });
            if (!result) return res.status(500).json({ error_message: 'Server error' });
            
        return res.status(201).json({item_id: result.item_id});
    });
}

// Get Single Item
const getItem = (req, res) => {
    let item_id =  parseInt(req.params.item_id);
    items.retrieveItem(item_id, (err, result) => {
        if (err) {
            if (err.code === 'AUCTION_NOT_FOUND') {
                return res.sendStatus(404);
            }
            return res.sendStatus(500);
        }
        return res.status(200).json(result);
    });
}

//  Bid On Searched Items
const bidOnItem = (req, res) => {
    const item_id = req.params.item_id;
    const user_id = req.user_id;

    const itemSchema = Joi.object({
        amount: Joi.number().min(3595).required()
    }).unknown(false);

    const { error } = itemSchema.validate(req.body);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    let bid = Object.assign({}, { item_id }, { user_id }, req.body);

    items.bidItem(bid, (err, result) => {
        if (err) {
            if (err.code === 'CANNOT_BID_OWN_ITEM') {
                return res.sendStatus(403);
            }
            if (err.code === 'ITEM_DOESNT_EXIST') {
                return res.sendStatus(404);
            }
            return res.sendStatus(500);
        }
        return res.sendStatus(201);
    });
};

// Users Bid History
const bidHistory = (req, res) => {
    const user_id = req.user_id;
    const item_id = req.params.item_id;

    items.bidHistory(item_id, user_id, (err, rows) => {
        if (err) {
            if (err.code === "INVALID_AUCTION"){ 
                return res.sendStatus(404);
            }
            if (err.code === "CANNOT_BID_OWN_ITEM") {
                return res.sendStatus(403);
            }
            return res.sendStatus(500);
        }

        const filtered = rows.filter(r => r.user_id !== null);

        const bids = filtered.map(r => ({
            item_id: r.item_id,
            amount: r.amount,
            timestamp: r.timestamp,
            user_id: r.user_id,
            first_name: r.first_name,
            last_name: r.last_name
        }));
        return res.status(200).json(bids);
    });
};

// Funtion Exports
module.exports = {
    searchItem,
    createItem,
    getItem,
    bidOnItem,
    bidHistory
}