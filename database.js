const mongoose = require("mongoose");
const MONGODB_URI = "mongodb://localhost/pucsd"

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  }).catch(err => {
    console.log('Could not connect to MongoDB.');
    process.exit();
  });