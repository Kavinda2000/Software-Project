import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Parts from './pages/Parts/Parts';
import Services from './pages/Services/Services'
import Contact from './pages/Contact/Contact'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import { ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from './pages/Parts/ProductDetails/ProductDetails'

function App() {
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home /> } />  
        <Route path="/Parts" element={<Parts />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Contact" element={<Contact /> } />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Parts/:id" element={<ProductDetails />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
