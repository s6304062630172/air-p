import axios from 'axios';

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "@material-tailwind/react";


export default function Editproduct() {
    const { product_id } = useParams();
    const [product_name, setproduct_name] = useState('')
    const [product_type_id, setproduct_type_id] = useState('')
    const [product_brand_id, setproduct_brand_id] = useState('')
    const [product_price, setproduct_price] = useState('')
    const [product_quantity, setproduct_quantity] = useState('')
    const [product_btu, setproduct_btu] = useState('')
    const [product_img, setproduct_img] = useState('')
    useEffect(() => {
        const email = localStorage.getItem("email");
        if (email != "admin@gmail.com") {
            window.location = '/'
        } else {
        }
        axios.get(`http://localhost:3001/Editproduct/${product_id}`)
            .then(res => {
                setproduct_name(res.data[0].product_name)
                setproduct_type_id(res.data[0].product_type_id)
                setproduct_brand_id(res.data[0].product_brand_id)
                setproduct_price(res.data[0].product_price)
                setproduct_quantity(res.data[0].product_quantity)
                setproduct_btu(res.data[0].product_btu)
                setproduct_img(res.data[0].product_img)
            })
            .catch(err => console.log(err))
    }, [])
    const navigate = useNavigate();
    const select_type = product_type_id
    const select_brand = product_brand_id

    const hanldeSubmit = (event) => {
        event.preventDefault();

        axios.put(`http://localhost:3001/update/${product_id}`, { product_name, product_type_id, product_brand_id, product_price, product_quantity, product_btu })

            .then(res => {
                if (res.data.updated) {
                    navigate('/product')

                } else {
                    alert("Not updated")
                }
            })
    }
    return (
        <div class="w-full h-full fixed overflow-auto">
            <div class="container mt-5">
                <h1 class="text-3xl font-bold text-gray-800 mb-4">แก้ไขสินค้า</h1>


                <form onSubmit={hanldeSubmit}>
                    <div class="mb-3">
                        <img
                            src={product_img}
                            alt="ui/ux review check"
                            style={{ width: '150px', height: '100px' }} // กำหนดขนาดรูปภาพเป็น 100x100 พิกเซล
                        />
                        <label for="product-name" class="form-label">ชื่อสินค้า</label>

                        <input type="text" class="form-control" id="product-name" name="name" value={product_name}
                            onChange={(event) => { setproduct_name(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="product-name" class="form-label">ประเภทสินค้า</label>

                        <select onChange={(event) => { setproduct_type_id(event.target.value) }} >

                            <option value="A1" selected={select_type === 'A1'}>แอร์ติดผนัง</option>
                            <option value="A2" selected={select_type === 'A2'}>แอร์แขวน</option>
                            <option value="A3" selected={select_type === 'A3'}>สี่ทิศทาง</option>
                            <option value="A4" selected={select_type === 'A4'}>แอร์ตั้งพื้น</option>
                            <option value="A5" selected={select_type === 'A5'}>ซ่อม</option>
                            <option value="A6" selected={select_type === 'A6'}>ล้าง</option>
                        </select >
                    </div>
                    <div class="mb-3">
                        <label for="product-name" class="form-label">ยี่ห้อสินค้า</label>
                        <select onChange={(event) => { setproduct_brand_id(event.target.value) }}>

                            <option value={"1"} selected={select_brand === '1'} >Daikin</option>
                            <option value={"2"} selected={select_brand === '2'}>Carrier</option>
                            <option value={"3"} selected={select_brand === '3'}>Panasonic</option>
                            <option value={"4"} selected={select_brand === '4'}>Fujitsu</option>
                            <option value={"5"} selected={select_brand === '5'}>LG</option>
                            <option value={"6"} selected={select_brand === '6'}>Samsung</option>
                            <option value={"7"} selected={select_brand === '7'}>Sharp</option>
                            <option value={"8"} selected={select_brand === '8'}>Hitachi</option>
                            <option value={"9"} selected={select_brand === '9'}>ซ่อม</option>
                            <option value={"10"} selected={select_brand === '10'}>ล้าง</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="product-name" class="form-label">ราคาสินค้า</label>
                        <input type="text" class="form-control" id="product-name" name="name" value={product_price}
                            onChange={(event) => { setproduct_price(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="product-name" class="form-label">BTU</label>
                        <input type="text" class="form-control" id="product-name" name="name" value={product_btu}
                            onChange={(event) => { setproduct_btu(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="product-name" class="form-label">จำนวนสินค้าคงเหลือ</label>
                        <input type="text" class="form-control" id="product-name" name="name" value={product_quantity}
                            onChange={(event) => { setproduct_quantity(event.target.value) }} />
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
                        <input type="file" class="form-control" id="product-image" name=
                        <"image" />
                    </div> */}
                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">บันทึก</button>
                        <Button onClick={() => navigate('/product')} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
                    </div>

                </form>
            </div>




        </div>
    )
}


