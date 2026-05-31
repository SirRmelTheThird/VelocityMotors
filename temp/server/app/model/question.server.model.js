const db = require('../../database');

// Retrieve Questions
const retrieveQuestion = (item_id, done) => {
    db.get('SELECT item_id FROM items WHERE item_id = ?', [item_id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(null, null); 

        const sql = `
            SELECT question_id, question, answer, asked_by
            FROM questions
            WHERE item_id = ?
            ORDER BY question_id DESC
        `;

        db.all(sql, [item_id], (err, rows) => {
            if (err) return done(err);
            return done(null, rows);  
        });
    });
};

// Add New Question
const addNewQuestion = (question, done) => {
    const checkSellerSql = 'SELECT creator_id FROM items WHERE item_id = ?';

    db.get(checkSellerSql, [question.item_id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(null, null);

        if (question.asked_by === row.creator_id) {
            return done({
                code: "IS_SELLER",
                error_message: "Sellers cannot ask questions on their own items"
            });
        }

        const sql = `
            INSERT INTO questions (question, asked_by, item_id)
            VALUES (?, ?, ?)
        `;

        db.run(sql, [question.question, question.asked_by, question.item_id], function (err) {
            if (err) return done(err);

            return done(null, {
                question_id: this.lastID,
                question: question.question,
                asked_by: question.asked_by,
                item_id: question.item_id
            });
        });
    });
};

// Seller Adds Answer to Items
const addAnswer = (question, done) => {

    const sql = `
        SELECT items.creator_id
        FROM questions
        JOIN items ON questions.item_id = items.item_id
        WHERE questions.question_id = ?
    `;

    db.get(sql, [question.question_id], (err, row) => {
        if (err) return done(err);

        if (!row) return done(null, null);

        if (row.creator_id !== question.answered_by) {
            return done({ code: "NOT_SELLER", error_message: "Only the seller can answer this question" });
        }
        
        const sql = 'UPDATE questions SET answer = ? WHERE question_id = ?';

        db.run(sql, [question.answer, question.question_id], function(err) {
            if (err) return done(err);

            return done(null, {
                question_id: question.question_id,
                answer: question.answer
            });
        })
    })
}

// Function Exports
module.exports = {
    retrieveQuestion,
    addNewQuestion,
    addAnswer
};