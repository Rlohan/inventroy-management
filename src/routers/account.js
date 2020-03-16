const express = require("express");
const Account = require("../models/account");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/accounts", async (req, res) => {
  const account = new Account(req.body);
  try {
    const token = await account.generateAuthToken();
    await account.save();
    res.status(201).send({ token, account });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).send({
        statusCode: 11000,
        name: "Error",
        message: "email id already exists",
        code: "duplicate_email_id"
      });
    }
  }
});

router.post("/accounts/login", async (req, res) => {
  try {
    const account = await Account.findByCredentials(
      req.body.username,
      req.body.password
    );

    res.send({
      token: account.tokens[0].token,
      account
    });
  } catch (e) {
    res.status(400).send({
      statusCode: 400,
      name: "Error",
      message: "login credentials are invalid",
      code: "credentials_invalid"
    });
  }
});

router.post("/accounts/logout", auth, async (req, res) => {
  try {
    req.account.tokens = req.account.tokens.filter(token => {
      return token.token !== req.token;
    });
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
