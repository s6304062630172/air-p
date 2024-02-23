import "./product.css";
import React from 'react'
import Axios from 'axios'
import Button from '@mui/material/Button';
import { Delete, Edit, Add, Close, Update, FirstPage } from "@mui/icons-material"
import { useState, useEffect } from 'react';
import Model from 'react-modal'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { event } from "jquery";
import { Link } from 'react-router-dom'








export default function Product() {


    
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
    

 




    

    const getproduct = () => {
        Axios.get('http://localhost:3001/product').then((response) => {
            setproductList(response.data);
        });

    }
  



    useEffect(() => {
        getproduct();
    }, []);

    const addProduct = () => {
        if (product_name == "" || product_img == "" || product_type_id == "" || product_brand_id == "" || product_detail == "" || product_price == "" || product_quantity == ""|| product_quantity == "") {
            
        } else {
            Axios.post("http://localhost:3001/create", {
                product_img: product_img.split("\\").pop(),
                product_name: product_name,
                product_type_id: product_type_id,
                product_brand_id: product_brand_id,
                product_detail: product_detail,
                product_price: product_price,
                product_quantity: product_quantity,
                product_btu : product_btu
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
                        product_btu : product_btu
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

    // const [currentPage,setcurrentPage] = useState(1)
    // const recordPerPage = 5
    // const lastIndex = currentPage* recordPerPage
    // const firstIndex = lastIndex - recordPerPage
    // const records = Data.slice(Data.length/recordPerPage)
    // const npage =  Math.celi(Data.length/recordPerPage)
    // const numbers = [...Array(npage + 1).key()].slice(1)



   
    









    return (


        <div className="product">


            <h3>Product manage</h3>
            {/* <img src={require('../../picture/Manual chompoo.png').default} height={500} width={500}/> */}

            <table class="table table-striped">
                <thead>
                    <tr>
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
                    {productList.map((val, key) => {
                        return (
                            <tr>
                                <td>{val.product_id}</td>
                                <td>{val.product_name}</td>
                                <td><img src={`../../picture/${val.product_img}`}  /></td>
                                <td>{val.product_type_name}</td>
                                <td>{val.product_brand_name}</td>
                                <td>{val.product_btu}</td>
                                <td>{val.product_price}</td>
                                <td>{val.product_quantity}</td>
                                
                                <Link to={`/Editproduct/${val.product_id}`} type="button" class="btn btn-dark" ><Edit /></Link>
                                <button type="button" class="btn btn-danger" variant="outlined" color="error" onClick={() => { deleteproduct(val.product_id) }}><Delete /></button>

                            </tr>
                        )

                    })}

                </tbody>
            </table>
            {/* <nav>
                <ul className="pagination">
                    <li>
                        <a href="#" className="page-link" onClick={prePage}>Prev</a>
                    </li>
                    {
                        numbers.map((n,i)=> (
                            <li className={`page-item ${currentPage === n ? 'active': ''}`} key ={i}>
                                <a href="#" className="page-item"
                                onClick={changePage}></a>
                            </li>
                        ))
                    }
                    <li>
                        <a href="#" className="page-link" onClick={nextPage}>Next</a>
                    </li>
                   
                </ul>
            </nav> */}

            <button class="btn btn-primary"  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setvisible(true)}> <Add />ADD</button>
            







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

                    <button onClick={addProduct} class="btn btn-primary" type="submit">ADD</button>

                </form>



            </Model>


            







        </div>


    )
    // function prePage() {
    //     if(currentPage !== FirstPage){
    //         setcurrentPage(currentPage - 1)
    //     }

    // }
    // function changePage(id){
    //     setcurrentPage(id)

    // }
    // function nextPage()
    // {
    //     if(currentPage !== lastIndex){
    //         setcurrentPage(currentPage + 1)
    //     }
    // }
}
