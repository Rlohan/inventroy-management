const express = require("express");
const Product = require("../models/product");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/products", auth, async (req, res) => {
  const product = new Product({
    ...req.body,
    owner: req.account._id
  });
  try {
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    let errorObj = {};
    if (e.errors.price) {
      errorObj.statusCode = 400;
      errorObj.name = "price_required";
      errorObj.message = "Product price is required.";
    } else if (e.errors.name) {
      errorObj.statusCode = 400;
      errorObj.name = "name_required";
      errorObj.message = "Product name is required.";
    }
    res.status(400).send(errorObj);
  }
});

router.get("/products", auth, async (req, res) => {
  try {
    await req.account
      .populate({
        path: "products"
      })
      .execPopulate();
    res.send(req.account.products);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/products/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findOne({ _id, owner: req.account._id });
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/products/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.account._id
    });
    if (!product) {
      return res.status(404).send();
    }
    updates.forEach(update => (product[update] = req.body[update]));
    await product.save();
    res.send(product);
  } catch (error) {
    let errorObj = {};
    if (error.errors.price) {
      errorObj.statusCode = 400;
      errorObj.name = "price_required";
      errorObj.message = "Product price is required.";
    } else if (error.errors.name) {
      errorObj.statusCode = 400;
      errorObj.name = "name_required";
      errorObj.message = "Product name is required.";
    }
    res.status(400).send(errorObj);
  }
});

router.delete("/products/:id", auth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.account._id
    });
    if (!product) {
      res.status(404).send();
    }
    await product.remove();
    res.send(product);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
