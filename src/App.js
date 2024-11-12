import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Page1 from './components/Page1/Page1';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/page1" element={<Page1 />} />
      </Routes>
    </Router>
  );
}

export default App;
