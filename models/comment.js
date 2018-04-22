var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema ({
	text: {
		type: String,
		   required: [
		   function() { return this.text != null; },
		   "Comment is required"
		   ]},
	date: { type: Date, default: Date.now },
	update_date: { type: Date, default: Date.now },
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Comment", commentSchema);