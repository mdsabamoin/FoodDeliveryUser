import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button, Form, Image } from "react-bootstrap";
import { clearCartAsync, fetchCartItemsAsync } from "../redux/cartSlice";
import { addToOrdersAsync } from "../redux/orderSlice";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const orderStatus = useSelector((state) => state.orders.status);

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch cart items only if the cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      dispatch(fetchCartItemsAsync());
    }
  }, [dispatch, cartItems.length]);

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!address.trim() || !name.trim()) {
      alert("Please enter all details.");
      return;
    }

    // Dispatch order action and wait for completion
    const resultAction = await dispatch(
      addToOrdersAsync({
        customerName: name,
        items: cartItems,
        status: "pending",
        address: address,
        paymentMethod: "Cash on Delivery",
      })
    );

    if (addToOrdersAsync.fulfilled.match(resultAction)) {
      setOrderPlaced(true);
    }
  };

  // Clear cart after order is successfully placed
  useEffect(() => {
    if (orderPlaced) {
      dispatch(clearCartAsync());
    }
  }, [orderPlaced, dispatch]);

  // Update localStorage only when cart changes
  useEffect(() => {
    localStorage.setItem("cartitems", cartItems.length);
  }, [cartItems.length]);

  return (
    <Container className="mt-4">
      <Button variant="secondary" onClick={() => navigate("/cart")}>
        Go Back to Cart
      </Button>
      <h2 className="text-center mb-4">Checkout</h2>

      {orderPlaced ? (
        <div className="text-center">
          <h4>Your order has been placed successfully!</h4>
          <p>It will be delivered to: {address}</p>
          <Button
            variant="success"
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                navigate("/categories");
              }, 100); // Short delay for better UX
            }}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Go to Home"}
          </Button>
        </div>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <h4>Delivery Address</h4>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
              <br />
              <h5>Enter Your Name</h5>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <h4>Order Summary</h4>
              {cartItems.length === 0 ? (
                <p>Your cart is empty!</p>
              ) : (
                cartItems.map((item) => (
                  <Card key={item.id} className="mb-2 p-2">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title>{item.recipeName}</Card.Title>
                        <Card.Text>Quantity: {item.quantity}</Card.Text>
                        <Card.Text>Price: ₹{item.price * item.quantity}</Card.Text>
                      </div>
                      <Image src={item.customImageUrl} width={100} height={100} className="ms-3" />
                    </Card.Body>
                  </Card>
                ))
              )}
              <h5>
                Total: ₹{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
              </h5>
            </Col>
          </Row>
          <Button variant="primary" className="mt-3" onClick={handlePlaceOrder} disabled={cartItems.length === 0}>
            Place Order (Cash on Delivery)
          </Button>
        </>
      )}
    </Container>
  );
};

export default Checkout;
