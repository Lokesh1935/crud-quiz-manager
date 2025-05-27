const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    topic: {
        type: String,
        required: true
    },

    question: {
        type: String,
        required: true
    },
    option1: {
        type: String,
        required: true
    },
    option2: {
        type: String,
        required: true
    },
    option3: {
        type: String,
        required: true
    },
    ans: {
        type: String,
        required: true
    },
}, {timestamps: true});

const Question = mongoose.model('question', questionSchema);
module.exports = Question;