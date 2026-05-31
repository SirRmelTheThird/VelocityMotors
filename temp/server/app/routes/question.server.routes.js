const questions = require("../controller/question.server.controllers")
const auth = require("../lib/authentication")

// Question API Routes
module.exports = function(app){
    app.route("/item/:item_id/question")
        .get(questions.getQuestion);
        
    app.route("/item/:item_id/question")
        .post(auth.isAuthenticated, questions.askQuestion);

    app.route("/question/:question_id")
        .post(auth.isAuthenticated, questions.answerQuestion);
}