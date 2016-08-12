module.exports = function(app, router, bodyParser){

    var Lesson = require('../models/lesson');

    router.route('/lessons')
	.get(bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res) {
	    Lesson.find(function(err, lessons) {
                if (err)
                    res.send(err);
                res.json({success: true, lessons: lessons});
            });
	})
	.post(bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res) {
	    console.log(req.body);
            var lesson = new Lesson();

	    lesson.title = req.body.title;
	    lesson.category = req.body.category;
	    lesson.QCM = req.body.QCM;
	    lesson.lessonViews = JSON.parse(req.body.lessonObj).views;

            lesson.save(function(err) {
		if (err) {
                    res.json({ success: false, message: err });
		}
                res.json({
                    success: true,
                    message: 'Lesson created !',
                });
            });
	});

    router.route('/lessons/:categ')
    .get(bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res) {
            Lesson.find({category: req.params.categ}, function(err, lessons) {
                if (err)
                    res.send(err);
		res.json({success: true, lessons: lessons});
	    });
    });

    router.route('/categories')
	.get(bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res) {
	    Lesson.find(function(err, lessons) {
                if (err)
                    res.send(err);
		var categ = [];
		for (var i = 0; i < lessons.length; i++) {
		    if (!categ.includes(lessons[i].category))
			categ.push(lessons[i].category)
		}
		res.json({success: true, categories: categ});
		});
	})
}
