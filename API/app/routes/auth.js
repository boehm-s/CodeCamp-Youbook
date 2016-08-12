module.exports = function(app, router, bodyParser, jwt){
    var User = require('../models/user');

    router.post('/authenticate', bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res) {
	console.log(req.decoded);
	User.findOne({
            $or:[ {'profile.username': req.body.username}, {'profile.email': req.body.username}]   // username can be email too
	}, function(err, user) {
            if (err) {
		res.json({ success: false, message: err });
            }
            else if (!user) {
		res.json({ success: false, message: 'Authentication failed. User not found...' });
            }
            else if (user) {
		if (!user.isValidPassword(req.body.password)) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
		}
		else {
		    var token = jwt.sign(user, app.get('superSecret'), {
			expiresInMinutes: 86400 // expires in a very long time
		    });

		    res.json({
			success: true,
			message: 'Enjoy your token!',
			token: token
		    });
		}
            }
	});
    });
}
