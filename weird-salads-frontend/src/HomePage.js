import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from './LocationContext';

const HomePage = () => {
  const { locations, selectedLocation, setSelectedLocation } = useLocation();
  const navigate = useNavigate();

  const handleProceed = (path) => {
    if (selectedLocation) {
      navigate(path);
    } else {
      alert("Please select a location first.");
    }
  };

  return (
    <Container>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Welcome to Weird Salads</h1>
          <p className="col-md-8 fs-4">Manage your salad ingredients and orders efficiently.</p>
          <Form.Group controlId="locationSelect">
            <Form.Label>Select Location</Form.Label>
            <Form.Control
              as="select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select a location</option>
              {locations.sort((a, b) => a.name.localeCompare(b.name)).map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <div className="mt-3">
            <Button variant="primary" onClick={() => handleProceed("/inventory")} className="me-2">
              Go to Inventory Manager
            </Button>
            <Button variant="secondary" onClick={() => handleProceed("/sales")}>
              Go to Front of House Sales
            </Button>
            <Button variant="info" onClick={() => handleProceed("/reports")}>
              Go to Reports
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
