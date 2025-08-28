import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Parts from './pages/Parts/Parts';
import Services from './pages/Services/Serv'
import Contact from './pages/Contact/Contact'
import Register from './pages/Register/Register';
import { ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from './pages/Parts/ProductDetails/ProductDetails'
import Checkout from './pages/Parts/Checkout/Checkout';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import CustomerDashBoard from './pages/DashBoards/Customer DashBoard/CusDashBoard';
import VenDashBoard from './pages/DashBoards/Vendor  DashBoard/VenDashBoard';
import Login from './pages/Login/Login';
import Otp from './pages/Otp/Otp';
import ResetPassword from './pages/ForgotPassword/ResetPassword';
import BikeRepair from './pages/Services/Bike Repair/BikeRepairSchedule';
import BikeService from './pages/Services/Bike Service/BikeServiceBooking';
import BikeServicePayment from './pages/Services/Bike Service/BikeServicePayment';
import BikeRepairPayment from './pages/Services/Bike Repair/BikeRepairPayment';
import BikeServiceMap from './pages/Services/Bike Service/BikeServiceMap';
import GoogleServiceMap from './pages/Services/Bike Service/GoogleServiceMap';
import CusOrder from '../src/pages/DashBoards/Customer DashBoard/Orders/Orders';
import Support from '../src/pages/DashBoards/Customer DashBoard/Components/Support';
import CustomerScheduling from './pages/DashBoards/Customer DashBoard/CustomerScheduling';
import Veorders from './pages/DashBoards/Vendor  DashBoard/VeOrders/VeOrders';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home /> } />  
        <Route path="/Parts" element={<Parts />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/services" element={<Services />} />
        <Route path="/Services/BikeRepairSchedule" element={<BikeRepair />} />
        <Route path="/Services/BikeRepairPayment" element={<BikeRepairPayment />} />
        <Route path="/Services/BikeServiceSchedule" element={<BikeService />} />
        <Route path="/Services/BikeServicePayment" element={<BikeServicePayment />} />
        <Route path="/Services/BikeServiceMap" element={<BikeServiceMap />} />
        <Route path="/Services/GoogleServiceMap" element={<GoogleServiceMap />} />
        <Route path="/Contact" element={<Contact /> } />
        <Route path="/Login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Parts/:id" element={<ProductDetails />} /> 
        <Route path="/Parts/checkout/:id" element={<Checkout />} /> 
        <Route path="/customer-dashboard" element={<CustomerDashBoard />} />
        <Route path="/vendor-dashboard" element={<VenDashBoard />} />
        <Route path="/Otp" element={<Otp/>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/cusorders" element={<CusOrder />} />
        <Route path="/customer-support" element={<Support />} />
        <Route path="/customer-scheduling" element={<CustomerScheduling />} />
        <Route path="/veorders" element={<Veorders />} />
      </Routes>
    </Router>
  );
}

export default App;