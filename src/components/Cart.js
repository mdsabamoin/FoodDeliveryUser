import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Form , Image} from 'react-bootstrap';
import { removeFromCartAsync, clearCartAsync,fetchCartItemsAsync } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { addToCartAsync ,updateCartAsync} from '../redux/cartSlice';


const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
   
  useEffect(()=>{
    dispatch(fetchCartItemsAsync());
  },[dispatch])

  const handleRemove = (item) => {
    localStorage.setItem("cartitems",cartItems.length)
    dispatch(removeFromCartAsync({item}));
  };

  const increaseQuantity = (recipe) => {
        const isItemInCart = cartItems.some((cartItem) => cartItem.recipeName === recipe.recipeName); // Fixed property name
      
        if (isItemInCart) {
          dispatch(updateCartAsync({ recipe: { ...recipe, quantity: (recipe.quantity || 1) + 1 } })); 
        } 
      };

  const decreaseQuantity = (recipe) => {
        const isItemInCart = cartItems.some((cartItem) => cartItem.recipeName === recipe.recipeName); // Fixed property name
      
        if (isItemInCart && recipe.quantity > 1) {
          dispatch(updateCartAsync({ recipe: { ...recipe, quantity: (recipe.quantity || 1) - 1 } })); 
        } 
      };

  const handleCheckout = () => {
    navigate('/checkout');
  };
  console.log("CartItems in cart component",cartItems);
  return (
    <Container className="mt-4">
        <Button variant="secondary" onClick={() => navigate("/recipe")}>Go Back</Button>
      <h2 className="text-center mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <Row>
          {cartItems.map((item) => (
            <Col key={item.id} md={4}>
                <div style={{height:"93%"}}>
              <Card className="mb-4"  style={{height:"100%"}}>
                {/* <Card.Img variant="top" src={item.customImageUrl} /> */}
                <Image src={item.customImageUrl} width={355} height={200}/>
                <Card.Body>
                  <Card.Title>{item.recipeName}</Card.Title>
                  <Card.Text><strong>Price:</strong> {item.price}</Card.Text>
                  <Card.Text><strong>Quantity:</strong> <span>
                  <Button variant="secondary" style={{marginLeft:"2%",marginRight:"2%"}} onClick={() => increaseQuantity(item)}>+</Button>
                    </span>
                    {item.quantity}
                    <span>
                    <Button variant="secondary" style={{marginLeft:"2%"}} onClick={() => decreaseQuantity(item)}>-</Button>
                        </span></Card.Text>
                  <Button variant="danger" onClick={() => handleRemove(item)}>Remove</Button>
                </Card.Body>
              </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}
      <Button variant="primary" onClick={handleCheckout} style={{marginBottom:"2%"}}>Proceed to Checkout</Button>
    </Container>
  );
};

export default Cart;
