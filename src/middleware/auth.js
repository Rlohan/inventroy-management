const jwt = require("jsonwebtoken");
const Account = require("../models/account");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")
    const decoded = jwt.verify(token, "thisisinventroyapp");
    const account = 
    await Account.findOne({
      _id: decoded._id,
      "tokens.token": token
    });
    if (!account) {
      throw new Error();
    }
    req.token = token;
    req.account = account;
    next();
  } catch (e) {
    res.status(401).send({
      error: {
        statusCode: 401,
        name: "Error",
        message: "Authorization Required",
        code: "AUTHORIZATION_REQUIRED"
      }
    });
  }
};

module.exports = auth;
