const items = require("../controller/core.server.controllers")
const auth = require("../lib/authentication")

// Core API Routes
module.exports = function(app){
    app.route("/search")
        .get(auth.authenticateOptional, items.searchItem);
    
    app.route("/item")
        .post(auth.isAuthenticated, items.createItem);

    app.route("/item/:item_id")
        .get(items.getItem);

    app.route("/item/:item_id/bid")
        .post(auth.isAuthenticated, items.bidOnItem);
        
    app.route("/item/:item_id/bid")
        .get(items.bidHistory);
}
