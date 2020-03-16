import React, { Component } from "react";
import { Route } from "react-router-dom";

import "./ProductList.css";
import CreateProduct from "../../components/CreateProduct/CreateProduct";
import axios from "../../axios-config";

class ProductList extends Component {
  state = {
    productList: [],
    product: {
      name: "",
      price: "",
      rating: ""
    }
  };
  componentDidMount() {
    this.getProductList();
  }
  getProductList = () => {
    const auth_token = JSON.parse(localStorage.getItem("access_token"));
    axios
      .get("/api/products", {
        headers: { Authorization: auth_token }
      })
      .then(response => {
        this.setProductList(response.data);
      })
      .catch(error => {
        this.props.setEnableButton(true);
      });
  };
  setSelected = (list) => {
    this.setProduct(list);
    this.props.changeState(false, true);
    this.props.history.push("/product-list/" + list._id);
    const listIndex = this.state.productList.findIndex(product => {
      return product._id === list._id;
    });
    this.state.productList.forEach((product, index) => {
      if (index === listIndex) {
        product.selected = true;
      } else {
        product.selected = false;
      }
    });
  };

  setProductList = productList => {
    productList.forEach(product => {
      product.selected = false;
    });
    this.setState({
      productList: productList
    });
  };

  setProduct = productDetails => {
    this.setState({
      product: { ...productDetails }
    });
  };
  render() {
    const productListBody = this.state.productList.map((list, index) => (
      <tbody
        key={index}
        style={
          list.selected
            ? { background: "#007bff", fontWeight: "bold", color: "white" }
            : { background: "" }
        }
        onClick={() => this.setSelected(list)}
      >
        <tr className="">
          <td>{list.name}</td>
          <td>$ {list.price}</td>
        </tr>
      </tbody>
    ));
    let reportTable = (
      <div className="">Nothing to show here. Create some products.</div>
    );
    let createProduct = (
      <div className="col-md-8">
        <CreateProduct
          {...this.props}
          {...this.state}
          setProductList={this.setProductList}
          setProduct={this.setProduct}
        />
      </div>
    );
    let createProductRouter = null;
    if (this.state.productList.length > 0) {
      createProduct = null;
      reportTable = (
        <table
          className="table table-hover table-bordered shadow p-3 mb-5 bg-white rounded"
          style={{ background: "white" }}
        >
          <thead></thead>
          {productListBody}
        </table>
      );

      createProductRouter = (
        <div className="col-md-8">
          <Route
            path="/product-list/:id"
            render={props1 => (
              <CreateProduct
                {...props1}
                setProductList={this.setProductList}
                {...this.state}
                setProduct={this.setProduct}
                editMode={this.props.editMode}
                enableButton={this.props.enableButton}
                changeState={this.props.changeState}
              />
            )}
          ></Route>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="p-3 col-md-4 ProductDetails">Products</div>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4 Border p-4">{reportTable}</div>
            {createProduct}
            {createProductRouter}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductList;
