import React, { Component } from "react";
import Footer from "./Footer";
import CheckoutModal from "./CheckoutModal";
import Product from "./Product";
import Spinner from "./Spinner";

export default class ProductList extends Component {
  state = {
    products: [],
    isModalOpen: false,
  };

  componentDidMount() {
    fetch(
      `https://johnnyjp2070.github.io/mobionics-shopping-cart/products.json`
    )
      .then((response) => response.json())
      .then((data) => {
        data.map((item) => (item.numberOfItems = 0));
        data.map((item) => (item.addedToCart = false));
        this.setState({ products: data });
      })
      .catch((err) => console.log(err));
  }

  addToCart = (id) => {
    const productCopy = [...this.state.products];
    const itemExists = productCopy.find((item) => {
      return item.id === id;
    });
    const index = productCopy.findIndex((item) => {
      return item.id === id;
    });
    if (itemExists) {
      productCopy[index].numberOfItems += 1;
      productCopy[index].addedToCart = true;
      this.setState({
        products: productCopy,
      });
    }
  };

  deleteFromCart = (id) => {
    const productCopy = [...this.state.products];
    const itemExists = productCopy.find((item) => {
      return item.id === id;
    });
    const index = productCopy.findIndex((item) => {
      return item.id === id;
    });
    if (itemExists) {
      productCopy[index].numberOfItems -= 1;
      if (productCopy[index].numberOfItems === 0) {
        productCopy[index].addedToCart = false;
      }
      this.setState({
        products: productCopy,
      });
    }
  };
  clearCart = () => {
    const productsCopy = this.state.products;
    // const cart = productsCopy.filter((product) => product.addedToCart === true);
    productsCopy.map((item) => (item.numberOfItems = 0));
    productsCopy.map((item) => (item.addedToCart = false));

    this.setState({
      products: productsCopy,
    });
  };

  handleCheckout = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  };

  render() {
    const products = this.state.products;
    const cart = products.filter((product) => product.addedToCart === true);

    let total = cart.reduce(function (prev, cur) {
      return parseInt(prev) + parseInt(cur.price) * cur.numberOfItems;
    }, 0);

    let totalItems = cart.reduce(function (prev, cur) {
      return parseInt(prev) + parseInt(cur.numberOfItems);
    }, 0);

    return (
      <div
        className={
          cart.length !== 0
            ? "d-flex justify-center align-center height-100 pb-100"
            : "d-flex justify-center align-center height-100"
        }
      >
        <div className='product-list'>
          <div className='container'>
            <div className='products-container bg-white'>
              <h2 className='text-center'>Product List</h2>
              {this.state.products.length === 0 ? (
                <Spinner></Spinner>
              ) : (
                <Product
                  products={products}
                  handleAdd={this.addToCart}
                  handleDelete={this.deleteFromCart}
                ></Product>
              )}
            </div>
          </div>
        </div>
        {cart.length !== 0 && (
          <Footer
            numberOfItems={totalItems}
            totalPrice={total}
            clearCart={this.clearCart}
            handleCheckout={this.handleCheckout}
          ></Footer>
        )}
        {this.state.isModalOpen && (
          <CheckoutModal
            handleCheckout={this.handleCheckout}
            cart={cart}
            totalPrice={total}
            numberOfItems={totalItems}
          ></CheckoutModal>
        )}
      </div>
    );
  }
}
