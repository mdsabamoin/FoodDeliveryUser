import React, { useState } from "react";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { signUp, login, resetPassword } from "../redux/authSlice"; // Import actions
import { useNavigate } from "react-router-dom";



const AuthForm = () => {
 
  const { loading, error,enter } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For confirming password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogin = async(e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login({ email, password }));
    } else {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      dispatch(signUp({ email, password }));
    }
  };
   if(enter){
    navigate("/categories");
   }
  

  const handlePasswordReset = () => {
    dispatch(resetPassword(email));
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "82vh" }}>
      <Card style={{ width: "350px", backgroundColor: "orange" }} className="p-4 shadow-sm">
        <h2 className="text-center">{isLogin ? "Log In" : "Sign Up"}</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Button variant="primary" type="submit" disabled={loading} block>
            {loading ? <Spinner animation="border" size="sm" /> : isLogin ? "Log In" : "Sign Up"}
          </Button>
        </Form>

        {isLogin && (
          <div className="d-flex justify-content-between mt-3">
            <Button variant="link" onClick={() => setShowForgotPassword(true)}>
              Forgot password?
            </Button>
            <Button variant="link" onClick={() => setIsLogin(false)}>
              Don't have an account? Sign Up
            </Button>
          </div>
        )}

        {!isLogin && !showForgotPassword && (
          <div className="d-flex justify-content-between mt-3">
            <Button variant="link" onClick={() => setIsLogin(true)}>
              Already have an account? Log In
            </Button>
          </div>
        )}

        {showForgotPassword && (
          <div className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Enter your email to reset the password</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" onClick={handlePasswordReset} disabled={loading} block>
              {loading ? <Spinner animation="border" size="sm" /> : "Send Reset Link"}
            </Button>
            <Button variant="link" onClick={() => setShowForgotPassword(false)} className="mt-2">
              Back to Login
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuthForm;
