import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { useNavigate } from "react-router-dom";


const Header = () => {
  const dispatch = useDispatch();
  const enter = useSelector((state) => state.auth.enter);
  const cartItems = useSelector((state) => state.cart.items)
  const email = localStorage.getItem("email");
  const HandleLogout = () => {
    localStorage.removeItem("email");
    dispatch(logout());
  }


  localStorage.setItem("cartitems",cartItems.length);
  const cartItemlength = localStorage.getItem("cartitems");
  // if(!cartItemlength){
  //   cartItemlength=0;
  // }
  console.log("cartItems in Header", cartItems)

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>

        <Navbar.Brand href="/">FoodDiv</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {email && <Nav.Link href="/orders">
              <Button variant="success">Order Status</Button>
            </Nav.Link>}

            {email && <Nav.Link href="/cart">

              <Button variant="primary">
                Cart <Badge bg="secondary">{cartItemlength > 0? cartItemlength:0}</Badge>
              </Button>
            </Nav.Link>}

            {email && <Nav.Link href="/">
              <Button variant="primary" onClick={HandleLogout}>Log Out</Button>
            </Nav.Link>}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
