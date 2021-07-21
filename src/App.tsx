import React from 'react';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Home from "./pages/home/home.page";
import Dss from "./pages/dss/dss.page";
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar bg="light" expand="lg">
          <Container>            
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>                
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>        
        <Switch>
          <div className="container">
            <Route exact path="/" component={Home} />
            <Route path="/:deviceId/dss" component={Dss}></Route>
          </div>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
