import React from 'react'
import Axios from 'axios'
import Button from '@mui/material/Button';
import {Delete,Edit,Add,Close} from "@mui/icons-material"

import { useState,useEffect } from 'react';
import Model from 'react-modal'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';






export default function Product() {
    
    
    const [visible,setvisible]=useState(false)
    const [product_img , setproduct_img] = useState("");
    const [product_name, setproduct_name] = useState("");
    const [product_type , setproduct_type] = useState("");
    const [product_brand , setproduct_brand] = useState("");
    const [product_detail , setproduct_detail] = useState("");
    const [product_price , setproduct_price] = useState(0);
    const [product_number , setproduct_number] = useState(0);
    const [productList, setproductList] = useState([]);
    
    
    const getproduct = () => {
        Axios.get('http://localhost:3001/product').then((response)=>
        {
            setproductList(response.data);
        });

     }

    

     useEffect(() => {
        getproduct();
      }, []);

      const addProduct = () => {
       
        Axios.post("http://localhost:3001/create", {
            product_img : product_img.split("\\").pop(),
            product_name : product_name,
            product_type : product_type,
            product_brand : product_brand,
            product_detail : product_detail,
            product_price : product_price,
            product_number : product_number,
        }).then(() => {
            setproductList([
            ...productList,
            {
                product_img : "error"+product_img.split("\\").pop(),
                product_name : product_name,
                product_type : product_type,
                product_brand : product_brand,
                product_detail : product_detail,
                product_price : product_price,
                product_number : product_number,
            },
          ]);
        });
      };
    
      const deleteproduct = (product_id) => 
      {
        Axios.delete(`http://localhost:3001/delete/${product_id}`).then((response) => {
           setproductList(
            productList.filter((val) => {
                return val.product_id != product_id;
            })
           ) 
        })

      }


      const editProduct = () => {
        Axios.post("http://localhost:3001/edit", {
            product_img : product_img,
            product_name : product_name,
            product_type : product_type,
            product_brand : product_brand,
            product_detail : product_detail,
            product_price : product_price,
            product_number : product_number,
        }).then(() => {
            setproductList([
            ...productList,
            {
                product_img : product_img,
                product_name : product_name,
                product_type : product_type,
                product_brand : product_brand,
                product_detail : product_detail,
                product_price : product_price,
                product_number : product_number,
            },
          ]);
        });
      };


   
    


  return (
    

   
   <div >    
            <h3>Product manage</h3>
            {/* <img src={require('../../picture/Manual chompoo.png').default} height={500} width={500}/> */}

            
            {productList.map((val, key) =>{

            return(
            
                <div className='table'>
                    

                    <p> ID: {val.product_id}</p>
                    <p className='img'> img : {val.product_img}</p>
                    <p> Name: {val.product_name}</p>
                    <p> type: {val.product_type}</p>
                    <p> brand: {val.product_brand}</p>
                    <p> price: {val.product_price}</p>
                    <p> Number: {val.product_number}</p>
                    <p className='button' onClick={() => {deleteproduct(val.product_id)}}><Delete />Delete</p>
                    <p className='button'  onClick={()=>{setvisible(true);setvisible(val.product_id);}} ><Edit />Edit</p>
                </div>
                
               
            )
            
        })}

        <p className='add' onClick={()=>setvisible(true)}> <Add />ADD</p>
        {/* <Model isOpen={visible}>
            <h1>ADD Product</h1>
            <p className='close' onClick={()=>setvisible(false)}><Close /></p>
            <form className='form' action="">
                <div className='block1'>
                <div>
                <p>Product picture</p>
                    <input type="file" id="myFile" name="filename" onChange={(event) => {setproduct_img(event.target.value)} }></input>
                </div>
                <div>
                <p>Product Name</p>
                <TextField id="outlined-basic" label="Product NAME" variant="outlined" onChange={(event) => {setproduct_name(event.target.value)} } />
                </div>
                <div>
                <p>Product Type</p>
                    <select  onChange={(event) => {setproduct_type(event.target.value)} }>
                        <option value={"แอร์ติดผนัง"}>แอร์ติดผนัง</option>
                        <option value={"แอร์แขวน"}>แอร์แขวน</option>
                        <option value={"สี่ทิศทาง"}>สี่ทิศทาง</option>
                        <option value={"แอร์ตั้งพื้น"}>แอร์ตั้งพื้น</option>
                    </select>
                </div>
                <div>
                <p>Product Brand</p>
                <TextField id="outlined-basic" label="Product Brand" variant="outlined" onChange={(event) => {setproduct_brand(event.target.value)} }/>
                </div>
                </div>
                <div className='block2'>
                
                <div>
                <p>Product detail</p>
                <TextField id="outlined-basic" label="Product detail" variant="outlined" onChange={(event) => {setproduct_detail(event.target.value)} }/>
                </div>
                <div>
                <p>Product price</p>
                <TextField id="outlined-basic" label="Product price" variant="outlined" onChange={(event) => {setproduct_price(event.target.value)} }/>
                </div>
                <div>
                <p>Product Number</p>
                <TextField id="outlined-basic" label="Product number" variant="outlined" onChange={(event) => {setproduct_number(event.target.value)} }/>
                </div>
                </div>
                
              
            </form>
            <button onClick={addProduct}>add</button>

        </Model> */}

        <Model  id='Model' isOpen={visible}>
            <h1>Edit Product</h1>
            <p className='close' onClick={()=>setvisible(false)}><Close /></p>
            <form className='form' action="">
                <div className='block1'>
                <div>
                <p>Product picture</p>
                    <input type="file" id="myFile" name="filename" onChange={(event) => {setproduct_img(event.target.value)} }></input>
                </div>
                <div>
                <p>Product Name</p>
                <TextField id="outlined-basic" label="Product NAME" variant="outlined" onChange={(event) => {setproduct_name(event.target.value)} } />
                </div>
                <div>
                <p>Product Type</p>
                    
                    <select  onChange={(event) => {setproduct_type(event.target.value)} }>
                        <option value="">เลือกประเภท</option>                                       
                        <option value={"แอร์ติดผนัง"}>แอร์ติดผนัง</option>
                        <option value={"แอร์แขวน"} >แอร์แขวน</option>
                        <option value={"สี่ทิศทาง"}>สี่ทิศทาง</option>
                        <option value={"แอร์ตั้งพื้น"}>แอร์ตั้งพื้น</option>
                    </select>
                </div>
                <div>
                <p>Product Brand</p>
                    <select   onChange={(event) => {setproduct_brand(event.target.value)} }>
                        <option selected value="">ระบุยี่ห้อ</option> 
                        <option   value={"A"}>A</option>
                        <option value={"B"}>B</option>
                        <option value={"C"}>C</option>
                        <option value={"D"}>D</option>
                    </select>
                
                </div>
                </div>
                <div className='block2'>
                
                <div>
                <p>Product detail</p>
                <TextField id="outlined-multiline-static" label="details" multiline rows={4}  onChange={(event) => {setproduct_detail(event.target.value)} } />     
                </div>
                <div>
                <p>Product price</p>
                <TextField id="outlined-basic" label="Product price" variant="outlined" onChange={(event) => {setproduct_price(event.target.value)} }/>
                </div>
                <div>
                <p>Product Number</p>
                <TextField id="outlined-basic" label="Product number" variant="outlined" onChange={(event) => {setproduct_number(event.target.value)} }/>
                </div>
                </div>
                
              
            </form>
            <button id="update" onClick={addProduct}>Update</button>

        </Model>
        
        
        

  </div>  
     
            
  )
}
