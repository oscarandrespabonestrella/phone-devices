import React from 'react';
import { HashRouter as Router, Route, Link, Switch} from "react-router-dom";
import Home from "./pages/home/home.page";
import './App.css';

function App() {  
  return (
    <Router>
        <div>
          <nav>
            <Link to="/">Devices</Link>            
          </nav>
          <Switch>
            <div className="container">
              <Route exact path="/" component={Home} />
            </div>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
