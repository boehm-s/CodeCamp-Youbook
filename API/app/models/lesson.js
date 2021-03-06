// app/models/lesson.js

var mongoose          = require('mongoose');
var Schema            = mongoose.Schema;
var ObjectId          = Schema.ObjectId;



var LessonView = new Schema({
    viewTitle: String,
    file:  String,
    fileType: String,
    additionalText:  String,
    videoUrl: String
});

var LessonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
	type: String,
	required: true
    },
    QCM: String,
    lessonViews : [LessonView]
});

module.exports = mongoose.model('Lesson', LessonSchema);
