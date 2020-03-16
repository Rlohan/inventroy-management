const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("./product");

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password can\'t be "password"');
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

accountSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "owner"
});

accountSchema.statics.findByCredentials = async (username, password) => {
  const account = await Account.findOne({ username });
  if (!account) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, account.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return account;
};

accountSchema.methods.generateAuthToken = async function() {
  const account = this;
  const token = jwt.sign(
    { _id: account._id.toString() },
    "thisisinventroyapp",
    { expiresIn: "7 days" }
  );
  account.tokens = account.tokens.concat({ token });
  await account.save();
  return token;
};

accountSchema.methods.toJSON = function() {
  const account = this;
  const userObj = account.toObject();
  delete userObj.password;
  delete userObj.tokens;
  delete userObj.avatar;
  return userObj;
};

accountSchema.pre("save", async function(next) {
  const account = this;
  if (account.isModified("password")) {
    account.password = await bcrypt.hash(account.password, 8);
  }
  next();
});

accountSchema.pre("remove", async function(next) {
  const account = this;
  await Product.deleteMany({ owner: account._id });
  next();
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
