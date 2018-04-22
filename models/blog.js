var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
	name: {
		type: String,
		   required: [
		   function() { return this.name != null; },
		   "Blog name is required"
		   ]},
	image: String,
	description: {
		type: String,
		   required: [
		   function() { return this.description != null; },
		   "Blog post is required"
		   ]},
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	date: { type: Date, default: Date.now },
	update_date: { type: Date, default: Date.now },
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Blog", blogSchema);