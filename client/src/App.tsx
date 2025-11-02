import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Results from './pages/Results';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/interview" component={Interview} />
          <Route path="/results" component={Results} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;