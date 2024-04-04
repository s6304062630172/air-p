import axios from 'axios';
import { event } from 'jquery';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


export default function Editcheckstatus() {
    
    const {purchase_id} = useParams();
    const [payment_amount, setpayment_amount] = useState("");
    const [payment_status, setpayment_status] = useState("");
    const [work_status, setwork_status] = useState("");
    const [date, setdate] = useState("");
    const [time, settime] = useState("");
    const [date_book, setdate_book] = useState("");
    const [time_book, settime_book] = useState("");
    const [pay_type ,setpay_type] = useState("");
    const [timestart_book, settimestart_book] = useState("");
    const [email, setemail] = useState("");
    const [timestop_book, settimestop_book]= useState("");
    const [checkstatusList, setcheckstatusList] = useState([]);
    useEffect(()=>{
        axios.get(`http://localhost:3001/Editcheckstatus/${purchase_id}`)
        .then(res => {
            setpayment_amount(res.data[0].payment_amount)
            setpayment_status(res.data[0].payment_status)
            setdate(res.data[0].date)
            settime(res.data[0].time)
            setdate_book(res.data[0].date_book)
            settime_book(res.data[0].time_book)
            setpay_type(res.data[0].pay_type)
            settimestart_book(res.data[0].timestart_book)
            settimestop_book(res.data[0].timestop_book)
            setemail(res.data[0].email)
            setwork_status(res.data[0].work_status)
        })
        .catch(err => console.log(err))

    },[])
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
    return (
        <div>
            <div class="container mt-5">
            <h3>ตรวจสอบการชำระเงิน</h3>
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
                        <label for="title-name" class="form-label">ยอดเงินที่ต้องชำระ:</label>
                        <span >{payment_amount}</span>
                        </div>
                        <div class="mb-3">
                        <label for="title-name" class="form-label">วันที่ชำระเงิน:</label>
                        <span >{date}</span>
                        </div>
                        <div class="mb-3">
                        <label for="title-name" class="form-label">หลักฐานการชำระเงิน:</label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">บันทึก</button>
                </form>
            </div>
            <div>  
                            {/* เแสดง dropdown status 
                    <select required onChange={(event) => { setpayment_status(event.target.value) }}>
                    <option value="">Select status</option>
                    {paymentStatus.map((type, index) => (
                    <option key={index} value={type.payment_status}>{type.payment_status}</option>
                        ))}
                    </select>  */}

                    </div> 



        </div>
    )
}