module.exports = function(app, router, bodyParser, jwt){

    var User = require('../models/user');

    router.route('/users')
	.post(bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res) {
	    console.log(req.body);
            var user = new User();
            user.profile.email = req.body.email;
            user.profile.firstName = req.body.firstName;
            user.profile.lastName = req.body.lastName;
            user.profile.username = req.body.username;
	    user.profile.sellerId = req.body.sellerId;
            user.setPassword(req.body.password);
	    
            user.save(function(err) {
		if (err) {
                    console.log(err);
                    res.json({ success: false, message: 'email invalide' });
		}
		var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 86400 // expires in 60 days                                                                                                                                                                 
                });
                res.json({
                    success: true,
                    message: 'User created ! Enjoy your token!',
                    token: token
                });
            });
	});
}
