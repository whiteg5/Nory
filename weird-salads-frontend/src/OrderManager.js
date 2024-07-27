import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

const OrderManager = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/recipes')
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the recipes!', error);
      });
  }, []);

  const handleOrder = () => {
    axios.post('http://localhost:5000/orders', {
      recipe_id: selectedRecipe,
    })
      .then(response => {
        console.log('Order processed:', response.data);
        // Refresh inventory list
        axios.get('http://localhost:5000/inventory')
          .then(response => {
            setInventory(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the inventory!', error);
          });
      })
      .catch(error => {
        console.error('Error processing order:', error);
      });
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="recipeSelect">
          <Form.Label>Select Recipe</Form.Label>
          <Form.Control as="select" value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)}>
            <option value="">Select a recipe</option>
            {recipes.map(recipe => (
              <option key={recipe.recipe_id} value={recipe.recipe_id}>{recipe.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={handleOrder}>
          Process Order
        </Button>
      </Form>
      <h3>Current Inventory</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.ingredient_id}>
              <td>{item.ingredient_name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderManager;
