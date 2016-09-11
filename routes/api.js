var express = require('express');
var router = express.Router();
var mongoose= require('mongoose');
var Bar = mongoose.model('Bar');
var User = mongoose.model('User');
var async = require('async');


var Yelp = require('yelp');
var yelp = new Yelp({
		consumer_key: 'CuPJacICPCYVA8jIOlaADQ',
		consumer_secret: '6XmE8xL-mJTDufzYAXR6r2cVg_E',
		token: 'csvOaDboib7SHhVNVOFelMVV-RlRlMZj',
		token_secret: 'azV0P0IJWcoiUqxQ5RNit2CDQXE'
	});

var checkDb = function(bar,callback){
	var store = bar;
	Bar.findOne({yelpId : bar.id}, function(err, bar){
		if (err){
			return err;
		}
		if (bar){
			callback(null, bar);
			
		}
		else {
			var newBar = new Bar();
			newBar.going = [];
			newBar.name = store.name
			newBar.rating_img_url = store.rating_img_url;
			newBar.rating = store.rating;
			newBar.image_url = store.image_url;
			newBar.location = store.location.address[0];
			newBar.url = store.url;
			newBar.snippet_text = store.snippet_text;
			newBar.yelpId = store.id;
			newBar.save(function(err, bar){
		if(err){
			return err;
		}
		callback(null, bar);
	})
		}
	})

}


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
		var newData = []
		yelp.search({term: 'bar', location: req.params.location})
			.then(function(data){
				newData = data.businesses;
				async.map(newData,checkDb,function(err, data){
					if (err){
						res.send(err);
					}
					else {
						res.send(data);
					}
			})
			})
			.catch(function(err){
				console.log(err);
			});
	
	});

router.route('/bar/:id')
	.post(function(req,res){
		Bar.findById(req.params.id, function(err,bar){
			bar.going = req.body.going;
			console.log(req.body.going);
			bar.save(function(err,data){
				if (err){
					return res.send(err);
				}
				return res.send(data);
			})
		})
	});
router.route('/user/:location/:username')
	.post(function(req,res){
		User.findOne({username : req.params.username}, function(err, user){
			user.location = req.params.location;
			user.save(function(err, user){
				if (err){
					res.send(err);
				}
				else {
					res.send(user);
				}
			})
		})
	});


module.exports = router;