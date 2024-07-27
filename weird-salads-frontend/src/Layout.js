import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { useLocation } from './LocationContext';

const Layout = () => {
  const { selectedLocation, locations } = useLocation();
  const locationName = locations.find(loc => loc.id === parseInt(selectedLocation))?.name || "Select Location";

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Weird Salads</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/inventory">Inventory Manager</Nav.Link>
              <Nav.Link as={Link} to="/sales">Front of House Sales</Nav.Link>
              <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Text>
            Location: <strong>{locationName}</strong>
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container className="mt-3">
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
