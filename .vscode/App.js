
import Sidebar from "./component/sidebar/Sidebar";
import Product from "./pages/product/Product";
import Employee from "./pages/employee/Employee";
import Quotation from "./pages/quotation/Quotation";
import Detaildown from "./pages/quotation/Detaildown";
import Editproduct from "./pages/product/Editproduct";
import SignUp from "./pages/Login/SignUp";

import "./app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";



function App() {



  return (
      <div className="main">
        <SignUp />
        <BrowserRouter>
          <Sidebar />
          <Routes>
            <Route>

              <Route path="Product" element={<Product />} />
              <Route path="Employee" element={<Employee />} />
              <Route path="Quotation" element={<Quotation />} />
              <Route path="Detaildown" element={<Detaildown />} />
              <Route path="/Editproduct/:product_id" element={<Editproduct />} />
              {/* <Route path ="SignUp" element={<SignUp />}/> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    
  );
}

export default App;
