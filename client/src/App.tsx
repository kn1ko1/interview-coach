import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Results from './pages/Results';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Switch>
            <Route path="/login" component={Login} />
            <ProtectedRoute path="/home" exact component={Home} />
            <ProtectedRoute path="/interview" component={Interview} />
            <ProtectedRoute path="/results" component={Results} />
            {/* Redirect root to login (unless already authenticated - ProtectedRoute will handle) */}
            <Route path="/">
              <Redirect to="/login" />
            </Route>
            <Route path="*">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;