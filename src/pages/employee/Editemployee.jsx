import axios from 'axios';
import { event } from 'jquery';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


export default function Editemployee() {
    
    const {employee_id} = useParams();
    const [employee_name,setemployee_name] = useState('')
    const [employee_surname, setemployee_surname] = useState('');
    const [employee_phone, setemployee_phone] = useState('');
    const [employee_position, setemployee_position] = useState('');
    useEffect(()=>{
        axios.get(`http://localhost:3001/Editemployee/${employee_id}`)
        .then(res => {
            setemployee_name(res.data[0].employee_name)
            setemployee_surname(res.data[0].employee_surname)
            setemployee_phone(res.data[0].employee_phone)
            setemployee_position(res.data[0].employee_position)
        })
        .catch(err => console.log(err))

        


    },[])
    const navigate =  useNavigate();
    const select_position = employee_position
    const hanldeSubmit = (event) => {
        event.preventDefault();
        
        axios.put(`http://localhost:3001/updateemployee/${employee_id}` , { employee_name,employee_surname,employee_phone,employee_position }) 
        .then(res=>{
            if(res.data.updated){
                navigate('/employee')

            }else{
                alert("Not updated")
            }
        })
    }

    return (
        <div>


            <div class="container mt-5">
                <h1>แก้ไขข้อมูลพนักงาน</h1>

                <form onSubmit={hanldeSubmit}>
                    <div class="mb-3">
                        <label for="employee-name" class="form-label">ชื่อพนักงาน</label>
                        <input type="text" class="form-control" id="employee-name" name="name" value={employee_name} 
                        onChange={(event) => { setemployee_name(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="employee-surname" class="form-label">นามสกุลพนักงาน</label>
                        <input type="text" class="form-control" id="employee-surname" name="name" value={employee_surname} 
                        onChange={(event) => { setemployee_surname(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="employee-phone" class="form-label">เบอร์โทรศัพท์พนักงาน</label>
                        <input type="text" class="form-control" id="employee-phone" name="name" value={employee_phone} 
                        onChange={(event) => { setemployee_phone(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="employee-position" class="form-label">ระบุตำแหน่ง</label>
                        
                        <select onChange={(event) => { setemployee_position(event.target.value) }} >
                            
                            <option value="Intern" selected={select_position === 'Intern'}>Intern</option>
                            <option value="Mechanic" selected={select_position === 'Mechanic'}>Mechanic</option>
                            <option value="Admin" selected={select_position === 'Admin'}>Admin</option>
                        </select >
                    </div>
         
                    <button type="submit" class="btn btn-primary">บันทึก</button>
                </form>
            </div>




        </div>
    )
}