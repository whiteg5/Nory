import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';

const FrontOfHouseSales = () => {
  const [locations, setLocations] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/locations')
      .then(response => {
        setLocations(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(error => {
        console.error('There was an error fetching the locations!', error);
      });
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      axios.get(`http://localhost:5000/recipes/${selectedLocation}`)
        .then(response => {
          setRecipes(response.data.sort((a, b) => a.name.localeCompare(b.name)));
        })
        .catch(error => {
          console.error('There was an error fetching the recipes!', error);
          setError('There was an error fetching the menu items');
        });
    } else {
      setRecipes([]);
    }
  }, [selectedLocation]);

  const handleOrder = () => {
    axios.post('http://localhost:5000/orders', {
      recipe_id: selectedRecipe,
      location_id: selectedLocation,
      quantity: quantity
    })
      .then(response => {
        console.log('Order processed:', response.data);
        setError(null);
        setSuccess('Order placed successfully!');
        setQuantity(1); // Reset quantity to 1 after successful order

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.insufficient_ingredients) {
          const insufficientIngredients = error.response.data.insufficient_ingredients
            .map(ing => `${ing.name} (Required: ${ing.required} ${ing.unit}, Available: ${ing.available} ${ing.unit})`)
            .join(', ');
          setError(`Insufficient ingredients: ${insufficientIngredients}`);
        } else {
          console.error('Error processing order:', error);
          setError('Error processing order');
        }
        setSuccess(null); // Clear any previous success message
      });
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="locationSelect">
          <Form.Label>Select Location</Form.Label>
          <Form.Control as="select" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
            <option value="">Select a location</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="recipeSelect">
          <Form.Label>Select Menu Item</Form.Label>
          <Form.Control as="select" value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)}>
            <option value="">Select a menu item</option>
            {recipes.map(recipe => (
              <option key={recipe.recipe_id} value={recipe.recipe_id}>{recipe.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="quantityInput">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            min="1"
          />
        </Form.Group>
        <Button variant="primary" onClick={handleOrder}>
          Process Order
        </Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
    </div>
  );
};

export default FrontOfHouseSales;
