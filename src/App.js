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
import Sucess from "./pages/cart/sucess";
import UserRoute from "./pages/login/UserRoute";

import History from "./pages/user/History";
import Usercheckstatus from "./pages/user/Usercheckstatus";
import CalculateBTU from "./pages/home/modal/calculateBTU"


import Checkstatus from './pages/checkstatus/Checkstatus';
import Editcheckstatus from './pages/checkstatus/Editcheckstatus';
import Workstatus from './pages/checkstatus/Workstatus';
import Editworkstatus from './pages/checkstatus/Editworkstatus';
import Workfinish from './pages/checkstatus/Workfinish';
import Viewfinish from "./pages/checkstatus/Viewfinish";
import Changebook from "./pages/checkstatus/Changebook";
import Userquo from "./pages/userquo/Userquo";
import Dashboard from "./pages/dashboard/Dashboard";
import Employee from "./pages/employee/Employee"
import Editemployee from "./pages/employee/Editemployee";

///qua///
import Quotation from "./pages/quotation/Quotation";
import Editquotation from "./pages/quotation/Editquotation"

import "./app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<>
            <UserRoute>
              <Navbar></Navbar>
              <Home />
            </UserRoute>
          </>} />
          <Route path="/cart" element={<>
            <UserRoute>
              <Navbar></Navbar>
              <Cart />
            </UserRoute>
          </>} />
          {/* <Route path="/calculateBTU" element={<>
            <UserRoute>
              <Navbar></Navbar>
              <CalculateBTU />
            </UserRoute>
          </>} /> */}
          <Route path="/history" element={<>
            <UserRoute>
              <Navbar></Navbar>
              <History />
            </UserRoute>
          </>} />
          <Route path="/usercheckstatus/:purchase_id" element={<>
            <UserRoute>
              <Navbar></Navbar>
              <Usercheckstatus />
            </UserRoute>
          </>} />

          <Route path="/product" element={
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Product />
              </UserRoute>
            </div>
          } />
          <Route path="/calendar" element={
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Calendar />
              </UserRoute>
            </div>
          } />
          <Route path="/sucess" element={<>
            <UserRoute>
              <Navbar></Navbar>
              <Sucess />
            </UserRoute>
          </>} />
          <Route path="/Editproduct/:product_id" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Editproduct />
              </UserRoute>
            </div>
          </>} />
          <Route path="/login" element={<Login />} />
          <Route path="/validation" element={<Validation />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkstatus" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Checkstatus />
              </UserRoute>
            </div>
          </>} />
          <Route path="/Workstatus" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Workstatus />
              </UserRoute>
            </div>
          </>} />
          <Route path="/Workfinish" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Workfinish />
              </UserRoute>
            </div>
          </>} />
          <Route path="/Editworkstatus/:ordering_id" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Editworkstatus />
              </UserRoute>
            </div>
          </>} />
          <Route path="/Editcheckstatus/:purchase_id" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Editcheckstatus />
              </UserRoute>
            </div>
          </>} />
          <Route path="/Changebook/:ordering_id" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Changebook />
              </UserRoute>
            </div>
          </>} />
          <Route path="/Quotation" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Quotation />
              </UserRoute>
            </div>
          </>} />
          <Route path="/dashboard" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Dashboard />
              </UserRoute>
            </div>
          </>} />
          <Route path="/Editquotation/:no_quotation" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Editquotation />
              </UserRoute>
            </div>
          </>} />
          <Route path="/userquo" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Userquo />
              </UserRoute>
            </div>
          </>} />
          <Route path="/Editemployee/:employee_id" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Editemployee />
              </UserRoute>
            </div>
          </>} />
          <Route path="/employee" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Employee />
              </UserRoute>
            </div>
          </>} />

          <Route path="/Viewfinish/:ordering_id" element={<>
            <div style={{ display: 'flex' }}>
              <UserRoute>
                <Sidebar />
                <Viewfinish />
              </UserRoute>
            </div>
          </>} />




        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
