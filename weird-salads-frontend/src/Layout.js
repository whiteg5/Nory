import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from './LocationContext';

const Layout = ({ children }) => {
  const { selectedLocation } = useLocation();

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Weird Salads</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/inventory-manager">
                <Nav.Link disabled={!selectedLocation}>Inventory Manager</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/front-of-house-sales">
                <Nav.Link disabled={!selectedLocation}>Front of House Sales</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        {children}
      </Container>
    </>
  );
};

export default Layout;
