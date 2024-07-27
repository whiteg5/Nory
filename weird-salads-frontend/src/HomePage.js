import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from './LocationContext';

function HomePage() {
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/locations')
      .then(response => {
        const sortedLocations = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setLocations(sortedLocations);
      })
      .catch(error => {
        console.error('There was an error fetching the locations!', error);
      });
  }, []);

  const handleInventoryClick = () => {
    if (selectedLocation) {
      navigate('/inventory-manager');
    } else {
      alert('Please select a location first');
    }
  };

  const handleSalesClick = () => {
    if (selectedLocation) {
      navigate('/front-of-house-sales');
    } else {
      alert('Please select a location first');
    }
  };

  return (
    <Container fluid className="p-5 bg-light">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1>Welcome to Weird Salads</h1>
          <p>Select your location to proceed:</p>
          <Form>
            <Form.Group controlId="locationSelect">
              <Form.Label>Select Location</Form.Label>
              <Form.Control
                as="select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Select a location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handleInventoryClick}>
              Inventory Manager
            </Button>
            <Button variant="secondary" className="mt-3 ml-3" onClick={handleSalesClick}>
              Front of House Sales
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
