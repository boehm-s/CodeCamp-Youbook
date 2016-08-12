module.exports = function(app, router, bodyParser, jwt, multer, fs, mkdirp, mime, isAuth, isAdmin){

    var storage = multer.diskStorage({
	destination: function (req, file, cb) {
            var newDestination = './uploads/'+req.body.category+'/'+req.body.lessonName;
            var stat = null;
            try {
		stat = fs.statSync(newDestination);
		cb(null, newDestination)
            } catch (err) { // mkdir -p (recursive)                                                                                                                                                                                  
		mkdirp(newDestination, function (err) {
                    if (err) console.error(err)
                    else
			cb(null, newDestination)
		});
            }
	},
	filename: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname);
	}
    })
    var upload = multer({ storage: storage });



    router.route('/storeFile')
	.post(
	    bodyParser.urlencoded({extended: true}),
	    bodyParser.json(),
	    upload.single('file'),
	    //	    function(req, res, next) {isAdmin(req, res, next)},
	    function(req, res) {
		res.json({success: true, message: 'test'});
	    });

    router.route('/getFile')
	.post(
	    bodyParser.urlencoded({extended: true}),
	    bodyParser.json(), function(req, res) {
		fs.readFile(__dirname+'/../../uploads/'+req.body.path, function(err,data) {
		    if (err)
			res.json({success: false, message: err});
		    res.setHeader('Content-Type', mime.lookup(__dirname+'/../../uploads/'+req.body.path));
		    res.send(data);
		});
	    });
}
