const db = require("../database");

console.log("****************************************");
console.log("Deleting data...");

setTimeout(() => {
    db.serialize(() => {
        db.run("DELETE FROM questions", [], function (err) {
            if (err) throw err;
            console.log("Questions: All data deleted");
        });

        db.run("DELETE FROM bids", [], function (err) {
            if (err) throw err;
            console.log("Bids: All data deleted");
        });

        db.run("DELETE FROM items", [], function (err) {
            if (err) throw err;
            console.log("Items: All data deleted");
        });

        db.run("DELETE FROM users", [], function (err) {
            if (err) throw err;
            console.log("Users: All data deleted");
        });

        db.run("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'users'", [], function (err) {
            if (err) throw err;
            console.log("Users: reset ID counter");
        });

        db.run("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'items'", [], function (err) {
            if (err) throw err;
            console.log("Items: reset ID counter");
        });

        db.run("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'questions'", [], function (err) {
            if (err) throw err;
            console.log("Questions: reset ID counter");
        });

        console.log("All data deleted from all tables");
        console.log("****************************************");
    });
}, 1000);