// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchRecipesByCategory } from '../redux/recipesSlice';
// import { Card, Row, Col, Container, Spinner } from 'react-bootstrap';
// import { useNavigate, useParams } from 'react-router-dom';

// const Recipes = () => {
//   const { categoryName } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { items, status } = useSelector((state) => state.recipes);

//   // useEffect(() => {
//   //   dispatch(fetchRecipesByCategory(categoryName));
//   // }, [dispatch, categoryName]);

//   if (status === 'loading') return <Spinner animation="border" />;

//   return (
//     <Container className="mt-4">
//       <Row>
//         {items.map((recipe) => (
//           <Col key={recipe.id} md={4} className="mb-3">
//             <Card onClick={() => navigate(`/recipe/${recipe.id}`)} className="cursor-pointer shadow">
//               <Card.Img variant="top" src={recipe.image} />
//               <Card.Body>
//                 <Card.Title>{recipe.name}</Card.Title>
//                 <Card.Text>${recipe.price}</Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default Recipes;
