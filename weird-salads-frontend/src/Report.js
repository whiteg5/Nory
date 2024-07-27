import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Container, Table } from 'react-bootstrap';
import { useLocation } from './LocationContext';

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState('deliveries');
  const [error, setError] = useState(null);
  const { selectedLocation, locations } = useLocation();

  useEffect(() => {
    if (selectedLocation) {
      axios.get(`http://localhost:5000/report/${selectedLocation}/${reportType}`)
        .then(response => {
          console.log('Report data:', response.data);
          setReportData(response.data);
          setError(null);
        })
        .catch(error => {
          console.error('There was an error fetching the report data!', error);
          setError('Error fetching report data');
        });
    }
  }, [selectedLocation, reportType]);

  const handleReportTypeChange = (type) => {
    setReportType(type);
  };

  const locationName = locations.find(loc => loc.id === parseInt(selectedLocation))?.name || "Location";

  const totalCost = reportType === 'deliveries' && Array.isArray(reportData)
    ? reportData.reduce((sum, item) => sum + (item.cost || 0), 0)
    : 0;

  const totalRevenue = reportType === 'revenue' && Array.isArray(reportData)
    ? reportData.reduce((sum, item) => sum + (item.total_price || 0), 0)
    : 0;

  return (
    <Container>
      <h2>Report for {locationName}</h2>
      <div className="mb-3">
        <Button variant="primary" onClick={() => handleReportTypeChange('deliveries')}>Cost of Ingredients</Button>{' '}
        <Button variant="secondary" onClick={() => handleReportTypeChange('revenue')}>Total Revenue from Sales</Button>{' '}
        <Button variant="success" onClick={() => handleReportTypeChange('inventory')}>Total Value of Current Inventory</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {reportType === 'deliveries' && Array.isArray(reportData) && (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Staff</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td>{item.ingredient_name}</td>
                  <td>{item.staff_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.cost?.toFixed(2) || '0.00'}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Alert variant="info">
            <h4>Total Cost of Ingredients</h4>
            <p>{totalCost.toFixed(2)}</p>
          </Alert>
        </div>
      )}
      {reportType === 'revenue' && Array.isArray(reportData) && (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Menu Item</th>
                <th>Quantity Sold</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td>{item.recipe_name}</td>
                  <td>{item.quantity_sold}</td>
                  <td>{item.total_price?.toFixed(2) || '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Alert variant="info">
            <h4>Total Revenue from Sales</h4>
            <p>{totalRevenue.toFixed(2)}</p>
          </Alert>
        </div>
      )}
      {reportType === 'inventory' && Array.isArray(reportData.inventory_data) && (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Quantity</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {reportData.inventory_data
                .filter(item => item.quantity > 0)
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.ingredient_name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.value?.toFixed(2) || '0.00'}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Alert variant="info">
            <h4>Total Value of Inventory</h4>
            <p>{reportData.total_value?.toFixed(2) || '0.00'}</p>
          </Alert>
        </div>
      )}
    </Container>
  );
};

export default Report;
