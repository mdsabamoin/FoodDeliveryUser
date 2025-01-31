import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, Spinner, Row, Col, Button, Image } from 'react-bootstrap';
import { fetchRecipesByCategory } from '../redux/recipesSlice';
import { addToCartAsync ,updateCartAsync} from '../redux/cartSlice';  // Import addToCart action
import { useNavigate } from 'react-router-dom';

const RecipeDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.recipes);
  const cartItems = useSelector((state)=> state.cart.items)
   
   const categoryName = localStorage.getItem("categoryName");
   

  useEffect(() => {
    if (categoryName) {
      dispatch(fetchRecipesByCategory({ categoryName }));
    }
  }, [dispatch]);

  if (status === 'loading') return <Spinner animation="border" />;
  if (status === 'failed') return <p>Failed to fetch recipes.</p>;


    console.log("cartItems in Recipedetails component",  cartItems);


    const handleAddToCart = (recipe) => {
       
      const isItemInCart = cartItems.some((cartItem) => cartItem.recipeName === recipe.recipeName); // Fixed property name
    
      if (!isItemInCart) {
        dispatch(addToCartAsync({ recipe: { ...recipe, quantity: 1 } })); 
        // localStorage.setItem("cartitems",cartItems.length);
      } 
    };
    

  return (
    <Container className="mt-4">
      <Button variant="secondary" onClick={() => navigate("/categories")}>Go Back</Button>
      <h2 className="text-center mb-4">Recipe Details</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {items.length > 0 ? (
          items.map((recipe) => (
            <Col key={recipe.id}>
              <Card className="shadow-sm" style={{height:"100%"}}>
                {/* <Card.Img
                  variant="top"
                  src={recipe.customImageUrl}
                  alt={recipe.recipeName}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                /> */}
                <Image  src={recipe.customImageUrl}  alt={recipe.recipeName} width={260}
                  height={200}/>
                <Card.Body>
                  <Card.Title className="text-truncate" style={{ maxWidth: '200px' }}>
                    {recipe.recipeName}
                  </Card.Title>
                  <Card.Text><strong>Price:</strong> {recipe.price}</Card.Text>
                  <Card.Text><strong>Ingredients:</strong> {recipe.ingredients}</Card.Text>
                  <Card.Text><strong>Category:</strong> {recipe.selectedCategory}</Card.Text>
                  <Button variant="primary" onClick={() => handleAddToCart(recipe)}>Add to Cart</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No recipes found for this category.</p>
        )}
      </Row>
    </Container>
  );
};

export default RecipeDetails;
