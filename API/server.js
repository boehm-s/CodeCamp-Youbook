/*************************************** BASE SETUP ********************************************/	
 
var express    = require('express');
var app        = express();
var fs         = require('fs-extra');
var mkdirp     = require('mkdirp');
var morgan     = require('morgan');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var jwt        = require('jsonwebtoken');
var config     = require('./config');

var port       = process.env.PORT || 443;
var db         = mongoose.connect('mongodb://localhost:27017/Youbook');

var multer     = require('multer');
var gm         = require('gm');
var mime       = require('mime');

var busboy     = require('connect-busboy');
var Imagina    = require('imagina');
var glob       = require('glob');

app.set('superSecret', config.secret);

app.use(express.static(__dirname + '/'));
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, Authorization, enctype");
   
    next();
});



/*************************************** API ROUTES ********************************************/	

var router = express.Router();
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

var server     = app.listen(port);


require('./app/routes/file')(app, router, bodyParser, jwt, multer, fs, mkdirp, mime, isAuth, isAdmin);
//
// --- store a file (accessed at POST http://localhost:8080/api/storeFile/)
// --- get a file (accessed at POST http://localhost:8080/api/getFile/)



require('./app/routes/register')(app, router, bodyParser, jwt);
//
// --- create a user (accessed at POST http://localhost:8080/api/users/)

require('./app/routes/auth')(app, router, bodyParser, jwt);
//
// --- authenticate the user with email/passwd (accessed at POST http://localhost:8080/api/authenticate)


require('./app/routes/user')(app, router, bodyParser, multer, fs, mime, isAuth, isAdmin);
//
// --- get all the user (accessed at GET http://localhost:8080/api/users/)
// --- get the user with that username (accessed at GET http://localhost:8080/api/users/:username)
// --- update the user with that username (accessed at PUT http://localhost:8080/api/users/:user_id)
// --- delete the user with that username (accessed at DELETE http://localhost:8080/api/users/:user_id)


require('./app/routes/userProgression')(app, router, bodyParser, isAuth, isAdmin);
//


require('./app/routes/qcm')(app, router, bodyParser, isAuth);
//
// --- create a new QCM  (accessed at POST http://localhost:8080/api/qcm)
// --- get all  QCM  (accessed at GET http://localhost:8080/api/qcm)

require('./app/routes/lesson')(app, router, bodyParser, isAuth, isAdmin);
//
// --- create a new Lesson  (accessed at POST http://localhost:8080/api/lesson)
// --- get lessons with that category (accessed at GET http://localhost:8080/api/lesson/:category)
// --- get all categories (accessed at GET http://localhost:8080/api/categories)

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our Youbook api!' });
});
		     
// all of our routes will be prefixed with /api
app.use('/api', router);


/************************************ START THE SERVER *****************************************/

console.log('Server is listening to port ' + port);

/************************************* FUNCTIONS **********************************************/


function isAuth(req, res, next) {
    var token = (req.body !== undefined) ? req.body.token || req.query.token || req.headers['x-access-token'] : req.query.token || req.headers['x-access-token'];
    if (token) {
	jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
	    if (err) {
		return res.json({ success: false, message: 'Failed to authenticate token.' });    
	    } else {
		req.decoded = decoded;
		next();
	    }
	});
    } else {
	return res.status(403).send({ 
	    success: false, 
	    message: 'No token provided.' 
	}); 
    }
}

function isAdmin(req, res, next) {
    var token = (req.body !== undefined) ? req.body.token || req.query.token || req.headers['x-access-token'] : req.query.token || req.headers['x-access-token'];
    if (token) {
	jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
	    if (err) {
		return res.json({ success: false, message: 'Failed to authenticate token.' });    
	    } else {
		if (decoded.profile.admin === true)
		    next();
		else {
		    return res.status(403).send({ 
			success: false, 
			message: 'You are not admin ... '
		    }); 
		}
	    }
	});
    } else {
	return res.status(403).send({ 
	    success: false, 
	    message: 'No token provided.' 
	}); 
    }
}
