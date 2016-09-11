var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	location: String,
	created_at: {type: Date, default: Date.now}
});

var barSchema = new mongoose.Schema({
	name: String,
	going: Array,
	rating_img_url: String,
	rating: String,
	image_url: String,
	location: String,
	url: String,
	snippet_text: String,
	yelpId: String,
	createdAt: { type: Date, expires: 86400, default: Date.now }
});

mongoose.model('User', userSchema);
mongoose.model('Bar', barSchema);