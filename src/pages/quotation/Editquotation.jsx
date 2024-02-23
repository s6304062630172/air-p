import axios from 'axios';
import { event } from 'jquery';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


export default function Editquotation() {
    
    const {no_quotation} = useParams();
    const [title_quotation,settitle_quotation] = useState('')
    const [phone_admin, setphone_admin] = useState('');
    const [address_user, setaddress_user] = useState('');
    const [phone_user, setphone_user] = useState('');
    const [date_, setdate_] = useState('');
    const [annotation, setannotation] = useState('');
    const [id_tax_user, setid_tax_user] = useState('');
    const [id_tax_admin, setid_tax_admin] = useState('');
    const [email, setemail] = useState('');
    useEffect(()=>{
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
        })
        .catch(err => console.log(err))

    },[])
    const navigate =  useNavigate();

    const hanldeSubmit = (event) => {
        event.preventDefault();
        
        axios.put(`http://localhost:3001/updatequ/${no_quotation}` , { title_quotation,phone_admin,address_user,phone_user,date_,annotation,id_tax_user,id_tax_admin,email }) 
        .then(res=>{
            if(res.data.updated){
                navigate('/quotation')

            }else{
                alert("Not updated")
            }
        })
    }

    return (
        <div>


            <div class="container mt-5">
                <h1>แก้ไขใบเสนอราคา</h1>

                <form onSubmit={hanldeSubmit}>
                    <div class="mb-3">
                        <label for="title-name" class="form-label">ชื่อหัวข้อ</label>
                        <input type="text" class="form-control" id="title-name" name="name" value={title_quotation} 
                        onChange={(event) => { settitle_quotation(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="Date" class="form-label">วันที่</label>
                        <input type="text" class="form-control" id="date" name="name" value={date_} 
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
                    <button type="submit" class="btn btn-primary">บันทึก</button>
                </form>
            </div>




        </div>
    )
}