const mongoose = require("mongoose");
autoIncrement = require("mongoose-auto-increment");

mongoose.connect(
  "mongodb+srv://superuser:inventorysuperuser@cluster0-nakks.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

var db = mongoose.connection;
autoIncrement.initialize(db);

db.on("error", e => {
  console.log("DB connection error:", e);
});

db.once("open", function() {
  console.log("DB connection successful!");
});
