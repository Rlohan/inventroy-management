const express = require("express");
const path = require("path");
const cors = require("cors");
require("./db/mongoose.js");

const accountRouter = require("./routers/account");
const productRouter = require("./routers/product");
const app = express();

const corsOptions = {
  origin: function(origin, callback) {
    callback(null, true);
  }
};
const publicDirPath = path.join(__dirname, "../public");

app.use(cors(corsOptions));
app.use(express.static(publicDirPath));
app.use(express.json());
app.use("/api", accountRouter);
app.use("/api", productRouter);

module.exports = app;
