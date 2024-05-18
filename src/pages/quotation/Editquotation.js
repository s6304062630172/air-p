import axios from 'axios';
// import { event } from 'jquery';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "@material-tailwind/react";

export default function Editquotation() {
    const { no_quotation } = useParams();
    const [title_quotation, settitle_quotation] = useState('')
    const [phone_admin, setphone_admin] = useState('');
    const [address_user, setaddress_user] = useState('');
    const [phone_user, setphone_user] = useState('');
    const [date_, setdate_] = useState('');
    const [annotation, setannotation] = useState('');
    const [id_tax_user, setid_tax_user] = useState('');
    const [id_tax_admin, setid_tax_admin] = useState('');
    const [email, setemail] = useState('');
    const [total_vat, settotal_vat] = useState('');
    const [vat, setvat] = useState('');
    const [price, setPrice] = useState('');
    const loadData = () => {
        axios.get(`http://localhost:3001/Editquotation/${no_quotation}`)
            .then(res => {
                settitle_quotation(res.data[0].title_quotation)
                setphone_admin(res.data[0].phone_admin)
                setaddress_user(res.data[0].address_user)
                setphone_user(res.data[0].phone_user)
                setdate_(res.data[0].date_)
                setannotation(res.data[0].annotation)
                setid_tax_user(res.data[0].id_tax_user)
                setid_tax_admin(res.data[0].id_tax_admin)
                setemail(res.data[0].email)
                settotal_vat(res.data[0].total_vat)
                setvat(res.data[0].vat)
            })
            .catch(err => console.log(err))

    }
    useEffect(() => {
        loadData();
    }, [])
    const navigate = useNavigate();
    const add = () => {
        axios.put(`http://localhost:3001/updatequ/${no_quotation}`, {
            title_quotation,
            phone_admin,
            address_user,
            phone_user,
            date_,
            annotation,
            id_tax_user,
            id_tax_admin,
            email,
            total_vat: totalPrice, // ส่ง totalPrice ไปยัง total_vat
            vat: calculatedVAT // ส่ง calculatedVAT ไปยัง vat
        })
        .then(res => {
            if (res.data.updated) {
                loadData();
                alert("update");
            } else {
                alert("Not updated");
            }
        })
        .catch(err => console.error(err));
    }
    const handleChange = (event, cart_id) => { // ส่ง cart_id ไปยัง handleChange
        setPrice(event.target.value);
        console.log(price);
        updated(cart_id); // อัพเดตราคาสำหรับ cart_id ที่ระบุ
    };
    const updated = (cart_id) => {
        axios.put(`http://localhost:3001/changeprice`, { price, cart_id })
            .then(res => {
                if (res.data.updated) {
                  //  alert("update");
                    getproduct();
                } else {
                    alert("Not updated");
                }
            })
            .catch(err => console.error(err));
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(calculatedVAT); // แสดงค่า calculatedVAT ใน console
        console.log(totalPrice); // แสดงค่า totalPrice ใน console
        add();
    };
    const [products, setProducts] = useState([]);
    const getproduct = () => {
        axios.get(`http://localhost:3001/quotation_detail/${no_quotation}`)
            .then(res => {

                setProducts(res.data);
            })
            .catch(err => console.log(err));

    }
    // // Calculate total price
    // // Calculate total price for each product (price * quantity) and sum them up
    // const totalPrice = products.reduce((acc, curr) => acc + (parseFloat(curr.price) * parseFloat(curr.quantity)), 0);
    // // Calculate VAT (assuming VAT is 7%)
    // const calculatedVAT =  products.reduce((acc, curr) => acc + (parseFloat(curr.price) * parseFloat(curr.quantity))*0.7, 0);
    // // const calculatedVAT =  (totalPrice * 0.07).toFixed(2);
// คำนวณราคาทั้งหมดและ VAT
const calculatedVAT = products.reduce((acc, product) => {
    return acc + (parseFloat(product.price) * parseFloat(product.quantity) * 7 / 100);
}, 0);
const totalPrice = products.reduce((acc, product) => {
    return acc + (parseFloat(product.price) * parseFloat(product.quantity));
}, 0) + calculatedVAT;

useEffect(() => {
    loadData();
    getproduct();
}, []);

    return (
        <div className='h-screen w-screen bg-gray-100  overflow-auto p-8'>
        <div className=" flex flex-col space-y-4 mt-0 ml-0 mb-4  ">
                <div className="flex justify-between items-center mb-3">
                    <h3>แก้ไขใบเสนอราคา</h3>
                    <Button onClick={() => navigate('/Quotation')} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
                </div >
                <form onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <p>เลขที่ใบเสนอราคา: {no_quotation}</p>
                    </div>
                    <div class="mb-3">
                        <label for="title-name" class="form-label">ชื่อหัวข้อ</label>
                        <input type="text" class="form-control" id="title-name" name="name" value={title_quotation}
                            onChange={(event) => { settitle_quotation(event.target.value) }} />
                    </div>

                    <div class="mb-3">
                        <label for="Date" class="form-label">วันที่</label>
                        <input type="text" class="form-control" id="date" name="name" value={new Date(date_).toLocaleDateString('en-GB')}
                            onChange={(event) => { setdate_(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="Address-user" class="form-label">ที่อยู่ลูกค้า</label>
                        <input type="text" class="form-control" id="Address-user" name="name" value={address_user}
                            onChange={(event) => { setaddress_user(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="Email" class="form-label">อีเมล์</label>
                        <input type="text" class="form-control" id="Email" name="name" value={email}
                            onChange={(event) => { setemail(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="Phone-admin" class="form-label">หมายเลขโทรศัพท์แอดมิน</label>
                        <input type="text" class="form-control" id="Phone-admin" name="name" value={phone_admin}
                            onChange={(event) => { setphone_admin(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="Phone-user" class="form-label">หมายเลขโทรศัพท์ลูกค้า</label>
                        <input type="text" class="form-control" id="Phone-user" name="name" value={phone_user}
                            onChange={(event) => { setphone_user(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="Id-tax-user" class="form-label">หมายเลขเสียภาษีของลูกค้า</label>
                        <input type="text" class="form-control" id="Id-tax-user" name="name" value={id_tax_user}
                            onChange={(event) => { setid_tax_user(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="Id-tax-admin" class="form-label">หมายเลขเสียภาษีของพนักงาน</label>
                        <input type="text" class="form-control" id="Id-tax-admin" name="name" value={id_tax_admin}
                            onChange={(event) => { setid_tax_admin(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="Annotation" class="form-label">หมายเหตุ</label>
                        <input type="text" class="form-control" id="Annotation" name="name" value={annotation}
                            onChange={(event) => { setannotation(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <h2>สินค้า</h2>
                        {products.map((product, index) => (
                            <div key={index}>
                                <p>รหัสสินค้า: {product.product_id} {product.product_name} จำนวน: {product.quantity} เครื่อง ราคา: {product.price}   </p>
                                <input class="form-control" type="text" defaultValue={product.price} onChange={handleChange}></input>
                                <Button onClick={() => updated(product.cart_id)}>อัพเดทราคา</Button>


                            </div>
                        ))}
                    </div>
                    <div class="mb-3">
                        <label for="vat" class="form-label">จำนวนภาษีมูลค่าเพิ่ม 7%</label>
                        <input type="text" class="form-control" id="vat" name="name" value={calculatedVAT}
                            />
                    </div>
                    <div class="mb-3">
                        <label for="total_vat" class="form-label">ราคารวมมูลค่าภาษี</label>
                        <input type="text" class="form-control" id="total_vat" name="name" value={totalPrice}
                            />
                    </div>
                    <br></br>
                    <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
                </form>
            </div>
        </div>
    )
}