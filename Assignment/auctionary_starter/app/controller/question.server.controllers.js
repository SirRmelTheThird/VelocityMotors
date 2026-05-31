const questions = require('../model/question.server.model');
const Joi = require('joi');
const filter = require('leo-profanity');

const getQuestion = (req, res) => {
    const item_id = parseInt(req.params.item_id);

    questions.retrieveQuestion(item_id, (err, results) => {
        if (err) return res.sendStatus(500);

        if (results == null) {
            return res.sendStatus(404);
        }

        if (results.length === 0) { 
            return res.status(200).json([]); 
        }

        return res.status(200).json(
            results.map(user => ({
                question_id: user.question_id,
                question_text: user.question,
                answer_text: user.answer
            }))
        );
    });
};

// Ask Question ON Selling Items
const askQuestion = (req, res) => {
    const item_id =  parseInt(req.params.item_id);
    const user_id = parseInt(req.user_id);

    // Validation
    const askedQuestionSchema = Joi.object({
            question_text: Joi.string().trim().min(1).required(),
        }).unknown(false);

    const { error } = askedQuestionSchema.validate(req.body);

    if (error) return res.status(400).json({error_message: error.details[0].message});
    
    // Cleaned Question
    const askedQuestion = {
        item_id,
        question: filter.clean(req.body.question_text),
        asked_by: user_id            
    };


    questions.addNewQuestion(askedQuestion, (err, result) => {
        if (err) {
            if (err.code === 'IS_SELLER') {
                return res.sendStatus(403);
            }
            return res.sendStatus(500);
        }
        if (!result) return res.sendStatus(404);
        return res.status(200).json(result);
    });
}

// Creator Answers Users Questions
const answerQuestion = (req, res) => {
    let question_id =  parseInt(req.params.question_id);
    const user_id = parseInt(req.user_id);

    // Validation
    const answerQuestionSchema = Joi.object({
            answer_text: Joi.string().trim().min(1).required(),
        }).unknown(false);

    const { error } = answerQuestionSchema.validate(req.body);

    if (error) return res.status(400).json({error_message: error.details[0].message});
    
    // Cleaned Answers
    const answer = {
        question_id,
        answer: filter.clean(req.body.answer_text),
        answered_by: user_id 
    };

    questions.addAnswer(answer, (err, result) => {
        if (err) {
            if (err.code === 'NOT_SELLER') {
                return res.sendStatus(403);
            }
            return res.sendStatus(500);
        }
        if (!result) return res.sendStatus(404);
        return res.status(200).json(result);
    });
}

// Function Exports
module.exports = {
    getQuestion: getQuestion,
    askQuestion: askQuestion,
    answerQuestion: answerQuestion
}