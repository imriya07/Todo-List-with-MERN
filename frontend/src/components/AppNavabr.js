import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import todoLogo from "../images/todo-logo.png";
import "../index.css";

const AppNavbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={todoLogo}
            alt="Logo"
            height="40"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={isDashboard ? "/dashboard" : "/"}>
              <h2 className="todo">TodoList</h2>
            </Nav.Link>
          </Nav>
          <div className="d-flex gap-2">
            {isDashboard ? (
              <Button className="logout" as={Link} to="/logout">
                Logout
              </Button>
            ) : (
              <>
                <Button className="login" as={Link} to="/login">
                  Login
                </Button>
                <Button className="register" as={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
