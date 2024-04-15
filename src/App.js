import React from "react";
import Product from "./pages/product/Product"
import Sidebar from "./component/Sidebar"
import Editproduct from "./pages/product/Editproduct";
import Home from './pages/home';
import Cart from './pages/cart';
import Navbar from './component/navbar';
import Calendar from "./pages/calendar/Calendar";
import Login from "./pages/login/login";
import Register from "./pages/login/register"
import Validation from "./pages/login/validation";
import Checkstatus from './pages/checkstatus/Checkstatus';
import Editcheckstatus from './pages/checkstatus/Editcheckstatus';
import Workstatus from './pages/checkstatus/Workstatus';
import Editworkstatus from './pages/checkstatus/Editworkstatus';
import Workfinish from './pages/checkstatus/Workfinish';
import "./app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Employee from "./pages/employee/Employee"
import Quotation from "./pages/quotation/Quotation";
import Editemployee from "./pages/employee/Editemployee";
import Editquotation from "./pages/quotation/Editquotation";
import Viewfinish from "./pages/checkstatus/Viewfinish";
import Dashboard from "./pages/dashboard/Dashboard";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<>
            <Navbar></Navbar>
            <Home />
          </>} />
          <Route path="/cart" element={<>
            <Navbar></Navbar>
            <Cart />
          </>} />
          <Route path="/product" element={
            <div style={{ display: 'flex' }}>
              <Sidebar />
              <Product />
            </div>
          } />
           <Route path="/calendar" element={
            <div style={{ display: 'flex' }}>
              <Sidebar />
              <Calendar />
            </div>
          } />
          <Route path="/Editproduct/:product_id" element={<Editproduct />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/validation" element={<Validation/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/checkstatus" element={<Checkstatus />} /> 
          <Route path="/Workstatus" element={<Workstatus />} /> 
          <Route path="/Workfinish" element={<Workfinish />} />
          <Route path="/Editworkstatus/:purchase_id" element={<Editworkstatus />} />
          <Route path="/Editcheckstatus/:purchase_id" element={<Editcheckstatus />} />
          <Route path="/quotation" element={<Quotation />} /> 
          <Route path="/employee" element={<Employee />} /> 
          <Route path="/Editquotation/:no_quotation" element={<Editquotation />} />
          <Route path="/Editemployee/:employee_id" element={<Editemployee />} />
          <Route path="/Viewfinish/:purchase_id" element={<Viewfinish />} />
          <Route path="/dashboard" element={<Dashboard />} /> 

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
