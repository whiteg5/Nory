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

  const buttonStyle = {
    margin: '10px',
    height: '50px',
  };

  return (
    <Container>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Welcome to Weird Salads</h1>
          <p className="col-md-8 fs-4">Manage your inventory, sales and reporting.</p>
          <Form.Group controlId="locationSelect" className="mb-4">
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
          <div className="d-flex flex-wrap justify-content-center">
            <Button
              variant="primary"
              onClick={() => handleProceed("/inventory")}
              style={buttonStyle}
            >
              Go to Inventory Manager
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleProceed("/sales")}
              style={buttonStyle}
            >
              Go to Front of House Sales
            </Button>
            <Button
              variant="info"
              onClick={() => handleProceed("/reports")}
              style={buttonStyle}
            >
              Go to Reports
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
