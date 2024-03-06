
import ReactDOM from 'react-dom/client';
import Sidebar from "./component/sidebar/Sidebar";
import Product from "./pages/product/Product";
import Employee from "./pages/employee/Employee"
import Quotation from "./pages/quotation/Quotation";
import Editproduct from "./pages/product/Editproduct";
import SignUp from "./pages/Login/SignUp";
import Calendar from "./pages/calender/Calendar";
import Home from './pages/home';
import Cart from './pages/cart';
import Navbar from './component/navbar';
import "./app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editemployee from "./pages/employee/Editemployee";
import Editquotation from "./pages/quotation/Editquotation";
import Checkstatus from './pages/checkstatus/Checkstatus';
import Editcheckstatus from './pages/checkstatus/Editcheckstatus';


const root = ReactDOM.createRoot(document.getElementById('root'));
function App() {



  return (
    <div className="m-main" >

      <BrowserRouter>
      <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />  
          <Route path="/cart" element={<Cart />} />  
          <Route path="/employee" element={<Employee />} /> 
          <Route path="/product" element={<Product />} /> 
          <Route path="/quotation" element={<Quotation />} /> 
          <Route path="/checkstatus" element={<Checkstatus />} /> 
          <Route path="/Editproduct/:product_id" element={<Editproduct />} />
          <Route path="/Editquotation/:no_quotation" element={<Editquotation />} />
          <Route path="/Editemployee/:employee_id" element={<Editemployee />} />
          <Route path="/Editcheckstatus/:purchase_id" element={<Editcheckstatus />} />
          <Route path="Calendar" element={
              <>
                <Sidebar />
                <Calendar />
              
              </>
            } />
           
        </Routes>

        {/* <Routes>
          <Route>

            <Route path="SignUp" element={<SignUp />} />
            <Route path="Quotation" element={
              <>
                <Sidebar />
                <Quotation />
                
              
              </>
            } />
            <Route path="Product" element={
              <>
                <Sidebar />
                <Product />
              
              </>
            } />
            <Route path="Employee" element={
              <>
                <Sidebar />
                <Employee />
                
              
              </>
            } />
             <Route path="Calendar" element={
              <>
                <Sidebar />
                <Calendar />
              
              </>
            } />
        
            

       

            <Route path="/Editproduct/:product_id" element={<Editproduct />} />
          </Route>
        </Routes> */}
      </BrowserRouter>
    </div>

  );
}

export default App;
