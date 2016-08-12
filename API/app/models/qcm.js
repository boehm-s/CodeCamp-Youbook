// app/models/user.js

var mongoose          = require('mongoose');
var Schema            = mongoose.Schema;
var ObjectId          = Schema.ObjectId;



var QuestionSchema = new Schema({
    question: {
	type: String,
	required: true
    },
    propositions: [{
	type: String
    }],
    answer: {
	type: Number,
	required: true
    }
});

var QCMSchema = new Schema({
    name: {
	type: String,
	required: true
    },
    category: {
	type: String,
	required: true
    },
    QCM: [QuestionSchema],
    scoreToReach: Number,
    badgeEarned: String
});

module.exports = mongoose.model('QCM', QCMSchema);
