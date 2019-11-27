import React from "react";
import axios from "axios";
import { Drawer } from "antd";
class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      searchString: "",
      items: [],
      cart: [],
      quantity: 0,
      total: 0,
      mobileSearch: false,
      nocart: false
    };

    this.handleChange = this.handleChange.bind(this);
  }
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  handleMobileSearch(e) {
    e.preventDefault();
    this.setState({
      mobileSearch: true
    });
  }
  handleSearchNav(e) {
    e.preventDefault();
    this.setState(
      {
        mobileSearch: false
      },
    
    );
   
      
      
  }
  addToCart = item => {
    var found = false;
    var updatedCart = this.state.cart.map(cartItem => {
      if (cartItem.name == item.name) {
        found = true;
        cartItem.quantity++;
        return cartItem;
      } else {
        return cartItem;
      }
    });

    if (!found) {
      updatedCart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      });
    }

    this.setState({
      cart: updatedCart,
      nocart: true
    });
    this.setState({
      quantity: this.state.quantity + 1
    });
    this.calculateTotal(item.price);
  };
  RemoveCart = item => {
    var found = false;
    var updatedCart = this.state.cart.map(cartItem => {
      if (cartItem.name == item.name) {
        found = true;
        cartItem.quantity--;
        return cartItem;
      } else {
        return cartItem;
      }
    });

    if (!found) {
      updatedCart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      });
    }

    this.setState({
      cart: updatedCart
    });
    this.setState({
      quantity: this.state.quantity - 1
    });
    this.calculateTotal(-item.price);
  };
  calculateTotal(price) {
    this.setState({
      total: this.state.total + price
    });
  }

  componentDidMount() {
    axios.get(`./story.json`).then(res => {
      const items = res.data;
      this.setState({ items });
    });
    this.refs.search.focus();
  }

  handleChange() {
    this.setState({
      searchString: this.refs.search.value
    });
  }

  onClearArray = () => {
    this.setState({ cart: [], total: 0, quantity: 0, nocart: false });
  };

  render() {
    let _users = this.state.items;

    let search = this.state.searchString.trim().toLowerCase();

    if (search.length > 0) {
      _users = _users.filter(function(user) {
        let name = user.name;
        return name.toLowerCase().match(search);
      });
    }

    return (
       <div className="container">
        <header style={{ position: "fixed" }}>
          <div className="container">
          <div className="brand">
          
              <h1 style={{ fontSize: "25px",fontStyle: "italic" ,color: "#075979"}}>FOOD COURT</h1>
          </div>

            <div className="search">
              <a
                className="mobile-search"
                href="#"
                onClick={this.handleMobileSearch.bind(this)}
              >
                <img
                  src="https://res.cloudinary.com/sivadass/image/upload/v1494756966/icons/search-green.png"
                  alt="search"
                />
              </a>
              <form
                action="#"
                method="get"
                className={
                  this.state.mobileSearch ? "search-form active" : "search-form"
                }
              >
                  <a
                className="back-button"
                href="#"
                onClick={this.handleSearchNav.bind(this)}
              >
                <img
                  src="https://res.cloudinary.com/sivadass/image/upload/v1494756030/icons/back.png"
                  alt="back"
                />
              </a>
                <input
                  type="search"
                  value={this.state.searchString}
                  ref="search"
                  placeholder="Search for Foods and  Snacks"
                  className="search-keyword"
                  onChange={this.handleChange}
                />
                <button className="search-button" type="submit" />
              </form>
            </div>

            <div className="cart">
              <button style={{ fontStyle: "italic" }} onClick={this.showDrawer}>
                {" "}
                Cart 🛒(<span class="total-count">{this.state.quantity}</span>)
              </button>
            </div>

            <Drawer
              title="Cart list"
              placement="right"
              closable={false}
              onClose={this.onClose}
              visible={this.state.visible}
              width={350}
            >
              {this.state.nocart ? (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Add</th>
                      <th>Remove</th>
                  
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.cart.map(item => {
                      return (
                        <tr>
                          <td>{item.name}</td>
                          <td> {item.price}</td>
                          <td> {item.quantity}</td>
                          <td>
                            {" "}
                            <button
                              type="button"
                              onClick={this.addToCart.bind(this, item)}
                            >
                              +
                            </button>
                          </td>
                          <td>
                            {" "}
                            <button
                              type="button"
                              onClick={this.RemoveCart.bind(this, item)}
                              disabled={item.quantity < 1}
                            >
                              -
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <h2>Total: {this.state.total}</h2>

                  <button type="button" onClick={this.onClearArray}>
                    Clear Cart
                  </button>
                </table>
              ) : (
                <h1 style={{fontStyle: "italic" ,color: "#075979"}}>your cart is empty</h1>
              )}
            </Drawer>
          </div>
        </header>

        <div
          className=" products-wrapper"
          style={{
            background:
              "linear-gradient(to bottom right,#20183F 40%,#5555ff 100%)"
          }}
        >
          <div
            transitionName="fadeIn"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
            component="div"
            className="products"
          >
            {_users.map(item => (
              <div >
                <div className="product">
                  <div className="product-image">
                    <img src={item.image} />
                  </div>
                  <p className="product-name">{item.name}</p>
                  <p className="product-price">{item.price}</p>

                  <div className="product-action">
                    <button
                      type="button"
                      onClick={this.addToCart.bind(this, item)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>{" "}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default Main;
