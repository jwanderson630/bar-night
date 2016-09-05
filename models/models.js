var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	location: String,
	created_at: {type: Date, default: Date.now}
});

var barSchema = new mongoose.Schema({
	going: Array,
	photo: String,
	location: Array,
	url: String,
	text: String,
	yelpId: String
});

mongoose.model('User', userSchema);
mongoose.model('Bar', barSchema);