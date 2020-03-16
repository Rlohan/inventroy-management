import React, { useRef } from "react";
import "./CreateProduct.css";
import axios from "../../axios-config";

const CreateProduct = props => {
  const productNameRef = useRef();
  const ratingRef = useRef();
  const priceRef = useRef();

  const clearReportForm = () => {
    if (productNameRef.current && ratingRef.current && priceRef.current) {
      productNameRef.current.value = "";
      ratingRef.current.value = "";
      priceRef.current.value = "";
    }
  };

  const onChangeHandler = () => {
    const name = productNameRef.current.value;
    const rating = ratingRef.current.value;
    const price = priceRef.current.value;
    const productDetails = {
      name: name,
      rating: rating,
      price: price,
      _id: props.product._id
    };
    props.setProduct(productDetails);
  };
  const addProduct = e => {
    e.preventDefault();
    const auth_token = JSON.parse(localStorage.getItem("access_token"));
    const productList = [...props.productList];
    axios
      .post(
        "/api/products",
        {
          name: productNameRef.current.value,
          rating: ratingRef.current.value,
          price: priceRef.current.value
        },
        { headers: { Authorization: auth_token } }
      )
      .then(response => {
        productList.push(response.data);
        props.setProductList(productList);
        if (!props.match.params.id) {
          props.changeState(true, true);
          props.history.push("/product-list");
        }
        props.changeState(false, false);
        clearReportForm();
      })
      .catch(error => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.name === "price_required"
        ) {
          alert("Price is required.");
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.name === "name_required"
        ) {
          alert("Product name is required.");
        } else alert("Something went wrong. Please login again.");
      });
  };

  const saveProduct = e => {
    e.preventDefault();
    const productList = [...props.productList];
    const auth_token = JSON.parse(localStorage.getItem("access_token"));
    axios
      .patch(
        "/api/products/" + props.match.params.id,
        {
          name: productNameRef.current.value,
          rating: ratingRef.current.value,
          price: priceRef.current.value
        },
        { headers: { Authorization: auth_token } }
      )
      .then(response => {
        const data = response.data;
        const index = productList.findIndex(product => {
          return product._id === data._id;
        });

        productList[index] = { ...data };
        props.setProductList(productList);
        if (!props.match.params.id) {
          props.changeState(true, true);
          props.history.push("/product-list");
        }
        props.changeState(false, false);
        clearReportForm();
      })
      .catch(error => {
        if (error.response.status === 404) {
          alert(
            "Not able to update as this records doesn't exist in Database."
          );
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.name === "price_required"
        ) {
          alert("Price is required.");
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.name === "name_required"
        ) {
          alert("Product name is required.");
        } else alert("Something went wrong. Please login again.");
      });
  };
  const deleteProduct = e => {
    e.preventDefault();
    const productList = [...props.productList];
    const auth_token = JSON.parse(localStorage.getItem("access_token"));
    axios
      .delete("/api/products/" + props.match.params.id, {
        headers: { Authorization: auth_token }
      })
      .then(response => {
        const tempProductList = productList.filter(product => {
          return product._id !== response.data._id;
        });
        props.setProductList(tempProductList);
        if (!props.match.params.id) {
          props.changeState(true, true);
          props.history.push("/product-list");
        }
        if (tempProductList.length > 0) {
          props.changeState(false, false);
        }
        clearReportForm();
      })
      .catch(error => {
        alert("Something went wrong. Please login again.");
      });
  };

  let signInBtnStyle = {
    cursor: "not-allowed"
  };
  if (props.enableButton) {
    signInBtnStyle = {};
  }
  let productCount = null;
  if (!props.editMode && props.product._id) {
    productCount = (
      <div className="p-3 mb-5 offset-sm-2 col-sm-9 offset-md-1 col-md-10 row ProductCount">
        <div className="col-md-12 text-center">
          Product Count: {props.productList.length}
        </div>
      </div>
    );
  }
  return (
    <>
      <div>
        {productCount}
        <div className="p-3 offset-sm-2 col-sm-9 offset-md-1 col-md-10 row ProductDetails">
          <div className="col-md-4">
            {!props.editMode && props.product._id
              ? "Product Details"
              : "Create Product"}
          </div>
          <div className="col-md-7 col-sm-7 float-right offset-md-1 offset-sm-1 text-right">
            {!props.editMode && props.product._id
              ? `${props.product.name} (Product ID - ${props.product._id}
                )`
              : null}
          </div>
        </div>
        <form className="p-3 form-horizontal offset-sm-2 col-sm-9 offset-md-1 col-md-10 Border">
          <div className="form-group row">
            <label
              className="control-label col-sm-4 col-md-3"
              htmlFor="productName"
            >
              Product Name:
            </label>
            <div className="col-sm-8 col-md-9">
              <input
                ref={productNameRef}
                className="form-control"
                type="text"
                id="productName"
                name="productName"
                placeholder="Enter Product Name"
                onChange={onChangeHandler}
                value={props.product.name}
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              className="control-label col-sm-4 col-md-3"
              htmlFor="productPrice"
            >
              Price:
            </label>
            <div className="col-sm-8 col-md-9">
              <input
                ref={priceRef}
                className="form-control"
                type="number"
                id="productPrice"
                name="price"
                min="0"
                placeholder="Enter Price"
                onChange={onChangeHandler}
                value={props.product.price}
              />
            </div>
          </div>
          <div className="row">
            <label
              className="col-form-label col-sm-4 col-md-3"
              htmlFor="content"
            >
              Rating:
            </label>
            <div className="col-sm-8 col-md-9">
              <input
                ref={ratingRef}
                className="form-control"
                type="number"
                id="productRating"
                min="0"
                name="rating"
                placeholder="Enter Rating"
                onChange={onChangeHandler}
                value={props.product.rating}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="offset-md-3 col-md-9 offset-sm-4 col-sm-9">
              <div className="row">
                <div className="col-sm-7 col-md-2">
                  <button
                    className="btn btn-primary"
                    onClick={addProduct}
                    style={signInBtnStyle}
                    disabled={!props.enableButton}
                  >
                    Add
                  </button>
                </div>

                <div className="col-sm-7 col-md-2">
                  <button
                    className="btn btn-success"
                    onClick={saveProduct}
                    style={signInBtnStyle}
                    disabled={!props.enableButton}
                  >
                    Save
                  </button>
                </div>
                <div className="col-sm-7 col-md-3">
                  <button
                    className="btn btn-danger"
                    onClick={deleteProduct}
                    style={signInBtnStyle}
                    disabled={!props.enableButton}
                  >
                    Delete
                  </button>
                </div>
                <div className="col-sm-7 col-md-2">
                  <button
                    className="btn btn-warning"
                    onClick={() => props.history.push("/product-list")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default CreateProduct;
