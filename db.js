var mongoose = require("mongoose");

mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://localhost/labdb", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

module.exports = mongoose;
