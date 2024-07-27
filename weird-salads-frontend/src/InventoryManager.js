import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useLocation } from './LocationContext';

const InventoryManager = () => {
  const { selectedLocation } = useLocation();
  const [locations, setLocations] = useState([]);
  const [staff, setStaff] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/locations')
      .then(response => {
        const sortedLocations = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setLocations(sortedLocations);
        if (selectedLocation) {
          const selectedLoc = sortedLocations.find(loc => loc.id === parseInt(selectedLocation));
          if (selectedLoc) {
            setLocationName(selectedLoc.name);
          }
        }
      })
      .catch(error => {
        console.error('There was an error fetching the locations!', error);
      });

    axios.get('http://localhost:5000/ingredients')
      .then(response => {
        setIngredients(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the ingredients!', error);
      });

    if (selectedLocation) {
      fetchInventory(selectedLocation);

      axios.get(`http://localhost:5000/staff/${selectedLocation}`)
        .then(response => {
          setStaff(response.data);
          console.log('Staff fetched:', response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the staff!', error);
        });
    }
  }, [selectedLocation]);

  const fetchInventory = (locationId) => {
    axios.get(`http://localhost:5000/inventory/${locationId}`)
      .then(response => {
        const sortedInventory = response.data
          .filter(item => item.quantity > 0)
          .sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name));
        setInventory(sortedInventory);
      })
      .catch(error => {
        console.error('There was an error fetching the inventory!', error);
      });
  };

  const handleAddInventory = () => {
    axios.post('http://localhost:5000/deliveries', {
      location_id: selectedLocation,
      ingredient_id: selectedIngredient,
      quantity,
      staff_id: selectedStaff
    })
      .then(response => {
        console.log('Inventory added:', response.data);
        setQuantity(0);
        fetchInventory(selectedLocation);
      })
      .catch(error => {
        console.error('Error adding inventory:', error);
      });
  };

  return (
    <div>
      <h1>{locationName}</h1>
      <Form>
        <Form.Group controlId="staffSelect">
          <Form.Label>Select Staff</Form.Label>
          <Form.Control as="select" value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}>
            <option value="">Select a staff member</option>
            {staff.filter(s => s.role === 'Chef' || s.role === 'Back-of-house')
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(s => (
                    <option key={s.staff_id} value={s.staff_id}>{s.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="ingredientSelect">
          <Form.Label>Select Ingredient</Form.Label>
          <Form.Control as="select" value={selectedIngredient} onChange={e => setSelectedIngredient(e.target.value)}>
            <option value="">Select an ingredient</option>
            {ingredients.sort((a, b) => a.name.localeCompare(b.name)).map(ingredient => (
              <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="quantityInput">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddInventory}>
          Add Inventory
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

export default InventoryManager;
