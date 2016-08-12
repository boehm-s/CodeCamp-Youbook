module.exports = function(app, router, bodyParser, multer, fs, mime, isAuth, isAdmin){

    var User = require('../models/user');


    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var newDestination = __dirname+'/../../uploads/img-users';
            cb(null, newDestination)
        },
        filename: function (req, file, cb) {
            console.log(file);
	    var fileName = req.decoded.profile.email + '.' + file.originalname.split('.')[1];
            cb(null, fileName);
        }
    })
    var upload = multer({ storage: storage });

    router.route('/storeUserImg') // img-user
	.post(function(req, res, next) {isAuth(req, res, next)},
	      upload.single('avatar'),
	      function(req, res) {
		  res.json({success: true, message: "ho ho ho user image saved !"});
	      });


    router.route('/getUserImg')
	.get(function(req, res, next) {isAuth(req, res, next)},
              bodyParser.urlencoded({extended: true}),
              bodyParser.json(), function(req, res) {
		  res.setHeader('Content-Type', mime.lookup(__dirname+'/../../uploads/img-users/'+req.decoded.profile.email+'.jpg'));
		  fs.readFile(__dirname+'/../../uploads/img-users/'+req.decoded.profile.email+'.jpg', function(err,data) {
                      if (err)
                          res.json({success: false, message: err});
                      res.send(data);
                  });
	     });
    
    router.route('/users')
	.get(function(req, res, next) {isAuth(req, res, next)}, 
	     function(req, res) {
		 User.find(function(err, users) {
		     if (err)
			 res.send(err);
		     res.json({success: true, users: users});
		 });
	     });

    
    router.route('/users/:email')
        .get(bodyParser.urlencoded({extended: true}), 
	     bodyParser.json(), 
	     function(req, res, next) {isAuth(req, res, next)}, 
	     function(req, res) {
		 User.findOne({'profile.email':req.params.email}, function(err, user) {
		     if (err)
			 res.send(err);
		     res.json({success: true, user: user});
		 });
	     })
    	.put(bodyParser.urlencoded({extended: true}), 
	     bodyParser.json(), 
	     function(req, res) {
		 if (req.params.email === req.decoded.profile.email) {
		     User.findOne({'profile.email':req.params.email}, function(err, user) {
			 if (err)
			     res.send(err);
			 user.email = req.body.email;
			 
			 user.setPassword(req.body.password);
			 user.save(function(err) {
			     if (err)
				 res.send(err);
			     res.json({ success: true, message: 'User updated!' });
			 });
		     });
		 } else {
		     res.json({success: false, message: "You can't upadte an user who isn't You !"});
		 }
	     })
        .delete(bodyParser.urlencoded({extended: true}), 
		bodyParser.json(),
		function(req, res, next) {isAdmin(req, res, next)}, 
		function(req, res) {
		    User.remove({'profile.email': req.params.email}, function(err, user) {
			if (err)
			    res.send(err);
			res.json({ message: 'Successfully deleted' });
		    });
		});

}
