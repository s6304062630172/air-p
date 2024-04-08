import React from 'react'
import { Delete, Edit, Add, Close, Update, FirstPage } from "@mui/icons-material"
import { useState, useEffect } from 'react';
import Model from 'react-modal'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap';


function Product() {
  const [visible, setvisible] = useState(false)
  const [product_img, setproduct_img] = useState("");
  const [product_name, setproduct_name] = useState("");
  const [product_type_id, setproduct_type_id] = useState("");
  const [product_brand_id, setproduct_brand_id] = useState("");
  const [product_detail, setproduct_detail] = useState("");
  const [product_btu, setproduct_btu] = useState("");
  const [product_price, setproduct_price] = useState(0);
  const [product_quantity, setproduct_quantity] = useState(0);
  const [productList, setproductList] = useState([]);

  /////////pagination////////
  const [productsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(productList.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productList.slice(indexOfFirstProduct, indexOfLastProduct);


  //////////////////////////////////////////////////////

  const getproduct = () => {
    Axios.get('http://localhost:3001/product').then((response) => {
      setproductList(response.data);
    });

  }




  useEffect(() => {
    getproduct();
  }, []);

  const addProduct = () => {
    if (product_name == "" || product_img == "" || product_type_id == "" || product_brand_id == "" || product_detail == "" || product_price == "" || product_quantity == "" || product_quantity == "") {

    } else {
      Axios.post("http://localhost:3001/create", {
        product_img: product_img.split("\\").pop(),
        product_name: product_name,
        product_type_id: product_type_id,
        product_brand_id: product_brand_id,
        product_detail: product_detail,
        product_price: product_price,
        product_quantity: product_quantity,
        product_btu: product_btu
      }).then(() => {

        setproductList([
          ...productList,
          {
            product_img: product_img.split("\\").pop(),
            product_name: product_name,
            product_type_id: product_type_id,
            product_brand_id: product_brand_id,
            product_detail: product_detail,
            product_price: product_price,
            product_quantity: product_quantity,
            product_btu: product_btu
          },
        ]);
      });
    }
  };

  const deleteproduct = (product_id) => {
    Axios.delete(`http://localhost:3001/delete/${product_id}`).then((response) => {
      setproductList(
        productList.filter((val) => {
          return val.product_id != product_id;
        })
      )
    })

  }





  return (
    <div style={{  width: '100vw', height: '100%' }}>
      <table class="w-full text-sm text-left rtl:text-right text-black-500 dark:text-gray-400">
        <thead>
          <tr style={{textAlign:"center"}}>
            <th>ID</th>
            <th>NAME</th>
            <th>IMG</th>
            <th>Type</th>
            <th>Brand</th>
            <th>BTU</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((val, key) => {
            return (
              <tr style={{textAlign:"center",justifyContent:"center"}}>
                <td>{val.product_id}</td>
                <td>{val.product_name}</td>
                <td>
                  <img
                    src={val?.product_img}
                    alt="ui/ux review check"
                    style={{ width: '150px', height: '100px' }} // กำหนดขนาดรูปภาพเป็น 100x100 พิกเซล
                  />
                </td>

                <td>{val.product_type_name}</td>
                <td>{val.product_brand_name}</td>
                <td>{val.product_btu}</td>
                <td>{val.product_price}</td>
                <td>{val.product_quantity}</td>

                <Link to={`/Editproduct/${val.product_id}`} type="button" className="bg-black text-white px-4 py-2 rounded" ><Edit /></Link>
                <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" variant="outlined" color="error" onClick={() => { deleteproduct(val.product_id) }}><Delete /></button>

              </tr>
            )

          })}

        </tbody>
        
      </table>
      
      <div className="flex justify-center mt-3">
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`px-4 py-2 mx-1 rounded-full ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        ))}
      </div>
     
      <button class="btn btn-primary w-32 " onClick={() => setvisible(true)}> <Add />ADD</button>

      



      <Model id='Model' isOpen={visible}>
        <h1 style={{ display: 'flex' }}>ADD product<p className='close' onClick={() => setvisible(false)} style={{ marginLeft: 'auto' }}><Close /></p> </h1>
        <hr></hr>

        <form>
          <div>
            <p>Product picture</p>
            <input required type="file" id="myFile" name="filename" onChange={(event) => { setproduct_img(event.target.value) }}></input>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Product Name</label>
            <input required type="text" class="form-control" id="formGroupExampleInput2" placeholder="" onChange={(event) => { setproduct_name(event.target.value) }}></input>
          </div>
          <div>
            <p>Product Type</p>
            <select required onChange={(event) => { setproduct_type_id(event.target.value) }}>
              <option value="">เลือกประเภท</option>
              <option value={"A1"}>แอร์ติดผนัง</option>
              <option value={"A2"} >แอร์แขวน</option>
              <option value={"A3"}>สี่ทิศทาง</option>
              <option value={"A4"}>แอร์ตั้งพื้น</option>
            </select>
          </div>
          <div>
            <p>Product Brand</p>
            <select required onChange={(event) => { setproduct_brand_id(event.target.value) }}>
              <option selected value="">ระบุยี่ห้อ</option>
              <option value={"1"}>Daikin</option>
              <option value={"2"}>Carrier</option>
              <option value={"3"}>Panasonic</option>
              <option value={"4"}>Fujitsu</option>
              <option value={"5"}>LG</option>
              <option value={"6"}>Samsung</option>
              <option value={"7"}>Sharp</option>
              <option value={"8"}>Hitachi</option>
            </select>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Product Detail</label>
            <input required type="text" class="form-control" id="formGroupExampleInput2" placeholder="" onChange={(event) => { setproduct_detail(event.target.value) }}></input>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Product Price</label>
            <input required type="text" class="form-control" id="formGroupExampleInput2" placeholder="" onChange={(event) => { setproduct_price(event.target.value) }}></input>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">product_quantity</label>
            <input required type="text" class="form-control" id="formGroupExampleInput2" placeholder="" onChange={(event) => { setproduct_quantity(event.target.value) }}></input>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">product_btu</label>
            <input required type="text" class="form-control" id="formGroupExampleInput2" placeholder="" onChange={(event) => { setproduct_btu(event.target.value) }}></input>
          </div>

          <br></br>

          {/* <button class="btn btn-primary w-32 justify-end" onClick={addProduct}  type="submit">ADD</button> */}
          <button class="btn btn-primary w-32 justify-end" onClick={addProduct} > <Add />ADD</button>

        </form>



      </Model>


    </div>

  )
}

export default Product
