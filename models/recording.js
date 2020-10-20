
var db = require("../db");

var recordingSchema = db.Schema({
   zip:      {type: Number},
   airQuality:  {type: Number}
});


var Recording = db.model("Recording", recordingSchema);

module.exports = Recording;
