import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "@material-tailwind/react";

export default function Editcheckstatus() {
    
    const {purchase_id} = useParams();
    const [payment_amount, setpayment_amount] = useState("");
    const [payment_status, setpayment_status] = useState("");
    const [work_status, setwork_status] = useState("");
    const [date, setdate] = useState("");
    const [email, setemail] = useState("");
    const [product_name, setproduct_name] = useState("");
    const [quantity, setquantity] = useState("");
    const [product_btu, setproduct_btu] = useState("");
    const [pay_type, setpay_type] = useState("");

 useEffect(()=>{
    axios.get(`http://localhost:3001/Editcheckstatus/${purchase_id}`)
    .then(res => {
        setpayment_amount(res.data[0].payment_amount)
        setpayment_status(res.data[0].payment_status)
        setdate(res.data[0].date)
        setemail(res.data[0].email)
        setwork_status(res.data[0].work_status)
        setproduct_name(res.data[0].product_name)
        setquantity(res.data[0].quantity)
        setproduct_btu(res.data[0].product_btu)
        setpay_type(res.data[0].pay_type)
    })
    .catch(err => console.log(err))

}, [purchase_id]) // ทำการเพิ่ม purchase_id เข้าไปใน dependency array
    const navigate =  useNavigate();

    const hanldeSubmit = (event) => {
        event.preventDefault();
        
        axios.put(`http://localhost:3001/updatecheckstatus/${purchase_id}` , { payment_status,work_status }) 
        .then(res=>{
            if(res.data.updated){
                navigate('/checkstatus')

            }else{
                alert("Not updated")
            }
        })
    }

    //email
    const notifyEmail = async () => {
        const message = `เลขใบสั่งซื้อ: ${purchase_id}\nสถานะการชำระเงิน: ${payment_status}\nยอดชำระเงิน: ${payment_amount}\nสินค้า: ${product_name}\nจำนวน: ${quantity}\nBTU: ${product_btu}`;
        try {
            await axios.post(
                'http://localhost:3001/notifyEmail',
                { email, message },
           
            );
            console.log('Email notification sent successfully');
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    };
    return (
        <div>
            <div class="container mt-5">
            <div className="flex justify-between items-center mb-3">
                <h3>ตรวจสอบการชำระเงิน</h3>
                <Button onClick={() => navigate('/checkstatus')} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
            </div>
                <form onSubmit={hanldeSubmit}>
                <div class="mb-3">
                    <div>
                        <label for="title-name" class="form-label">สถานะการชำระเงิน</label>
                        <select onChange={(event) => { setpayment_status(event.target.value) }}>
                            <option selected value="">เปลี่ยนสถานะ</option>
                            <option value={"รอตรวจสอบ"}>รอตรวจสอบ</option>
                            <option value={"ชำระสำเร็จ"}>ชำระสำเร็จ</option>
                            <option value={"ชำระไม่สำเร็จ"}>ชำระไม่สำเร็จ</option>
                        </select>
                        </div>
                        <div>
                        <label for="title-name" class="form-label">สถานะงาน</label>
                        <select onChange={(event) => { setwork_status(event.target.value) }}>
                            <option selected value="">เปลี่ยนสถานะ</option>
                            <option value={"รอตรวจสอบ"}>รอตรวจสอบ</option>
                            <option value={"ดำเนินงาน"}>ดำเนินงาน</option>
                        </select>
                        </div>
                        <div class="mb-3">
                        <label for="title-name" class="form-label">เลขใบสั่งซื้อ:</label>
                        <span >{purchase_id}</span>
                        </div>
                        <div class="mb-3">
                        <label for="title-name" class="form-label">อีเมล์:</label>
                        <span >{email}</span>
                        </div>
                        <div class="mb-3">
                        <label for="title-name" class="form-label">ยอดเงินที่ต้องชำระ:</label>
                        <span >{payment_amount}</span>
                        </div>
                        <div class="mb-3">
                        <label for="title-name" class="form-label">วันที่ชำระเงิน:</label>
                        <span >{date}</span>
                        </div>
                        <div class="mb-3">
                        <label for="title-name" class="form-label">ประเภทการชำระเงิน:</label>
                        <span >{pay_type}</span>
                        </div>
                        <div class="mb-3">
                        <label for="title-name" class="form-label">หลักฐานการชำระเงิน:</label>
                        </div>
                    </div>
                    <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">
                    บันทึก
                    </Button>
                    <Button onClick={notifyEmail} color="red" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">
                    แจ้งเตือน Email
                    </Button>
                </form>
            </div>
         
        </div>
    )
}