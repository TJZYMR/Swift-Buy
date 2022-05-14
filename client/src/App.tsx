import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import './assets/styles/style.scss';
import Home from './components/Home';
import About from './components/Success';
import Login from './components/Login';
import Payment from './components/Payment';
import Register from './components/Register';
import PaymentDetails from './components/Home/PaymentDetails'
import UserDetails from './components/Home/UserDetails'
import PreviousInvoices from './components/Home/PreviousInvoices';
import BarcodeScan from './components/BarcodeScan'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import Success from './components/Success';

const App: React.FC = () => {
  return (
    <div className="App">
       <ToastContainer />
      {/* <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
      <hr/> */}
     <Routes>
        <Route  path="/" element={ <Login /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/payment" element={ <Payment /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/home" element={ <Home /> } />
        <Route path="/payment-details" element={ <PaymentDetails /> } />
        <Route path="/user-details" element={ <UserDetails /> } />
        <Route path="/previous-invoices" element={ <PreviousInvoices /> } />
        <Route path="/barcode-scan" element={ <BarcodeScan /> } />
        <Route path="/success" element={ <Success /> } />
      </Routes>
    </div>
  );
}

export default App;
