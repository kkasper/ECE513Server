var express = require('express');
var router = express.Router();
var Recording = require("../models/recording");

router.get("/status", function(req, res) {
  let zip_re = /^\d{5}$/gm;
  if((!req.query.hasOwnProperty("zip")) || (!(zip_re.test(req.query.zip)))) {
    let errormsg = {"error" : "a zip code is required."};
    res.status(400).send(JSON.stringify({ message: errormsg}));
    return;
  }

  Recording.find(req.query.zip, function(err, allRecordings) {
    if (err) {
      let errormsg = {"error" : "Zip does not exist in the database."};
      res.status(400).json(errormsg);
    }
    else {
      var sum = 0;
      var totalRecordNum = 0;
      for (let record of Records) {
        sum = sum + record.airQuality;
        totalRecordNum = totalRecordNum + 1;
      }
      var average = sum / totalRecordNum;
      average = average.toFixed(2);
    }
    res.status(200).json(average);
  });

});

router.post('/register', function(req, res, next) {

 // Ensure the request includes the deviceId parameter
  if( (!req.body.hasOwnProperty("zip")) || (!req.body.hasOwnProperty("airQuality"))) {
    let errormsg = {"error" : "zip and airQuality are required."};
    responseJson.message = errormsg;
    return res.status(400).json(responseJson);
  }

  let newRecord = new Recording({
    zip: req.body.zip,
    airQuality: req.body.airQuality,
  });

  // Save device. If successful, return success. If not, return error message.                          
  newRecord.save(function(err, newRecordData) {
    if (err) {
      responseJson.status = "ERROR";
      responseJson.message = "Error saving data in db.";
      return res.status(201).send(JSON.stringify(responseJson));
    }
    else {
      var msg = {"response" : "Data recorded."}
      return res.status(201).send(JSON.stringify(msg));
    }
  });

});

module.exports = router;
