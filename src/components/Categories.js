import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../redux/categoriesSlice';
import { Card, Row, Col, Container, Spinner ,Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {setReceipeName} from "../redux/recipesSlice";
import { fetchRecipesByCategory } from '../redux/recipesSlice';


const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.categories);

  useEffect(() => {
    if(items.length === 0){
      dispatch(fetchCategories());
    }
    
  }, [dispatch]);

  if (status === 'loading') return <Spinner animation="border" />;
    
   const HandleReceipe = (categoryName)=>{
    dispatch(setReceipeName({categoryName}));
    dispatch(fetchRecipesByCategory({ categoryName }));
    localStorage.setItem("categoryName",categoryName);
    navigate(`/recipe`);
   }


  return (
    <Container className="mt-4">
      <Row>
        {items.map((category) => (
          <Col key={category.id} md={4} className="mb-3">
            <Card onClick={() => HandleReceipe(category.categoryName)} className="cursor-pointer shadow">
              {/* <Card.Img variant="top"  /> */}
              <Image  src={category.customImageUrl}   width={350}
                  height={200}/>
              <Card.Body>
                <Card.Title>{category.categoryName
                }</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Categories;
