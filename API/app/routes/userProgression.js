module.exports = function(app, router, bodyParser, isAuth, isAdmin){

    var User = require('../models/user');

    router.route('/validateLesson')
	.post(bodyParser.urlencoded({extended: true}), 
	      bodyParser.json(),
	      function(req, res, next) {isAuth(req, res, next)}, 
	      function(req, res) {
		  User.update({'profile.email': req.decoded.profile.email}, { $pull: {
		      inProgressLessons: req.body.validatedLesson
		  }}, function(err, numberAffected, rawResponse) {
                      if (err)
                          res.json({ success: false, message: err });
		      User.update({'profile.email': req.decoded.profile.email}, { $push: {
			  validatedLessons: req.body.validatedLesson
		      }}, function(err, numberAffected, rawResponse) {
			  if (err)
			      res.json({ success: false, message: err });
			  res.json({ success: true, message: 'lesson validated !' });
		      });
		  });
	      });

    router.route('/inProgressLesson')
	.post(bodyParser.urlencoded({extended: true}), 
	      bodyParser.json(),
	      function(req, res, next) {isAuth(req, res, next)}, 
	      function(req, res) {
		  User.update({'profile.email': req.decoded.profile.email}, { $push: {
                      inProgressLessons: req.body.inProgressLesson
		  }}, function(err, numberAffected, rawResponse) {
                      if (err)
			  res.json({ success: false, message: err });
		      res.json({ success: true, message: 'lesson is in progress !' });
		  });
	      });

    router.route('/setBadge')
	.post(bodyParser.urlencoded({extended: true}),
              bodyParser.json(),
              function(req, res, next) {isAuth(req, res, next)},
	      function(req, res) {
		  User.update({'profile.email': req.decoded.profile.email}, { $push: {
                      badges: req.body.badge
                  }}, function(err, numberAffected, rawResponse) {
                      if (err)
                          res.json({ success: false, message: err });
                      res.json({ success: true, message: 'badge added !' });
                  });
	      });
    



    router.route('/validateSkill')
	.post(bodyParser.urlencoded({extended: true}), 
	      bodyParser.json(),
	      function(req, res, next) {isAuth(req, res, next)}, 
	      function(req, res) {
		  User.update({'profile.email': req.decoded.profile.email}, { $pull: {
		      inProgressSkills: req.body.validatedSkill
		  }}, function(err, numberAffected, rawResponse) {
                      if (err)
                          res.json({ success: false, message: err });
		      User.update({'profile.email': req.decoded.profile.email}, { $push: {
			  validatedSkills: req.body.validatedSkill
		      }}, function(err, numberAffected, rawResponse) {
			  if (err)
			      res.json({ success: false, message: err });
			  res.json({ success: true, message: 'skill validated !' });
		      });
		  });
	      });

    router.route('/inProgressSkill')
	.post(bodyParser.urlencoded({extended: true}), 
	      bodyParser.json(),
	      function(req, res, next) {isAuth(req, res, next)}, 
	      function(req, res) {
		  User.update({'profile.email': req.decoded.profile.email}, { $push: {
                      inProgressSkills: req.body.inProgressSkill
		  }}, function(err, numberAffected, rawResponse) {
                      if (err)
			  res.json({ success: false, message: err });
		      res.json({ success: true, message: 'skill is in progress !' });
		  });
	      });



}
