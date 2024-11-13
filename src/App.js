import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Page1 from './components/Page1/Page1';
import Page2 from './components/Page2/Page2';
import Page3 from './components/Page3/Page3';
import Page4 from './components/Page4/Page4';
import Page5 from './components/Page5/Page5';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/page4" element={<Page4 />} />
        <Route path="/page5" element={<Page5 />} />
      </Routes>
    </Router>
  );
}

export default App;
