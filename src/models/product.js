const mongoose = require("mongoose");
autoIncrement = require("mongoose-auto-increment");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required:true
    },
    rating: {
      type: Number,
      default: 0
    },
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Account"
    }
  },
  {
    timestamps: true
  }
);

productSchema.plugin(autoIncrement.plugin, {
    model: 'Product',
    startAt: 1
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
