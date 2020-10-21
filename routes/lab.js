var express = require('express');
var router = express.Router();
var Recording = require("../models/recording");

router.get("/status", function(req, res) {
  let zip_re = /^\d{5}$/m;
  let average = 0;
  
  if((!req.query.hasOwnProperty("zip")) || (!(zip_re.test(req.query.zip)))) {
    let errormsg = {"error" : "a zip code is required."};
    res.status(400).send(JSON.stringify({ message: errormsg}));
    return;
  }

  Recording.find({zip: req.query.zip}, function(err, allRecordings) {
    console.dir(allRecordings);
    if (err || !allRecordings.length) {
      let errormsg = {"error" : "Zip does not exist in the database."};
      return res.status(400).send(errormsg);
    }
    else {
      var sum = 0;
      var totalRecordNum = 0;
      for (let record of allRecordings) {
        sum = sum + record.airQuality;
        totalRecordNum = totalRecordNum + 1;
      }
      var averageQuality = sum / totalRecordNum;
      console.log("Average Quality: " + averageQuality);
    }
  
  average = averageQuality.toFixed(2); 
  console.log("Average: " + average);
  return res.status(200).send(average);
  });

});

router.post('/register', function(req, res, next) {
  let zip_re = /\d{5}/m;

  if( (!req.body.hasOwnProperty("zip")) || (!req.body.hasOwnProperty("airQuality")) || (!(zip_re.test(req.body.zip*1)))) {
    let errormsg = {"error" : "zip and airQuality are required."};
    return res.status(400).send(JSON.stringify(errormsg));
  }

  let newRecord = new Recording({
    zip: req.body.zip,
    airQuality: req.body.airQuality,
  });

  // Save device. If successful, return success. If not, return error message.                          
  newRecord.save(function(err, newRecordData) {
    if (err) {
      let errormsg = "Error saving data in db.";
      return res.status(201).send(JSON.stringify(errormsg));
    }
    else {
      var msg = {"response" : "Data recorded."}
      return res.status(201).send(JSON.stringify(msg));
    }
  });

});

module.exports = router;
