module.exports = function(app, router, bodyParser){

    var QCM = require('../models/qcm');

    router.route('/qcm')
	.get(bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res) {
	    QCM.find(function(err, qcms) {
                if (err)
                    res.send(err);
                res.json({success: true, qcms: qcms});
            });
	})
	.post(bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res) {
	    console.log(req.body);
            var qcm = new QCM();
	    var reqQcm = JSON.parse(req.body.qcm);
	    qcm.name = reqQcm.name;
	    qcm.category = reqQcm.category;
	    qcm.QCM =  reqQcm.QCM;

            qcm.save(function(err) {
		if (err) {
                    res.json({ success: false, message: err });
		}
                res.json({
                    success: true,
                    message: 'QCM created !',
                });
            });
	});
}
