import axios from 'axios';
import { event } from 'jquery';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


export default function Editproduct() {
    
    const { product_id } = useParams();
    const [product_name, setproduct_name] = useState('')
    const [product_type, setproduct_type] = useState('')
    const [product_brand, setproduct_brand] = useState('')
    const [product_price, setproduct_price] = useState('')
    const [product_number, setproduct_number] = useState('')
    useEffect(() => {
        axios.get(`http://localhost:3001/Editproduct/${product_id}`)
            .then(res => {
                setproduct_name(res.data[0].product_name)
                setproduct_type(res.data[0].product_type)
                setproduct_brand(res.data[0].product_brand)
                setproduct_price(res.data[0].product_price)
                setproduct_number(res.data[0].product_number)
            })
            .catch(err => console.log(err))





    }, [])
    const navigate = useNavigate();
    const select_type = product_type
    const select_brand = product_brand

    const hanldeSubmit = (event) => {
        event.preventDefault();
        
        axios.put(`http://localhost:3001/update/${product_id}`, { product_name, product_type , product_brand,product_price,product_number})
            
            .then(res => {
                if (res.data.updated) {
                    navigate('/product')

                } else {
                    alert("Not updated")
                }
            })
    }

    return (
        <div>


            <div class="container mt-5">
                <h1>แก้ไขสินค้า</h1>

                <form onSubmit={hanldeSubmit}>
                    <div class="mb-3">
                        <label for="product-name" class="form-label">ชื่อสินค้า</label>
                        <input type="text" class="form-control" id="product-name" name="name" value={product_name}
                            onChange={(event) => { setproduct_name(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="product-name" class="form-label">ประเภทสินค้า</label>
                        
                        <select onChange={(event) => { setproduct_type(event.target.value) }} >
                            
                            <option value="แอร์ติดผนัง" selected={select_type === 'แอร์ติดผนัง'}>แอร์ติดผนัง</option>
                            <option value="แอร์แขวน" selected={select_type === 'แอร์แขวน'}>แอร์แขวน</option>
                            <option value="สี่ทิศทาง" selected={select_type === 'สี่ทิศทาง'}>สี่ทิศทาง</option>
                            <option value="แอร์ตั้งพื้น" selected={select_type === 'แอร์ตั้งพื้น'}>แอร์ตั้งพื้น</option>
                        </select >
                    </div>
                    <div class="mb-3">
                    <label for="product-name" class="form-label">ยี่ห้อสินค้า</label>
                    <select  onChange={(event) => { setproduct_brand(event.target.value) }}>
                
                                <option value={"A"} selected={select_brand === 'A'} >A</option>
                                <option value={"B"} selected={select_brand === 'B'}>B</option>
                                <option value={"C"} selected={select_brand === 'C'}>C</option>
                                <option value={"D"} selected={select_brand === 'D'}>D</option>
                            </select>
                    </div>
                    <div class="mb-3">
                        <label for="product-name" class="form-label">ราคาสินค้า</label>
                        <input type="text" class="form-control" id="product-name" name="name" value={product_price}
                            onChange={(event) => { setproduct_price(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="product-name" class="form-label">จำนวนสินค้าคงเหลือ</label>
                        <input type="text" class="form-control" id="product-name" name="name" value={product_number}
                            onChange={(event) => { setproduct_number(event.target.value) }} />
                    </div>

                    {/* <div class="mb-3">
                        <label for="product-description" class="form-label">รายละเอียดสินค้า</label>
                        <textarea class="form-control" id="product-description" name="description" rows="3" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="product-price" class="form-label">ราคาสินค้า</label>
                        <input type="number" class="form-control" id="product-price" name="price" required />
                    </div>
                    <div class="mb-3">
                        <label for="product-image" class="form-label">รูปภาพสินค้า</label>
                        <input type="file" class="form-control" id="product-image" name="image" />
                    </div> */}
                    <button type="submit" class="btn btn-primary">บันทึก</button>
                </form>
            </div>




        </div>
    )
}


