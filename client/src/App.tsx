import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Home from './pages/Home';
import TravelPlanner from './pages/TravelPlanner';
import Community from './pages/Community';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/travel-planner" component={TravelPlanner} />
        <Route path="/community" component={Community} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;