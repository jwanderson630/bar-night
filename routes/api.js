var express = require('express');
var router = express.Router();

function isAuthenticated(req,res,next){
	if (req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	return res.redirect('/#login');
};

router.use('/bars', isAuthenticated);

router.route('/bars/:location')

	.get(function(req, res){
		req.send({message:"TODO return bars based on location given by user"});
	});


module.exports = router;