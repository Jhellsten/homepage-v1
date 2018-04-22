var mongoose = require("mongoose");

var loggingSchema = new mongoose.Schema({
    type: String,
    date: { type: Date, default: Date.now },
    description: String,
});

var LogModel = mongoose.model("Logging", loggingSchema);

module.exports = {};

module.exports.log = function(type, description) {
    console.log("Logging: type=", type, "desc=", description);
    var event = new LogModel({type: type, description: description});
    event.save(function (err) {
        if (err) { console.log("Ei logita.."); }
    });
};

module.exports.error = function(err) {
    module.exports.log("error", err.message);
};
