import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

const InventoryManager = () => {
  const [locations, setLocations] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/locations')
      .then(response => {
        setLocations(response.data);
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
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      axios.get(`http://localhost:5000/inventory/${selectedLocation}`)
        .then(response => {
          setInventory(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the inventory!', error);
        });

      axios.get(`http://localhost:5000/staff/${selectedLocation}`)
        .then(response => {
          setStaff(response.data);
          console.log('Staff fetched:', response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the staff!', error);
        });
    } else {
      setStaff([]);
    }
  }, [selectedLocation]);

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
        // Refresh inventory list
        axios.get(`http://localhost:5000/inventory/${selectedLocation}`)
          .then(response => {
            setInventory(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the inventory!', error);
          });
      })
      .catch(error => {
        console.error('Error adding inventory:', error);
      });
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="locationSelect">
          <Form.Label>Select Location</Form.Label>
          <Form.Control as="select" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
            <option value="">Select a location</option>
            {locations.sort((a, b) => a.name.localeCompare(b.name)).map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
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
          {inventory.filter(item => item.quantity > 0).map(item => (
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
